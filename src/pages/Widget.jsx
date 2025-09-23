import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Chatbot3D from "../components/chatbot/Chatbot3D";

const CLIENTS = {
  VKAIKEY: {
    name: "VKai",
    logo: "/2.png",
    theme: {
      primaryColor: "#56ccc3",
      secondaryColor: "#353a96",
      primaryShadow: "rgba(86, 204, 195, 0.15)"
    }
  },
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Widget = () => {
  const query = useQuery();
  const key = query.get("key");
  const size = query.get("size") || "normal";
  const client = CLIENTS[key];
  const containerRef = useRef(null);

  if (!client) {
    return <div>Invalid or missing widget key.</div>;
  }

  // Define responsive sizes that work with iframe containers
  const sizes = {
    small: { width: "100%", height: "100%", maxWidth: "350px", maxHeight: "500px" },
    normal: { width: "100%", height: "100%", maxWidth: "400px", maxHeight: "600px" },
    large: { width: "100%", height: "100%", maxWidth: "500px", maxHeight: "700px" },
    xlarge: { width: "100%", height: "100%", maxWidth: "600px", maxHeight: "800px" }
  };

  const currentSize = sizes[size] || sizes.normal;

  // Handle iframe communication and resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && window.parent !== window) {
        const rect = containerRef.current.getBoundingClientRect();
        window.parent.postMessage({
          type: 'IFRAME_RESIZE',
          width: rect.width,
          height: rect.height
        }, '*');
      }
    };

    // Initial resize
    handleResize();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: "100%", 
        height: "100vh", 
        position: "relative",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{
        width: currentSize.width,
        height: currentSize.height,
        maxWidth: currentSize.maxWidth,
        maxHeight: currentSize.maxHeight,
        position: "relative"
      }}>
        <Chatbot3D 
          widgetMode={true} 
          clientName={client.name} 
          clientLogo={client.logo}
          clientTheme={client.theme}
          widgetSize={currentSize}
        />
      </div>
    </div>
  );
};

export default Widget; 