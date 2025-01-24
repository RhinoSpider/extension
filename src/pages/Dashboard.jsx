import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Power, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  // Initialize isConnected as true by default
  const [isConnected, setIsConnected] = useState(true);
  const [uptime, setUptime] = useState('2 hrs 45 mins');
  const [points, setPoints] = useState(9130);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    chrome.storage.local.get(['isConnected', 'points', 'uptime'], (result) => {
      // If there's no stored value, keep it true (default)
      setIsConnected(result.isConnected === undefined ? true : result.isConnected);
      setPoints(result.points || 9130);
      setUptime(result.uptime || '2 hrs 45 mins');
    });

    // Set initial connection status in storage if not exists
    chrome.storage.local.get(['isConnected'], (result) => {
      if (result.isConnected === undefined) {
        chrome.storage.local.set({ isConnected: true });
      }
    });
  }, []);

  const toggleConnection = () => {
    const newStatus = !isConnected;
    setIsConnected(newStatus);
    chrome.storage.local.set({ isConnected: newStatus });
  };

  const copyReferralLink = async () => {
    if (user?.id) {
      const referralLink = `https://rhinospider.com/ref/${user.id}`;
      try {
        await navigator.clipboard.writeText(referralLink);
      } catch (error) {
        console.error('Failed to copy referral link:', error);
      }
    }
  };

  return (
    <div className="flex flex-col w-80 h-[600px]">
      <div className="flex-1 bg-gradient-to-b from-gray-900 to-purple-900 p-6 text-white overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
  <span className="text-xl font-mono text-white">{">^<"}</span>
  <span className="text-xl font-semibold">RhinoSpider</span>
</div>
          <div className="flex items-center gap-2">
            <Settings
              size={20}
              className="text-gray-400 cursor-pointer hover:text-gray-300"
              onClick={() => navigate('/settings')}
            />
            <div className="w-8 h-8 rounded-full bg-gray-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center">
          <h2 className="text-gray-400 mb-2">Current Earnings</h2>
          <div className="text-3xl font-bold mb-8">{points} Points</div>

          <button
  onClick={toggleConnection}
  className={`w-16 h-16 rounded-full ${
    isConnected 
      ? 'bg-purple-500 glow-effect' 
      : 'bg-gray-700'
  } mx-auto flex items-center justify-center mb-4 transition-colors relative`}
>
  <Power size={24} className="text-white" />
</button>

          <div className="text-sm text-gray-400 mb-4">
            {isConnected ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Your plugin is active. No action required.
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Plugin is disconnected. Click to connect!
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 mb-8">
            <div className="flex justify-between text-gray-400">
              <span>Uptime</span>
              <span>{uptime}</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm italic mb-8">
            Great job! Keep contributing to secure your next milestone reward.
          </p>

          <div className="flex gap-2 mb-6">
            <button
              onClick={copyReferralLink}
              className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg p-3 text-sm transition-colors"
            >
              Copy Your Referral Link
            </button>
            <button 
              className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg p-3 text-sm transition-colors"
            >
              View My Referrals
            </button>
          </div>

          <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 rounded-lg p-3 text-sm flex items-center justify-center gap-2 transition-colors mb-4">
            Desktop Dashboard
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;