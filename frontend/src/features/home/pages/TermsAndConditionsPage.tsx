import React from 'react';

export const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Terms and Conditions</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>
            Welcome to CampusUtsav. By accessing or using our platform, you agree to be bound by these Terms and Conditions.
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">1. Acceptance of Terms</h2>
            <p>
              By registering for an account, accessing the platform, or using any of our services, you agree to comply with and be bound by these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">2. User Accounts</h2>
            <p>
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">3. Code of Conduct</h2>
            <p>
              Users must behave respectfully and professionally. Harassment, abusive language, spamming, or any form of inappropriate behavior will result in immediate account suspension.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">4. Content Ownership</h2>
            <p>
              Any content you upload (images, event details, descriptions) remains yours, but you grant CampusUtsav a non-exclusive license to display and distribute it within the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
