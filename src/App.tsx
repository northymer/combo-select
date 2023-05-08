import React, { useState } from "react";
import "./App.css";
import { DropdownSelector } from "./DropdownSelector/DropdownSelector";
import { DropdownOption } from "./DropdownSelector/DropdownSelector.types";
import { options } from "./App.constants";

function App() {
  const [selectedOptions, setSelectedOptions] = useState<
    DropdownOption[] | null
  >(null);
  return (
    <div className="App">
      <div style={{ width: "260px" }}>
        <DropdownSelector
          placeholder="Choose a creature!"
          selectedOptions={selectedOptions}
          options={options}
          onChange={setSelectedOptions}
        />
      </div>
    </div>
  );
}

export default App;
