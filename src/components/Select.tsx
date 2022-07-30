import { FC, SelectHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  error?: string;
  register: UseFormRegister<any>;
}

const Select: FC<SelectProps> = ({
  label,
  name,
  error,
  register,
  children,
  ...selectProps
}) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        {...register(name, { required: true })}
        className="select select-bordered"
        name={name}
        id={name}
        {...selectProps}
      >
        {children}
      </select>
      {error && (
        <label htmlFor={name} className="label">
          <span className="label-text-alt">{error}</span>
        </label>
      )}
    </div>
  );
};

export default Select;
