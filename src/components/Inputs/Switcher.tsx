import React from "react";
import { useField } from "formik";
import { FaCheck, FaTimes  } from "react-icons/fa";

interface SwitcherProps {
  name: string;
  label: string;
  checked: boolean;
}

const Switcher: React.FC<SwitcherProps> = ({ name, label, ...props }) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;

  const toggleSwitch = () => {
    setValue(!value);
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={name}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={name}
            className="sr-only"
            {...props}
            onChange={toggleSwitch}
          />
          <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
          <div
            className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              value && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
            }`}
          >
            <span className={`hidden ${value && "!block"}`}><FaCheck className="text-white dark:text-gray-900" size={12}/></span>
            <span className={`${value && "hidden"}`}><FaTimes className="text-gray-800" size={12}/></span>
          </div>
        </div>
      </label>
      <span className="text-sm font-medium text-black dark:text-white">
        {label}
      </span>
    </div>
  );
};

export default Switcher;
