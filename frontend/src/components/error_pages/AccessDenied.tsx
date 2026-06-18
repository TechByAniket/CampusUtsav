import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"; // Using Lucide for modern icons
import type { RootState } from "@/store/store";


const AccessDenied = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.auth);

  // Determine where to send them based on their role
  const getHomePath = () => {
    switch (role) {
      case "COLLEGE": return "/college-dashboard";
      case "STAFF": return "/staff-dashboard";
      case "CLUB": return "/club-dashboard";
      default: return "/";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Modern Illustration Placeholder */}
        <div className="relative flex justify-center">
           {/* You can replace this div with an actual SVG or Undraw illustration */}
           <div className="w-64 h-64 bg-indigo-100 rounded-full flex items-center justify-center">
              <ShieldAlert size={120} className="text-indigo-600 animate-pulse" />
           </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">403</h1>
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-500 text-lg">
            Oops! It looks like you don't have permission to view this page. 
            If you think this is a mistake, please contact your administrator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate(getHomePath())}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            <Home size={18} />
            Return to Dashboard
          </button>
        </div>

        <div className="pt-8 text-sm text-gray-400">
            Error Code: <span className="font-mono">ERR_UNAUTHORIZED_ACCESS_03</span>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;