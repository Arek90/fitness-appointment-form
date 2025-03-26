import React from "react";

type TextFieldProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: React.ReactNode;
  className?: string;
};

const TextField = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  className,
}: TextFieldProps) => (
  <div>
    <div
      className={`border border-[#CBB6E5] bg-white rounded-md p-2 ${className}`}
    >
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full outline-none`}
        placeholder="Label"
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default TextField;
