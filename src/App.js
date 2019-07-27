import React from "react";
import "./App.css";
import Datepicker from "./Datepicker";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Datepicker
          dateFormat="DD-MM-YYYY"
          defaultValue="25-07-2019"
          disabledDays={{ before: new Date(2019, 6, 21) }}
          onChange={e => console.log(e)}
        />
      </header>
    </div>
  );
}

export default App;
