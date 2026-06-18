import { Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-brfrom-[#fffaf5]via-[#fff3e8]to-[#ffedd5] flex items-center justify-center px-4">
      {/* Outer container */}
      <div className="w-full max-w-6xl bg-[#fff7ed] rounded-3xl shadow-2xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

        {/* LEFT – Illustration / Branding */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-[#fff1dc] relative">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Campus<span className="text-orange-500">Utsav</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              College Events • Students • Experiences
            </p>
          </div>

          {/* Fake illustration blocks */}
          <div className="space-y-4">
            <div className="w-32 h-40 bg-orange-400 rounded-xl opacity-80" />
            <div className="w-20 h-20 border border-black rounded-lg" />
          </div>

          <p className="text-xs text-gray-500">
            © CampusUtsav 2026 • Privacy Policy
          </p>
        </div>

        {/* RIGHT – Auth Card */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};


