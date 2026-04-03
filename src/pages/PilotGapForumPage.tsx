import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PilotGapForumPageProps {
  onBack: () => void;
  userProfile?: {
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}

interface ForumTopic {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  replies: number;
  views: number;
  lastActivity: string;
  category: string;
  isPinned?: boolean;
}

export const PilotGapForumPage: React.FC<PilotGapForumPageProps> = ({
  onBack,
  userProfile
}) => {
  const [topics, setTopics] = useState<ForumTopic[]>([
    {
      id: '1',
      title: 'Welcome to Pilot Gap Forum - Read This First!',
      author: 'WingMentor Team',
      authorRole: 'Admin',
      replies: 156,
      views: 2340,
      lastActivity: '2 hours ago',
      category: 'Announcements',
      isPinned: true
    },
    {
      id: '2',
      title: 'ATPL Module 1 Study Group - January 2025',
      author: 'Sarah Johnson',
      authorRole: 'Mentor',
      replies: 45,
      views: 892,
      lastActivity: '4 hours ago',
      category: 'Study Groups'
    },
    {
      id: '3',
      title: 'Tips for passing the EASA ATPL exams on first attempt',
      author: 'Michael Chen',
      authorRole: 'Student Pilot',
      replies: 78,
      views: 1456,
      lastActivity: '6 hours ago',
      category: 'Exam Preparation'
    },
    {
      id: '4',
      title: 'Career transition from PPL to CPL - My experience',
      author: 'David Martinez',
      authorRole: 'Commercial Pilot',
      replies: 34,
      views: 678,
      lastActivity: '12 hours ago',
      category: 'Career Pathways'
    },
    {
      id: '5',
      title: 'Airline interview preparation resources collection',
      author: 'Emma Wilson',
      authorRole: 'Mentor',
      replies: 56,
      views: 1123,
      lastActivity: '1 day ago',
      category: 'Interview Prep'
    },
    {
      id: '6',
      title: 'Flight school recommendations in Europe',
      author: 'Lucas Schmidt',
      authorRole: 'Student Pilot',
      replies: 23,
      views: 445,
      lastActivity: '2 days ago',
      category: 'Training'
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['All', 'Announcements', 'Study Groups', 'Exam Preparation', 'Career Pathways', 'Interview Prep', 'Training', 'General'];

  const filteredTopics = topics.filter(topic => {
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedTopics = filteredTopics.filter(t => t.isPinned);
  const regularTopics = filteredTopics.filter(t => !t.isPinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Connect
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-blue-600 tracking-widest text-xs font-bold uppercase mb-2">
                Community Forum
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white">
                Pilot Gap Forum
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Discuss pilot training, career pathways, and industry insights
              </p>
            </div>
            
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/25 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Discussion
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {/* Pinned Topics */}
          {pinnedTopics.map(topic => (
            <div
              key={topic.id}
              className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-md border border-amber-200 dark:border-amber-800/50 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
                      PINNED
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{topic.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{topic.author}</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      {topic.authorRole}
                    </span>
                    <span>{topic.replies} replies</span>
                    <span>{topic.views} views</span>
                    <span>Last activity: {topic.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Regular Topics */}
          {regularTopics.map(topic => (
            <div
              key={topic.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
                      {topic.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{topic.author}</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                      {topic.authorRole}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      {topic.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {topic.views}
                    </span>
                    <span>{topic.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No discussions found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Forum Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-md border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,234</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Topics</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-md border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">5,678</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Replies</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-md border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">892</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Members</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-md border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">156</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Online Now</div>
          </div>
        </div>
      </div>
    </div>
  );
};
