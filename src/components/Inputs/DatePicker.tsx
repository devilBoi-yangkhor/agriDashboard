"use client";
import React, { useEffect, useRef } from "react";
import { useField, useFormikContext } from "formik";
import flatpickr from "flatpickr";
import { FaRegCalendarAlt } from "react-icons/fa";

interface DatePickerProps {
  name: string;
  label: string;
  mode?: "single" | "multiple" | "range";
  dateFormat?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  mode = "single",
  dateFormat = "Y-m-d",
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [field, meta, helpers] = useField(props);
  const { validateField } = useFormikContext();

  if (!props.name) {
    throw new Error("The 'name' prop is required for the Input component.");
  }

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        mode,
        dateFormat,
        static: true,
        monthSelectorType: "static",
        position: "auto",
        prevArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onChange: (selectedDates) => {
          if (mode === "range") {
            const formattedDates = selectedDates.map((date) =>
              flatpickr.formatDate(date, dateFormat),
            );
            helpers.setValue(formattedDates);
            helpers.setTouched(true);
            validateField(props.name);
          } else {
            const formattedDate = selectedDates[0]
              ? flatpickr.formatDate(selectedDates[0], dateFormat)
              : "";
            helpers.setValue(formattedDate);
            helpers.setTouched(true);
            // validateField(props.name);
          }
        },
      });
    }
  }, [inputRef, mode, dateFormat, helpers, props.name, validateField]);

  return (
    <div>
      <label htmlFor={props.name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={props.name}
          className={`${
            meta.touched && meta.error
              ? "rounded-lg border-[1.5px] border-red-500"
              : "rounded-lg border-[1.5px] border-stroke"
          } form-datepicker w-full bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
          {...field}
          {...props}
        />
        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <FaRegCalendarAlt className="text-primary" size={18} />
        </div>
      </div>
      {meta.touched && meta.error ? (
        <div className="error ml-3 text-xs text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default DatePicker;
