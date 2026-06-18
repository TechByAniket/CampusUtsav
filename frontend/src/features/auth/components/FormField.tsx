import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
  label: string;
  name: string;
  register: any;
  error?: any;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export const FormField = ({
  label,
  name,
  register,
  error,
  inputProps,
}: FormFieldProps) => (
  <div className="flex flex-col gap-1 relative pb-4">
    <Label htmlFor={name}>{label}</Label>

    <Input id={name} {...register(name)} {...inputProps} />

    {error?.message && (
      <p className="absolute left-0 -bottom-1 text-red-500 text-xs leading-none">
        {String(error.message)}
      </p>
    )}
  </div>
);