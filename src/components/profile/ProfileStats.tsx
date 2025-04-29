
import React from 'react';

interface ProfileStatsProps {
  stats: {
    totalStreaks: number;
    longestStreak: number;
    ritualsCreated: number;
    chains: number;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="w-full flex justify-between gap-4">
      <StatItem label="Longest Streak" value={`${stats.longestStreak}`} />
      <StatItem label="Rituals Created" value={stats.ritualsCreated} />
      <StatItem label="Chains" value={stats.chains} />
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: number | string }> = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center p-3 bg-white/50 rounded-xl">
      <span className="text-[#2E4C2F] text-2xl font-bold">{value}</span>
      <span className="text-[#6F8D6A] text-sm">{label}</span>
    </div>
  );
};

export default ProfileStats;
