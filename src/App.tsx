import React, { useState } from "react";
import "./App.css";
import { DropdownSelector } from "./DropdownSelector/DropdownSelector";
import { DropdownOption } from "./DropdownSelector/DropdownSelector.types";

const options: DropdownOption[] = [
  { title: "Shark", value: "Shark" },
  { title: "Dolphin", value: "Dolphin" },
  { title: "Whale", value: "Whale" },
  { title: "Octopus", value: "Octopus" },
  { title: "Crab", value: "Crab" },
  { title: "Lobster", value: "Lobster" },
];

function App() {
  const [selectedOptions, setSelectedOptions] = useState<
    DropdownOption[] | null
  >(null);
  return (
    <div className="App">
      <DropdownSelector
        selectedOptions={selectedOptions}
        options={options}
        onChange={setSelectedOptions}
      />
    </div>
  );
}

export default App;
