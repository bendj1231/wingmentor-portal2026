import React from 'react';
import { Icons } from '../icons';

interface WingMentorConnectPageProps {
  onBack: () => void;
  onViewPilotGapForum?: () => void;
  onViewWingMentorChat?: () => void;
}

export const WingMentorConnectPage: React.FC<WingMentorConnectPageProps> = ({
  onBack,
  onViewPilotGapForum,
  onViewWingMentorChat
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Dashboard
          </button>
          
          <div className="text-center">
            <div className="mb-6">
              <img src="/logo.png" alt="WingMentor Logo" className="max-w-[200px] mx-auto h-auto" />
            </div>
            <div className="text-blue-600 tracking-widest text-xs font-bold uppercase mb-3">
              Community & Connection
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">
              WingMentor Connect
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Engage and connect with fellow mentors & mentees. Share experiences, ask questions, and build your aviation network.
            </p>
          </div>
        </div>

        {/* Connection Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pilot Gap Forum Card */}
          <div
            onClick={onViewPilotGapForum}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Pilot Gap Forum
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Join discussions on pilot training, career pathways, and industry insights. Ask questions and share your journey with the community.
              </p>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/25">
                Access Pilot Gap Forum
              </button>
            </div>
          </div>

          {/* WingMentor Chat Card */}
          <div
            onClick={onViewWingMentorChat}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                WingMentor Chat
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Connect directly with mentors and mentees through real-time messaging. Build relationships and get personalized guidance.
              </p>
              <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-600/25">
                Open WingMentor Chat
              </button>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">50+</div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">Verified Mentors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">24/7</div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">Community Support</div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            Connect responsibly. All interactions are moderated to ensure a safe and professional environment.
          </p>
        </div>
      </div>
    </div>
  );
};
