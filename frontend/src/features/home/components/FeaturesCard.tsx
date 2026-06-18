import React from 'react';

// 1. Define the type for a single feature object
interface Feature {
  icon: React.ReactNode; // For the Lucide icon component
  title: string;
  description: string;
}

// 2. Define the props for the FeaturesCard component
interface FeaturesCardProps {
  feature: Feature;
}

export const FeaturesCard: React.FC<FeaturesCardProps> = ({ feature }) => {
  const { icon, title, description } = feature;

  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
    >
      {/* Icon Box: Note the w-12/h-12 is a good standard size */}
      <div className="w-full h-52 bg-red-500 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Text Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
};