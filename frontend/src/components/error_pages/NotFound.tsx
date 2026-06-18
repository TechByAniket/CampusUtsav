import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MoveLeft, Home, Search } from "lucide-react";
import type { RootState } from "@/store/store";


const NotFound = () => {
  const navigate = useNavigate();
  const { token, role } = useSelector((state: RootState) => state.auth);

  // Determine the primary "Home" button link
  const getHomePath = () => {
    if (!token) return "/"; // Public homepage
    switch (role) {
      case "COLLEGE": return "/college-dashboard";
      case "STAFF": return "/staff-dashboard";
      case "CLUB": return "/club-dashboard";
      default: return "/";
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Visual Element */}
      <div className="relative mb-8">
        <div className="text-[12rem] font-black text-gray-100 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-indigo-600 p-4 rounded-2xl rotate-12 shadow-xl shadow-indigo-200">
             <Search size={48} className="text-white -rotate-12" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Lost in Space?</h1>
        <p className="text-gray-500 text-lg">
          The page you are looking for doesn't exist or has been moved to another galaxy.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
        >
          <MoveLeft size={18} />
          Go Back
        </button>
        
        <button
          onClick={() => navigate(getHomePath())}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Home size={18} />
          {token ? "Back to Dashboard" : "Go to Homepage"}
        </button>
      </div>

      {/* Subtle Footer */}
      <p className="mt-12 text-sm text-gray-400">
        Typed a URL? Double check the spelling!
      </p>
    </div>
  );
};

export default NotFound;