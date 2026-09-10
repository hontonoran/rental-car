"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  /** Text shown inside the dropdown panel. */
  label: string;
  /** Text shown on the closed control, when it differs from `label`. */
  displayLabel?: string;
}

interface SelectProps {
  label: string;
  placeholder: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
}

/**
 * Listbox-style dropdown from the mock-up: a native `<select>` cannot render the
 * panel, the option colours or the chevron the design asks for.
 */
export default function Select({
  label,
  placeholder,
  value,
  options,
  disabled = false,
  className,
  onChange,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const labelId = useId();
  const listId = useId();
  const valueId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const selectedLabel = selected ? (selected.displayLabel ?? selected.label) : "";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      listRef.current
        ?.querySelector('[data-active="true"], [aria-selected="true"]')
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, activeIndex]);

  // Nothing selected means nothing highlighted — the first arrow key picks a row.
  const open = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const select = (index: number) => {
    onChange(options[index].value);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || options.length === 0) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();

        if (!isOpen) {
          open();

          return;
        }

        const isDown = event.key === "ArrowDown";

        setActiveIndex(
          activeIndex < 0
            ? (isDown ? 0 : options.length - 1)
            : (activeIndex + (isDown ? 1 : -1) + options.length) %
                options.length,
        );
        break;
      }
      case "Enter":
      case " ":
        event.preventDefault();

        if (isOpen && activeIndex >= 0) {
          select(activeIndex);
        } else {
          open();
        }

        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(" ")}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.label} id={labelId}>
        {label}
      </span>

      <button
        type="button"
        className={styles.control}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-labelledby={`${labelId} ${valueId}`}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
      >
        <span className={styles.value} id={valueId}>
          {selectedLabel || placeholder}
        </span>
        <LuChevronDown
          aria-hidden="true"
          className={isOpen ? `${styles.icon} ${styles.iconOpen}` : styles.icon}
        />
      </button>

      {isOpen && options.length > 0 && (
        <ul
          ref={listRef}
          id={listId}
          className={styles.list}
          role="listbox"
          aria-labelledby={labelId}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              data-active={index === activeIndex}
              className={
                option.value === value
                  ? `${styles.option} ${styles.optionSelected}`
                  : styles.option
              }
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
