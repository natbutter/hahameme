import React from 'react';
import './App.css';
import MemeGenerator from './MemeGenerator';
import Link from './Link';  // Import the Link component

function App() {
  return (
    <div className="App">
      <MemeGenerator />
      <Link href="https://www.dextools.io/app/en/token/inmemeswetrust?t=1725172851659">Buy this stupid shit LTT</Link>  {/* Add Link component */}
    </div>
  );
}

export default App;
