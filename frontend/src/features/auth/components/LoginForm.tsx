import { login } from "@/services/authService";
import { type AppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import type { LoginProps } from "@/types/auth";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginFormProps {
  title: string;
  subtitle: string;
  placeholder: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  title,
  subtitle,
  placeholder,
}) => {

  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginProps>();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


const handleLogin = async (data: LoginProps) => {
  try {
    const response = await login(data);

    dispatch(setCredentials({
      token: response.token,
      role: response.role,
      email: response.email,
      profileId: response.profileId,
      collegeId: response.collegeId,
      collegeName: response.collegeName,
      studentSummary: response.studentSummary
    }));

    toast.success("Login successful!");

    // role-based navigation
    switch (response.role) {
      case "ROLE_PRINCIPAL":
        navigate("/college-dashboard/overview");
        break;

      case "ROLE_HOD":
        navigate("/staff-dashboard/overview");
        break;

      case "ROLE_FACULTY":
        navigate("/staff-dashboard/overview");
        break;

      case "ROLE_CLUB":
        navigate("/club-dashboard/overview");
        break;

      case "ROLE_STUDENT":
        navigate("/");
        break;

      default:
        navigate("/");
    }

  } catch (err: any) {
    toast.error(err.message);
  }
};


  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-4"
      >
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder={placeholder}
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full mt-1 px-3 py-2 border rounded-[8px]
              focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full mt-1 px-3 py-2 border rounded-[8px]
              focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 rounded-[8px]
            font-semibold hover:bg-primaryDark transition disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>


      <div className="text-center text-sm mt-2">
        Don’t have an account?{" "}
        <Link to={'/auth/sign-up'} className="text-primary font-medium">
          Register here
        </Link>
      </div>
    </>
  );
};

