import { useState } from "react";

export default function useVisualMode(initial) {
    const [mode, setMode] = useState(initial);
    const [history, setHistory] = useState([initial]); 
  
    // Transition to a new mode
    function transition(newMode, replace = false) {
        if (replace) {
          setHistory(prev => prev.slice(0, -1));
          setHistory(prev => [...prev, newMode]);
          } else {
            setHistory(prev => [...prev, newMode]); 
          }
          setMode(newMode);
    }

  
  // Go back to the previous mode
  function back() {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
      setMode(history[history.length - 2]);
    }
  }

  return { mode, transition, back };
}
  