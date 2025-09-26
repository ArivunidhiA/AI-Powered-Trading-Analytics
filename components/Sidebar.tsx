'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Wallet,
  Brain,
  Shield,
  Newspaper,
  Menu,
  X,
  TrendingUp,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Market Overview', href: '/dashboard/market', icon: BarChart3 },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: Wallet },
  { name: 'AI Signals', href: '/dashboard/signals', icon: Brain },
  { name: 'Risk Monitor', href: '/dashboard/risk', icon: Shield },
  { name: 'News Feed', href: '/dashboard/news', icon: Newspaper },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Menu button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-dark-800 text-white hover:bg-dark-700 transition-colors button-glow"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700
          transform transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Market AI</span>
            </motion.div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                      ${isActive 
                        ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-dark-700'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-dark-700">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-dark-700/50"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">U</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Trader</p>
                <p className="text-gray-400 text-sm">Premium Account</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
