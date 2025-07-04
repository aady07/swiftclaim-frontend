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
  const client = CLIENTS[key];

  if (!client) {
    return <div>Invalid or missing widget key.</div>;
  }

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
      />
    </div>
  );
};

export default Widget; 