import React, { useRef, useEffect } from "react";
import * as THREE from 'three';

const HumanoidAvatar = ({ isTalking, emotion }) => {
  const headRef = useRef();
  const mouthRef = useRef();
  const eyebrowsRef = useRef();

  React.useEffect(() => {
    let animationFrameId;
    
    const animate = () => {
      if (headRef.current) {
        if (isTalking) {
          headRef.current.rotation.y = Math.sin(Date.now() * 0.002) * 0.08;
          
          if (mouthRef.current) {
            mouthRef.current.scale.y = 0.5 + Math.sin(Date.now() * 0.015) * 0.5;
          }
        } else {
          headRef.current.rotation.y = Math.sin(Date.now() * 0.0008) * 0.03;
          
          if (mouthRef.current) {
            mouthRef.current.scale.y = 1;
          }
        }
        
        if (eyebrowsRef.current) {
          switch (emotion) {
            case "happy":
              eyebrowsRef.current.rotation.x = -0.2;
              break;
            case "sad":
              eyebrowsRef.current.rotation.x = 0.3;
              break;
            case "angry":
              eyebrowsRef.current.rotation.x = 0.3;
              eyebrowsRef.current.rotation.z = 0.2;
              break;
            case "surprised":
              eyebrowsRef.current.position.y = 0.22;
              break;
            default: // neutral
              eyebrowsRef.current.rotation.x = 0;
              eyebrowsRef.current.rotation.z = 0;
              eyebrowsRef.current.position.y = 0.2;
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isTalking, emotion]);
  
  return (
    <group>
      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#e8c4a0" metalness={0.2} roughness={0.8} />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#3a2618" metalness={0.1} roughness={0.9} />
        </mesh>
        
        {/* Eyes */}
        <group>
          {/* Left eye */}
          <mesh position={[-0.15, 0.1, 0.4]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[-0.15, 0.1, 0.48]}>
            <sphereGeometry args={[0.04, 32, 32]} />
            <meshStandardMaterial color="#2b5797" />
          </mesh>
          
          {/* Right eye */}
          <mesh position={[0.15, 0.1, 0.4]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0.15, 0.1, 0.48]}>
            <sphereGeometry args={[0.04, 32, 32]} />
            <meshStandardMaterial color="#2b5797" />
          </mesh>
        </group>
        
        {/* Eyebrows */}
        <group ref={eyebrowsRef} position={[0, 0.2, 0]}>
          <mesh position={[-0.15, 0, 0.45]} rotation={[0, 0, Math.PI * 0.1]}>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial color="#3a2618" />
          </mesh>
          <mesh position={[0.15, 0, 0.45]} rotation={[0, 0, -Math.PI * 0.1]}>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial color="#3a2618" />
          </mesh>
        </group>
        
        {/* Nose */}
        <mesh position={[0, 0, 0.45]}>
          <coneGeometry args={[0.05, 0.1, 32]} />
          <meshStandardMaterial color="#e0b088" metalness={0.1} roughness={0.7} />
        </mesh>
        
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.15, 0.4]}>
          <boxGeometry args={[0.2, 0.03, 0.01]} />
          <meshStandardMaterial color="#a83232" />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.3, 32]} />
          <meshStandardMaterial color="#e8c4a0" metalness={0.2} roughness={0.8} />
        </mesh>
      </group>
      
      {/* Body (professional looking) */}
      <group position={[0, -0.8, 0]}>
        {/* Shirt/Suit */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.7, 0.8, 0.3]} />
          <meshStandardMaterial color="#2b5797" metalness={0.3} roughness={0.7} />
        </mesh>
        
        {/* Collar */}
        <mesh position={[0, -0.05, 0.15]}>
          <boxGeometry args={[0.4, 0.1, 0.05]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.45, -0.3, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 32]} />
          <meshStandardMaterial color="#2b5797" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0.45, -0.3, 0]} rotation={[0, 0, Math.PI * 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 32]} />
          <meshStandardMaterial color="#2b5797" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

export default HumanoidAvatar; 