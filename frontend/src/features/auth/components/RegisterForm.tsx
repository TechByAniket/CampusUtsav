import { Link } from "react-router-dom";

interface RegisterFormProps {
  title: string;
  subtitle: string;
  placeholder: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  title,
  subtitle,
  placeholder,
}) => {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="text"
            placeholder={placeholder}
            className="w-full mt-1 px-3 py-2 border rounded-[8px] focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full mt-1 px-3 py-2 border rounded-[8px] focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* <div className="text-right text-sm text-orange-500 cursor-pointer">
          Trouble signing in?
        </div> */}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primaryDark text-white py-2 font-semibold rounded-[8px] transition"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center text-sm mt-2">
        Already have an account?{" "}
        <Link to={'/auth/sign-in'} className="text-primary font-medium">
          Login here
        </Link>
      </div>
    </>
  );
};

