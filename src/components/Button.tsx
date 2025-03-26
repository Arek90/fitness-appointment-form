type ButtonProps = {
  buttonText: string;
  onClick: (e: React.FormEvent) => Promise<void>;
  disabled: boolean;
};

const Button = ({ buttonText, onClick, disabled }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full text-center text-white py-2 rounded-lg bg-[#761BE4] hover:bg-[#6A19CD] py-2 rounded-lg cursor-pointer disabled:bg-[#CBB6E5] disabled:cursor-default"
  >
    {buttonText}
  </button>
);

export default Button;
