import React from "react";
import { useLocation } from "react-router-dom";
import Chatbot3D from "../components/chatbot/Chatbot3D";

const CLIENTS = {
  VKAIKEY: {
    name: "VKai",
    logo: "/2.png",
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

  if (!client) {
    return <div>Invalid or missing widget key.</div>;
  }

  // Define sizes
  const sizes = {
    small: { width: "350px", height: "500px" },
    normal: { width: "400px", height: "600px" },
    large: { width: "500px", height: "700px" },
    xlarge: { width: "600px", height: "800px" }
  };

  const currentSize = sizes[size] || sizes.normal;

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      position: "relative",
      background: "transparent" 
    }}>
      <Chatbot3D 
        widgetMode={true} 
        clientName={client.name} 
        clientLogo={client.logo}
        widgetSize={currentSize}
      />
    </div>
  );
};

export default Widget; 