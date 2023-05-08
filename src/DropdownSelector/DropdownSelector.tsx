import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DropdownOption } from "./DropdownSelector.types";
import { ReactComponent as Arrow } from "../assets/down-chevron-svgrepo-com.svg";

import css from "./DrowdownSelector.module.scss";

interface DropdownSelectorProps {
  disabled?: boolean;
  placeholder?: string;
  options?: DropdownOption[];
  selectedOptions: DropdownOption[] | null;
  onChange: (o: DropdownOption[]) => void;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  placeholder = "Choose an option",
  disabled = false,
  options = [],
  selectedOptions,
  onChange,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownWrapperRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [focusedOption, setFocusedOption] = useState<number | null>(null);
  const [isTopPosition, setIsTopPosition] = useState(false);

  const renderedOptions = options.filter(
    (op) => op.title.toLowerCase().indexOf(searchValue) !== -1
  );

  const handleChange = useCallback(
    (option: DropdownOption) => {
      onChange([option]);
      setIsOpen(false);
    },
    [onChange, setIsOpen]
  );

  useEffect(() => {
    function updateDropdownPosition() {
      if (!wrapperRef || !wrapperRef.current) return;
      const wrapperBound = wrapperRef.current.getBoundingClientRect();

      if (wrapperBound.bottom - wrapperBound.height - 100 < 0) {
        setIsTopPosition(true);
      } else {
        setIsTopPosition(false);
      }
    }

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition);
    };
  }, [wrapperRef]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (!wrapperRef || !wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleArrowControl(event: KeyboardEvent) {
      if (!isOpen) return;

      const listElements = dropdownWrapperRef.current?.children;
      if (!listElements?.length) return;
      let curFocusedPoint = focusedOption === null ? 0 : focusedOption;
      if (event.key === "ArrowUp") {
        if (focusedOption === 0) return;
        if (focusedOption === null) {
          setFocusedOption(0);
        } else {
          curFocusedPoint = curFocusedPoint === 0 ? 0 : --curFocusedPoint;
          setFocusedOption(curFocusedPoint);
          listElements[curFocusedPoint].scrollIntoView();
        }
      }

      if (event.key === "ArrowDown") {
        if (focusedOption === renderedOptions.length - 1) return;
        if (focusedOption === null) {
          setFocusedOption(0);
        } else {
          curFocusedPoint =
            curFocusedPoint === listElements?.length
              ? listElements.length
              : ++curFocusedPoint;
          setFocusedOption(curFocusedPoint);
          listElements[focusedOption].scrollIntoView();
        }
      }

      if (event.key === "Enter") {
        if (focusedOption !== null) {
          handleChange(renderedOptions[focusedOption]);
        }
      }

      if (event.key === "Escape") {
        setIsOpen(false);
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
  }, [
    wrapperRef,
    focusedOption,
    isOpen,
    renderedOptions.length,
    handleChange,
    renderedOptions,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setSearchValue("");
      inputRef.current?.blur();
      setIsInputFocused(false);
      setFocusedOption(null);
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

  return (
    <div
      ref={wrapperRef}
      aria-label="Selector"
      className={classNames(css.wrapper, {
        [css.disabled]: disabled,
      })}
      onClick={() => {
        if (!disabled) {
          inputRef.current?.focus();
          handleInputFocus();
        }
      }}
    >
      <div
        className={classNames(css.inputWrapper, {
          [css.inputWrapperActive]: isOpen,
          [css.inputWrapperBottom]: !isTopPosition,
          [css.inputWrapperTop]: isTopPosition,
        })}
        role="presentation"
      >
        <input
          ref={inputRef}
          disabled={disabled}
          type="text"
          value={searchValue}
          onChange={handleSearch}
          onFocus={handleInputFocus}
          onBlur={() => setIsInputFocused(true)}
          className={css.input}
          placeholder={
            selectedOptions?.length && !isInputFocused ? undefined : placeholder
          }
        />
        {!isInputFocused &&
          searchValue === "" &&
          selectedOptions?.length !== 0 && (
            <ul className={css.selectedValuesList}>
              {selectedOptions?.map((opt) => (
                <li key={opt.value} className={css.selectedValueItem}>
                  {opt.title}
                </li>
              ))}
            </ul>
          )}
        <Arrow
          aria-label="Selector toggle"
          className={css.arrow}
          onClick={() => {
            if (!disabled) {
              setIsOpen((o) => !o);
            }
          }}
        />
      </div>
      {isOpen && (
        <div
          className={classNames(css.dropdownWrapper, {
            [css.dropdownWrapperTop]: isTopPosition,
            [css.dropdownWrapperBottom]: !isTopPosition,
          })}
        >
          <ul ref={dropdownWrapperRef} className={css.optionList}>
            {renderedOptions.length === 0 && (
              <div aria-label="Empty List">No Results Here 🙈</div>
            )}
            {renderedOptions.map((option, index) => (
              <li
                key={option.value}
                className={classNames(css.optionItem, {
                  [css.optionItemActive]: focusedOption === index,
                })}
                onClick={() => handleChange(option)}
              >
                {option.title}
                {selectedOptions?.length !== 0 &&
                  selectedOptions?.findIndex(
                    (o) => o.value === option.value
                  ) !== -1 && (
                    <span aria-label={`${option.title} is selected`}>✅</span>
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
