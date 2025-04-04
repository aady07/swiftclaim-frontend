import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from 'three';

const Avatar = ({ isTalking, emotion, isFullPage = false }) => {

  const { scene } = useGLTF("/avatar.glb");
  const headRef = useRef();

  // Material configuration based on glTF Viewer
  useEffect(() => {
    if (!scene) return;
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Different positioning based on context
    scene.position.x = -center.x;
    
    // Different Y positioning based on whether we're in full page or sidebar
    if (isFullPage) {
      scene.position.y = -center.y - 3.5; // Less offset for full page
      scene.position.z = -center.z;
      
      // Different scaling for full page
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4.8 / maxDim; // Smaller scale for full page view
      scene.scale.set(scale, scale, scale);
    } else {
      scene.position.y = -center.y - 2.2; // More vertical offset for sidebar
      scene.position.z = -center.z;
      
      // Original scaling for sidebar
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.5 / maxDim;
      scene.scale.set(scale, scale, scale);
    }
    scene.traverse((child) => {
      if (child.isMesh) {
        // Match viewer's material settings
        child.material.toneMapped = true; // Using Linear tone mapping
        child.material.envMapIntensity = 1.0;
        child.material.needsUpdate = true;
        
        // Optimize material properties
        child.material.metalness = 0.1;
        child.material.roughness = 0.7;
      }
    });
  }, [scene, isFullPage]);

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