import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "../components/LoginForm";
import { motion, AnimatePresence } from "framer-motion";


const tabAnimation = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeInOut" as any },
};

export const SignIn: React.FC = () => {
  return (
    <div className="space-y-6">

      <Tabs defaultValue="college" className="w-full">
        <TabsList className="grid grid-cols-3 w-full rounded-[8px] bg-black">
          <TabsTrigger value="college" className="rounded-[8px] text-white">
            College
          </TabsTrigger>
          <TabsTrigger value="student" className="rounded-[8px] text-white">
            Student
          </TabsTrigger>
          <TabsTrigger value="club" className="rounded-[8px] text-white">
            Club
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">

          <TabsContent value="college" className="mt-6">
            <motion.div {...tabAnimation}>
              <LoginForm
                title="College Login"
                subtitle="Enter your college admin credentials"
                placeholder="admin@college.edu"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="student" className="mt-6">
            <motion.div {...tabAnimation}>
              <LoginForm
                title="Student Login"
                subtitle="Login using your student account"
                placeholder="student@college.edu"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="club" className="mt-6">
            <motion.div {...tabAnimation}>
              <LoginForm
                title="Club Login"
                subtitle="Login as a club representative"
                placeholder="club@college.edu"
              />
            </motion.div>
          </TabsContent>

        </AnimatePresence>
      </Tabs>
    </div>
  );
};
