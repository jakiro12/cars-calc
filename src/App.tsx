import { useState } from "react";
import "./App.css";
import InvestmentCalculator from "./calcScreens/InvestmentCalculator";

import MainScreenCalc from "./calcScreens/mainScreen";
import { calcsOptions } from "./utils/calcsOptions";



const App=()=> {
  let setCal;
  const[currentCalc,setCurrentCal]=useState<string|null>(null)
  switch (currentCalc) {
    case "main":
      setCal =<MainScreenCalc/>
      break;
    case "investment":
      setCal=<InvestmentCalculator/>
      break;
    default:
      setCal =<MainScreenCalc/>      
      break;
  }
  return (
   <article
   className="main-container"
   >
   <header
    className="header-options"
   >
    {calcsOptions.map((e,i)=>
    <button
      onClick={()=>setCurrentCal(e)}
      key={i}
    >
      {e}
    </button>
    )}
   </header>
   <main
   style={{width:'100%'}}
   >
    {setCal}
   </main>
   </article>
  );
}

export default App;