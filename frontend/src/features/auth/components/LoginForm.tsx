import { useState } from "react";
import { login } from "@/services/authService";
import { type AppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import type { LoginProps } from "@/types/auth";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

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

      dispatch(
        setCredentials({
          token: response.token,
          role: response.role,
          email: response.email,
          profileId: response.profileId,
          collegeId: response.collegeId,
          collegeName: response.collegeName,
          studentSummary: response.studentSummary,
        })
      );

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
      {/* Heading */}
      <div className="mb-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-3">
        {/* Email Field */}
        <div className="space-y-1 group">
          <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
            <Mail size={14} /> Email Address
          </label>
          <input
            type="email"
            placeholder={placeholder}
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full h-[46px] px-4 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300"
          />
          {errors.email && (
            <p className="text-[11px] text-rose-500 mt-0.5 ml-0.5 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1 group">
          <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
            <Lock size={14} /> Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full h-[46px] px-4 pr-10 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-500 mt-0.5 ml-0.5 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Sign In Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-[46px] bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Sign In
            </>
          )}
        </motion.button>
      </form>

      {/* Secondary Link */}
      <p className="text-sm text-slate-500 mt-4 text-center">
        Don't have an account?{" "}
        <Link
          to={"/auth/sign-up"}
          className="text-orange-600 font-bold hover:underline hover:text-orange-700 transition-colors"
        >
          Register here
        </Link>
      </p>
    </>
  );
};
