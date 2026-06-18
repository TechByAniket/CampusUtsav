import { HeroSection } from '../components/HeroSection'
import { WhatIsCampusUtsav } from '../components/WhatIsCampusUtsav'
import { WhyCampusUtsav } from '../components/WhyCampusUtsav'
import { HowItWorks } from '../components/HowItWorks'
import { CommunityStats } from '../components/CommunityStats'
import { Testimonial } from '../components/Testimonial'
import { CallToAction } from '../components/CallToAction'

export const HomePage = () => {
  return (
    <>
        <HeroSection />
        <WhatIsCampusUtsav />
        <WhyCampusUtsav />
        <HowItWorks />
        <CommunityStats />
        <Testimonial />
        <CallToAction />
    </>
  )
}
