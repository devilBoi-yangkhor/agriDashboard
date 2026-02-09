import React, { useState, useEffect, useRef } from "react";
import { useField } from "formik";
import { Input } from "@/components/ui/input";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  name: string;
  options: Option[];
  label?: string;
  defaultValue?: string[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({ name, options, label, defaultValue=[] }) => {
  const [field, meta, helpers] = useField<string[]>(name);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string[]>(field.value || defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Sync selected values with Formik field value
  useEffect(() => {
    if (field.value) {
      setSelected(field.value);
    }
  }, [field.value]);

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = () => setShow(!show);

  const selectOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
    console.log(newSelected)
    helpers.setValue(newSelected);
  };

  const removeOption = (value: string) => {
    const newSelected = selected.filter((v) => v !== value);
    setSelected(newSelected);
    helpers.setValue(newSelected);
  };

  return (
    <div className="relative z-40">
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm font-medium">
          {label}
        </label>
      )}

      <div ref={triggerRef} onClick={toggleDropdown}>
        <div className="mb-2 flex outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input">
          <div className="flex flex-auto flex-wrap rounded border border-stroke">
            {selected.length > 0 ? (
              selected.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <div
                    key={value}
                    className="flex items-center justify-center bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30 m-1"
                  >
                    <div className="max-w-full flex-initial">{option?.text}</div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(value);
                      }}
                      className="cursor-pointer pl-2 hover:text-danger"
                    >
                      ✕
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1">
                <Input
                  placeholder="Select an option"
                  size={40}
                  readOnly
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {show && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-40 w-full max-h-40 overflow-y-auto rounded bg-white shadow dark:bg-form-input"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer px-4 py-2 hover:bg-primary/5 ${
                selected.includes(option.value) ? "bg-primary/10" : ""
              }`}
              onClick={() => selectOption(option.value)}
            >
              {option.text}
            </div>
          ))}
        </div>
      )}

      {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-500">
          {typeof meta.error === 'string' ? meta.error : 'Please select at least one option'}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;