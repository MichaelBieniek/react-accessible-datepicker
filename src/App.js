import React from "react";
import "./App.css";
import Datepicker from "./Datepicker";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Datepicker handleChange={e => console.log(e)} disabledDays={{ before: new Date(2019, 6, 21) }} />
      </header>
    </div>
  );
}

export default App;
