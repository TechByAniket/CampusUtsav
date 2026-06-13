import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { CollegeSignUp } from "../components/CollegeSignUp";
import { StudentSignUp } from "../components/StudentSignUp";
import { ClubSignUp } from "../components/ClubSignUp";
import { StaffSignUp } from "../components/StaffSignUp";


const tabAnimation = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeInOut" as any },
};



export const SignUp: React.FC = () => {
  const [role, setRole] = useState<"college" | "student" | "club" | "staff" | null>(null);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {role === null && (
          <motion.div key="role" {...tabAnimation} className="space-y-6">
            {/* Heading */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
              <p className="text-gray-500">Choose one to continue</p>
            </div>

            {/* Role Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["college", "student", "club", "staff"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r as any)}
                  className={`
                    w-full py-6 px-4 text-center rounded-[8px] font-medium
                    transition-all duration-300
                    border hover:shadow-lg
                    ${role === r ? "bg-orange-400 text-white shadow-lg border-orange-400" : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"}
                  `}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {role === "college" && (
          <CollegeSignUp onClose={() => setRole(null)} />
        )}

        {role === "student" && (
          <StudentSignUp onClose={() => setRole(null)} />
        )}

        {role === "club" && (
          <ClubSignUp onClose={() => setRole(null)} />
        )}

        {role === "staff" && (
          <StaffSignUp onClose={() => setRole(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};