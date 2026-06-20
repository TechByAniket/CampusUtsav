import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>
            At CampusUtsav, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">1. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us, or participate in activities on the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">2. How We Use Your Information</h2>
            <p>
              We use personal information collected via our platform for a variety of business purposes, including account creation, sending administrative information, and managing events and registrations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">3. Information Sharing</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">4. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
            </p>
          </div>


        </div>
      </div>
    </div>
  );
};
