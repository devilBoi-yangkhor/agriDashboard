"use client";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

interface Option {
  value: any;
  text: string;
  disabled?: boolean;
}

interface SelectDropDownProps {
  label: string;
  options: Option[];
  name: string;
  id?: string;
  onValueChange?: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectedValue?: any;
  disabled?: boolean;
  placeholder?: string;
}

const SelectDropDown: React.FC<SelectDropDownProps> = ({
  label,
  options,
  onValueChange,
  name,
  id,
  searchable = false,
  searchPlaceholder = "Search...",
  selectedValue,
  disabled = false,
  placeholder = "Select an option",
}) => {
  const [field, meta, helpers] = useField(name);
  const { validateField } = useFormikContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [internalValue, setInternalValue] = useState("");

  // Determine the actual value to use
  const value = selectedValue !== undefined ? selectedValue : field.value;
  const safeValue = value && typeof value === "string" ? value : "";

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(safeValue);
  }, [safeValue]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm || !searchable) return options;
    return options.filter((option) =>
      option.text.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm, searchable]);

  // Find the selected option to display its text
  const selectedOption = useMemo(() => {
    return options?.find((option) => `${option.value}` === internalValue);
  }, [options, internalValue]);

  // Debounce validation
  const debouncedValidate = useCallback(
    debounce((fieldName: string) => {
      validateField(fieldName);
    }, 100),
    [validateField],
  );

  return (
    <div className="mb-4 grid w-full items-center gap-1.5">
      <Label htmlFor={id || name} className="text-sm font-medium">
        {label}
      </Label>
      <Select
        value={internalValue}
        onValueChange={(value) => {
          helpers.setValue(value);
          setInternalValue(value);
          helpers.setTouched(true);
          debouncedValidate(name);
          onValueChange?.(value);
          setSearchTerm("");
        }}
        disabled={disabled}
      >
        <SelectTrigger
          id={id || name}
          className={`w-full ${meta.touched && meta.error ? "border-red-500" : ""}`}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption ? selectedOption.text : ""}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className={inputFocused ? "pointer-events-none" : ""}>
          {searchable && (
            <div className="sticky top-0 z-10 bg-background p-2">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setTimeout(() => setInputFocused(false), 100)}
                className="mb-2 focus-visible:ring-0"
                autoFocus={searchable}
              />
            </div>
          )}

          <SelectGroup>
            {filteredOptions?.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={`${option.value}`}
                  disabled={option.disabled}
                >
                  {option.text}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-center text-sm text-muted-foreground">
                No options found
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {meta.touched && meta.error ? (
        <span className="ml-3 text-xs text-red-500">{meta.error}</span>
      ) : null}
    </div>
  );
};

export default SelectDropDown;