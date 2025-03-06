import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const AuroraHero = () => {
  const color = useMotionValue(COLORS_TOP[0]);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);
  
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%,${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  const handleStartTrial = () => {
    navigate("/claim-upload");
  };

  return (
    <motion.div
      className="relative grid min-h-screen place-content-center overflow-hidden bg-nile-700 px-4 py-24 text-gray-200"
      style={{
        backgroundImage,
        backgroundPosition: `center ${scrollY * 0.5}px`,
      }}
    >
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="max-w-3xl bg-gradient-to-br from-gray-400 to-white bg-clip-text text-center text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl">
          DRIVE AI INNOVATION WITH TECHIESS.AI
        </h1>
        <p className="my-6 max-w-xl text-center text-lg leading-relaxed md:text-2xl text-gray-200">
          Techiess.ai empowers businesses with cutting-edge AI solutions,
          transforming ideas into intelligent products. We deliver innovation,
          efficiency, and AI-driven excellence to scale your success.
        </p>
        <motion.button
          onClick={handleStartTrial}
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "#1E67C6",
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-950/50"
        >
          Start Free Trial
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12"></FiArrowRight>
        </motion.button>
      </div>
      <div className="absolute inset-0 z-0">
        <Canvas color="red">
          <Stars radius={50} count={2500} factor={4} fade speed={2}></Stars>
        </Canvas>
      </div>
    </motion.div>
  );
};

export default AuroraHero;
