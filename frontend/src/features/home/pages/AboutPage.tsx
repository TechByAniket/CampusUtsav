import React from 'react';
import { AboutHero } from '../components/AboutHero';
import { AboutMission } from '../components/AboutMission';
import { AboutValues } from '../components/AboutValues';
import { AboutCTA } from '../components/AboutCTA';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-white font-sans text-slate-900 overflow-x-hidden">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutCTA />
    </div>
  );
};
