'use client';

import { useState } from 'react';

interface DebugMenuProps {
  onScenarioChange: (scenario: string) => void;
}

export default function DebugMenu({ onScenarioChange }: DebugMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scenarios = [
    { id: 'reset', label: '重置', icon: '🔄' },
    { id: 'sunny', label: '大太陽', icon: '☀️' },
    { id: 'rain', label: '下雨', icon: '🌧️' },
    { id: 'heavy-rain', label: '豪大雨', icon: '⛈️' },
    { id: 'snow', label: '下雪', icon: '❄️' },
    { id: 'windy', label: '強風', icon: '🍃' },
    { id: 'night', label: '夜晚', icon: '🌙' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800/80 backdrop-blur-sm text-white p-2 rounded-md border-2 border-gray-600 hover:bg-gray-700 font-pixel text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center"
      >
        {isOpen ? '✕ 關閉' : '🛠️ 切換天氣'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border-2 border-gray-600 rounded-md shadow-xl p-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  onScenarioChange(scenario.id);
                  setIsOpen(false);
                }}
                className="px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors font-pixel flex items-center justify-start gap-2 cursor-pointer"
              >
                <span className="w-5 flex items-center justify-center">{scenario.icon}</span>
                <span className="flex items-center">{scenario.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
