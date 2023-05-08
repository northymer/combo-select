import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { DropdownSelector } from "./DropdownSelector";
import { DropdownOption } from "./DropdownSelector.types";
import { options } from "../App.constants";

let onChange: undefined | ((o: DropdownOption[]) => void);
let selectedOptions: DropdownOption[] | undefined;

beforeEach(() => {
  selectedOptions = [];
  onChange = jest.fn();
});

afterEach(() => {
  selectedOptions = undefined;
  onChange = undefined;
});

describe("DropdownSelector", () => {
  it("should render", async () => {
    render(
      <DropdownSelector
        selectedOptions={selectedOptions as DropdownOption[]}
        onChange={onChange as (o: DropdownOption[]) => void}
      />
    );

    await screen.findByPlaceholderText("Choose an option");

    expect(screen.getByPlaceholderText("Choose an option")).toBeTruthy();
  });

  it("should open", async () => {
    render(
      <DropdownSelector
        selectedOptions={selectedOptions as DropdownOption[]}
        onChange={onChange as (o: DropdownOption[]) => void}
      />
    );

    fireEvent.click(screen.getByLabelText("Selector toggle"));

    await screen.findByLabelText("Empty List");

    expect(screen.getByLabelText("Empty List")).toBeTruthy();
  });

  it("should render list", async () => {
    render(
      <DropdownSelector
        selectedOptions={selectedOptions as DropdownOption[]}
        onChange={onChange as (o: DropdownOption[]) => void}
        options={options}
      />
    );

    fireEvent.click(screen.getByLabelText("Selector toggle"));

    await screen.findByText(options[0].title);

    expect(screen.getByText(options[0].title)).toBeTruthy();
  });
});
