import { Analytics } from "@vercel/analytics/react";
import Intro from "./components/Intro";

const App = () => {
  return (
    <div className="App">
      <Intro />
      <Analytics />
     
    </div>
  );
};

export default App;
