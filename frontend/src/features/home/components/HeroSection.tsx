import { Button } from '@/components/ui/button'
import { CircleArrowRight } from "lucide-react"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { motion } from 'framer-motion'


export const HeroSection = () => {
  const { token } = useSelector((state: RootState) => state.auth)

  return (
    <section style={{ backgroundImage: "url('/home/HeroSectionBG3.jpeg')" }}
      className="min-h-[91vh] px-4 md:px-8 py-8 bg-cover bg-center flex items-center justify-center flex-col gap-6">

        {/* Heading */}
        <div className='flex flex-col'>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-white text-center'
            >
              Celebrate Your Campus Spirit With
            </motion.h1>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className='text-primary text-center'>CampusUtsav</h1>
            </motion.span>
        </div>

        {/* SubHeading */}
        <div className="space-y-2">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='text-center text-gray-200 text-sm md:text-lg font-bold'
            >
              Connect • Participate • Shine
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='text-center text-gray-200 text-sm md:text-lg max-w-3xl mx-auto'
            >
              Explore college fests, register for events, and be part of the ultimate celebration of talent and creativity across campuses!
            </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='flex flex-col md:flex-row gap-4 mt-4'
        >
            <Link to='/explore-events'>
              <Button size='lg' className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 shadow-lg shadow-orange-900/20">
                Explore Events
              </Button>
            </Link>

            {!token && (
              <Link to='/auth/sign-up'>
                <Button size='lg' variant="outline" className="text-white border-white rounded-2xl px-8 hover:bg-white hover:text-slate-900 transition-all">
                  Join as College <CircleArrowRight className='ml-2 !size-5'/>
                </Button>
              </Link>
            )}
        </motion.div>
    </section>
  )
}
