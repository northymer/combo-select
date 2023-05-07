import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DropdownOption } from "./DropdownSelector.types";
import { ReactComponent as Arrow } from "../assets/down-chevron-svgrepo-com.svg";

import css from "./DrowdownSelector.module.scss";

interface DropdownSelectorProps {
  disabled?: boolean;
  options?: DropdownOption[];
  selectedOptions: DropdownOption[] | null;
  onChange: (o: DropdownOption[]) => void;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  disabled,
  options = [],
  selectedOptions,
  onChange,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownWrapperRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [focusedOption, setFocusedOption] = useState<number | null>(null);

  const renderedOptions = options.filter(
    (op) => op.title.toLowerCase().indexOf(searchValue) !== -1
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (!wrapperRef || !wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // function handleEnterToConfirm() { }

    function handleArrowControl(event: KeyboardEvent) {
      if (!isOpen) return;

      const listElements = dropdownWrapperRef.current?.children;
      if (event.key === "ArrowUp") {
        if (focusedOption === 0) return;
        if (focusedOption === null) {
          setFocusedOption(0);
        } else {
          setFocusedOption((o) => (o as number) - 1);
          listElements?.length && listElements[focusedOption].scrollIntoView();
        }
      }

      if (event.key === "ArrowDown") {
        if (focusedOption === renderedOptions.length - 1) return;
        if (focusedOption === null) {
          setFocusedOption(0);
        } else {
          setFocusedOption((o) => (o as number) + 1);
          listElements?.length && listElements[focusedOption].scrollIntoView();
        }
      }

      if (event.key === "Enter") {
        if (focusedOption !== null) {
          handleChange(renderedOptions[focusedOption]);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);
    document.addEventListener("keyup", handleArrowControl);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
      document.removeEventListener("keyup", handleArrowControl);
    };
  }, [wrapperRef, focusedOption, isOpen, renderedOptions.length]);

  useEffect(() => {
    if (!isOpen && searchValue) {
      setSearchValue("");
    }
  }, [isOpen, setSearchValue, searchValue]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFocusedOption(null);
    setSearchValue(e.target.value.toLowerCase().trim());
  };

  const handleInputFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleChange = (option: DropdownOption) => {
    onChange([option]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={css.wrapper}>
      <div
        className={classNames(css.inputWrapper, {
          [css.inputWrapperActive]: isOpen,
        })}
        role="presentation"
      >
        <input
          disabled={disabled}
          type="text"
          value={searchValue}
          onChange={handleSearch}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={css.input}
          placeholder={
            selectedOptions?.length && !isInputFocused
              ? undefined
              : "Choose a Fruit"
          }
        />
        {!isInputFocused &&
          searchValue === "" &&
          selectedOptions?.length !== 0 && (
            <ul className={css.selectedValuesList}>
              {selectedOptions?.map((opt) => (
                <li>{opt.title}</li>
              ))}
            </ul>
          )}
        <Arrow className={css.arrow} onClick={() => setIsOpen((o) => !o)} />
      </div>
      {isOpen && (
        <div className={css.dropdownWrapper}>
          <ul ref={dropdownWrapperRef} className={css.optionList}>
            {renderedOptions.map((option, index) => (
              <li
                key={option.value}
                className={classNames(css.optionItem, {
                  [css.optionItemActive]: focusedOption === index,
                })}
                value={option.value}
                onClick={() => handleChange(option)}
              >
                {option.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
