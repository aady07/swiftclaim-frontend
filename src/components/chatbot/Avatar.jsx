import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Avatar = ({ audioStream, isTalking = false }) => {
  const group = useRef();
  const headRef = useRef();
  const teethRef = useRef();
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const audioContext = useRef(null);
  const sourceNode = useRef(null);

  const { scene: avatarScene } = useGLTF('/avatar.glb');
  const { animations: idleAnims } = useGLTF('/idle_withskin.glb');
  const { actions, mixer } = useAnimations(idleAnims, group);

  const morphIndices = useRef({
    eyeBlinkLeft: -1,
    eyeBlinkRight: -1,
    jawOpen: -1,
    mouthClose: -1,
    mouthFunnel: -1,
    mouthPucker: -1,
    mouthSmileLeft: -1,
    mouthSmileRight: -1,
  });

  const blinkState = useRef({
    timer: 0,
    value: 0,
    isBlinking: false,
    interval: 3,
  });

  const mouthState = useRef({
    previousOpenValue: 0,
    closeTimer: 0,
    isClosing: false,
    closeDuration: 0.1,
    closeInterval: 0.3 + Math.random() * 0.5, // Random interval between mouth closes
    closeIntensity: 0,
  });

  // Setup modelss
  useEffect(() => {
    if (!avatarScene || !actions || idleAnims.length === 0) return;

    const head = avatarScene.getObjectByName('Wolf3D_Head');
    const teeth = avatarScene.getObjectByName('Wolf3D_Teeth');

    if (head) {
      headRef.current = head;
      if (head.morphTargetDictionary) {
        morphIndices.current = {
          eyeBlinkLeft: head.morphTargetDictionary['eyeBlinkLeft'] ?? -1,
          eyeBlinkRight: head.morphTargetDictionary['eyeBlinkRight'] ?? -1,
          jawOpen: head.morphTargetDictionary['jawOpen'] ?? -1,
          mouthClose: head.morphTargetDictionary['mouthClose'] ?? -1,
          mouthFunnel: head.morphTargetDictionary['mouthFunnel'] ?? -1,
          mouthPucker: head.morphTargetDictionary['mouthPucker'] ?? -1,
          mouthSmileLeft: head.morphTargetDictionary['mouthSmileLeft'] ?? -1,
          mouthSmileRight: head.morphTargetDictionary['mouthSmileRight'] ?? -1,
        };
      }
    }

    if (teeth) {
      teethRef.current = teeth;
    }

    // Play idle animation
    const idleAction = actions[idleAnims[0]?.name];
    if (idleAction) {
      // Silently handle missing animation targets
      try {
        idleAction.reset().fadeIn(0.5).play();
        idleAction.setLoop(THREE.LoopRepeat);
      } catch {
        // Continue with animation even if some targets are missing
        idleAction.reset().fadeIn(0.5).play();
        idleAction.setLoop(THREE.LoopRepeat);
      }
    }
  }, [avatarScene, actions, idleAnims]);

  // Setup Audio Analyser
  useEffect(() => {
    if (audioStream) {
      audioContext.current = new AudioContext();
      sourceNode.current = audioContext.current.createMediaStreamSource(audioStream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 512;
      sourceNode.current.connect(analyser.current);

      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);
    }

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [audioStream]);

  useFrame((state, delta) => {
    if (!headRef.current) return;

    // Update mixer for animations
    if (mixer) mixer.update(delta);

    // === BLINK LOGIC ===
    blinkState.current.timer += delta;
    if (!blinkState.current.isBlinking && blinkState.current.timer >= blinkState.current.interval) {
      blinkState.current.isBlinking = true;
      blinkState.current.timer = 0;
    }

    if (blinkState.current.isBlinking) {
      blinkState.current.value += delta / 0.25;
      const progress = Math.sin(blinkState.current.value * Math.PI);
      const intensity = THREE.MathUtils.clamp(progress, 0, 1);

      if (morphIndices.current.eyeBlinkLeft !== -1)
        headRef.current.morphTargetInfluences[morphIndices.current.eyeBlinkLeft] = intensity;
      if (morphIndices.current.eyeBlinkRight !== -1)
        headRef.current.morphTargetInfluences[morphIndices.current.eyeBlinkRight] = intensity;

      if (blinkState.current.value >= 1) {
        blinkState.current.isBlinking = false;
        blinkState.current.value = 0;
        blinkState.current.interval = 2 + Math.random() * 3;
      }
    }

    // === MOUTH MOVEMENT BASED ON AUDIO ===
    let rawOpenValue = 0;

    if (isTalking && analyser.current && dataArray.current) {
      analyser.current.getByteTimeDomainData(dataArray.current);
      let sum = 0;
      for (let i = 0; i < dataArray.current.length; i++) {
        const normalized = dataArray.current[i] / 128 - 1;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / dataArray.current.length);
      rawOpenValue = THREE.MathUtils.clamp((rms - 0.02) * 6, 0, 1);

      // Smoothing
      const smoothing = 0.3;
      rawOpenValue = THREE.MathUtils.lerp(mouthState.current.previousOpenValue, rawOpenValue, smoothing);
      mouthState.current.previousOpenValue = rawOpenValue;
    }

    // === MOUTH CLOSING DURING SPEECH ===
    if (isTalking) {
      mouthState.current.closeTimer += delta;
      
      // Check if it's time to close the mouth
      if (!mouthState.current.isClosing && mouthState.current.closeTimer >= mouthState.current.closeInterval) {
        mouthState.current.isClosing = true;
        mouthState.current.closeTimer = 0;
        mouthState.current.closeDuration = 0.05 + Math.random() * 0.15; // Random close duration
        mouthState.current.closeInterval = 0.2 + Math.random() * 0.6; // Random interval until next close
      }

      // Handle mouth closing animation
      if (mouthState.current.isClosing) {
        mouthState.current.closeIntensity += delta / mouthState.current.closeDuration;
        
        if (mouthState.current.closeIntensity >= 1) {
          mouthState.current.isClosing = false;
          mouthState.current.closeIntensity = 0;
        }
      } else {
        mouthState.current.closeIntensity = Math.max(0, mouthState.current.closeIntensity - delta / 0.1);
      }

      // Calculate final open value with closing effect
      const closeEffect = Math.sin(mouthState.current.closeIntensity * Math.PI);
      const openValue = rawOpenValue * (1 - closeEffect * 0.8); // Reduce openness during close

      // Apply mouth movements
      if (morphIndices.current.jawOpen !== -1) {
        headRef.current.morphTargetInfluences[morphIndices.current.jawOpen] = 
          THREE.MathUtils.lerp(0.4, 1.0, openValue);
      }

      // Apply mouthClose morph target during closing
      if (morphIndices.current.mouthClose !== -1) {
        headRef.current.morphTargetInfluences[morphIndices.current.mouthClose] = 
          closeEffect * 0.7;
      }

      if (teethRef.current && teethRef.current.morphTargetDictionary?.jawOpen !== undefined) {
        const teethJawIndex = teethRef.current.morphTargetDictionary.jawOpen;
        teethRef.current.morphTargetInfluences[teethJawIndex] = 
          THREE.MathUtils.lerp(0.7, 1.0, openValue);
      }

      // Other mouth expressions
      if (morphIndices.current.mouthFunnel !== -1)
        headRef.current.morphTargetInfluences[morphIndices.current.mouthFunnel] = openValue * 0.5;

      if (morphIndices.current.mouthPucker !== -1)
        headRef.current.morphTargetInfluences[morphIndices.current.mouthPucker] = openValue * 0.3;

      if (morphIndices.current.mouthSmileLeft !== -1)
        headRef.current.morphTargetInfluences[morphIndices.current.mouthSmileLeft] = openValue * 0.2;

      if (morphIndices.current.mouthSmileRight !== -1)
        headRef.current.morphTargetInfluences[morphIndices.current.mouthSmileRight] = openValue * 0.2;
    } else {
      // Reset mouth smoothly when not talking
      Object.entries(morphIndices.current).forEach(([key, index]) => {
        if (index !== -1) {
          headRef.current.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            headRef.current.morphTargetInfluences[index] || 0,
            0,
            0.1
          );
        }
      });

      if (teethRef.current && teethRef.current.morphTargetDictionary?.jawOpen !== undefined) {
        const teethJawIndex = teethRef.current.morphTargetDictionary.jawOpen;
        teethRef.current.morphTargetInfluences[teethJawIndex] = THREE.MathUtils.lerp(
          teethRef.current.morphTargetInfluences[teethJawIndex] || 0,
          0,
          0.1
        );
      }

      // Reset mouth state
      mouthState.current.closeTimer = 0;
      mouthState.current.isClosing = false;
      mouthState.current.closeIntensity = 0;
      mouthState.current.previousOpenValue = 0;
    }
  });

  return (
    <group ref={group}>
      <primitive object={avatarScene} position={[-0.1, -2.15, 0.1]} scale={[1.4, 1.37, 1.37]} />
    </group>
  );
};

export default Avatar;