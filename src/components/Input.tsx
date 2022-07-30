import { FC, InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  register: UseFormRegister<any>;
}

const Input: FC<InputProps> = ({
  label,
  name,
  error,
  register,
  ...inputProps
}) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        {...register(name, { required: true })}
        className="input input-bordered"
        name={name}
        id={name}
        {...inputProps}
      />
      {error && (
        <label htmlFor={name} className="label">
          <span className="label-text-alt">{error}</span>
        </label>
      )}
    </div>
  );
};

export default Input;
