import type React from "react";
import { LoginForm } from "../components/LoginForm";
import { motion } from "framer-motion";

export const SignIn: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <LoginForm
        title="Welcome Back"
        subtitle="Sign in to your CampusUtsav account"
        placeholder="you@college.edu"
      />
    </motion.div>
  );
};
