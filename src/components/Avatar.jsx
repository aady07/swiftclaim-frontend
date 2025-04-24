import React, { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from 'three';

const Avatar = ({ isTalking, emotion, isFullPage = false }) => {

  const { scene } = useGLTF("/avatar.glb");
  const headRef = useRef();

  // Calculate position and scale once and store in ref
  const positionScale = useMemo(() => {
    if (!scene) return null;
    
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = isFullPage ? 4.8 / maxDim : 3.5 / maxDim;
    
    return {
      position: {
        x: -center.x,
        y: isFullPage ? -center.y - 3.5 : -center.y - 2.2,
        z: -center.z
      },
      scale
    };
  }, [scene, isFullPage]);

  // Apply position and scale consistently
  useEffect(() => {
    if (!scene || !positionScale) return;
    
    scene.position.set(
      positionScale.position.x,
      positionScale.position.y,
      positionScale.position.z
    );
    scene.scale.setScalar(positionScale.scale);
    
    // Cleanup function to reset position and scale
    return () => {
      scene.position.set(0, 0, 0);
      scene.scale.setScalar(1);
    };
  }, [scene, positionScale]);

  // Material configuration
  useEffect(() => {
    if (!scene) return;
    
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.toneMapped = true;
        child.material.envMapIntensity = 1.0;
        child.material.needsUpdate = true;
        child.material.metalness = 0.1;
        child.material.roughness = 0.7;
      }
    });
  }, [scene]);

  // Animation logic (unchanged)
  useFrame(({ clock }) => {
    const headMesh = scene.getObjectByName('Wolf3D_Head') || headRef.current;
    if (!headMesh?.morphTargetDictionary) return;
  
    const morphDict = headMesh.morphTargetDictionary;
    const influences = headMesh.morphTargetInfluences;
  
    // 👄 Enhanced Lip Sync with natural movement
    if (isTalking) {
      // Use sine wave for natural mouth movement during speech
      const time = clock.getElapsedTime();
      influences[morphDict["mouthOpen"]] = Math.sin(time * 10) * 0.4 + 0.5; // Oscillates between 0.1 and 0.9
    } else {
      influences[morphDict["mouthOpen"]] = 0;
    }
  
    // 👀 Auto-blink (unchanged)
    if (Math.random() > 0.995 && !isTalking) {
      influences[morphDict["EyeLeft"]] = 1;
      influences[morphDict["EyeRight"]] = 1;
      setTimeout(() => {
        influences[morphDict["EyeLeft"]] = 0;
        influences[morphDict["EyeRight"]] = 0;
      }, 200);
    }
  
    // 🎭 Expressions (unchanged)
    switch (emotion) {
      case "happy":
        influences[morphDict["mouthSmile"]] = 1;
        break;
      case "sad":
        influences[morphDict["EyeLeft"]] = 0.3;
        influences[morphDict["EyeRight"]] = 0.3;
        break;
      case "angry":
        influences[morphDict["EyeLeft"]] = 0.5;
        influences[morphDict["EyeRight"]] = 0.5;
        break;
      case "surprised":
        influences[morphDict["mouthOpen"]] = 1;
        break;
      default:
        // Reset all expressions except mouth during speech
        Object.entries(morphDict).forEach(([name, index]) => {
          if (name !== "mouthOpen" || !isTalking) {
            influences[index] = 0;
          }
        });
    }
  });

  return (
    <>
      {/* Lighting matching glTF Viewer exactly */}
      <Environment 
        preset="studio"
        background
        blur={0.5}
      />
      <ambientLight 
        intensity={0.3} 
        color="#ffffff"  // White ambient light
      />
      <directionalLight
        intensity={2.5}
        color="#ffffff"  // White direct light
        position={[5, 5, 5]}
        castShadow
      />
      
      {/* Avatar with morph targets */}
      <primitive 
        object={scene} 
        ref={headRef}
      />
    </>
  );
};

export default Avatar;