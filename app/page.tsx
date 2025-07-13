'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Get dark mode preference from localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 dark:text-white transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => {
            const newMode = !darkMode;
            setDarkMode(newMode);
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            if (newMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 shadow transition"
        >
          {darkMode ? <i className="ri-sun-line"></i> : <i className="ri-moon-line"></i>}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="ri-store-2-line text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Don-t-perish
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Reduce food waste and maximize profits with intelligent expiry tracking, 
            risk alerts, and automated discount suggestions for your grocery store
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: 'ri-add-box-line',
              title: 'Product Entry',
              desc: 'Easily log product details including expiry dates, stock levels, and sales velocity',
              iconBg: 'bg-blue-100 dark:bg-blue-900',
              iconColor: 'text-blue-600 dark:text-blue-300',
            },
            {
              icon: 'ri-alarm-warning-line',
              title: 'Smart Alerts',
              desc: 'Get real-time notifications for products at risk of expiring before they sell out',
              iconBg: 'bg-red-100 dark:bg-red-900',
              iconColor: 'text-red-600 dark:text-red-300',
            },
            {
              icon: 'ri-discount-percent-line',
              title: 'Discount Engine',
              desc: 'Receive intelligent discount suggestions to boost sales and minimize waste',
              iconBg: 'bg-orange-100 dark:bg-orange-900',
              iconColor: 'text-orange-600 dark:text-orange-300',
            },
          ].map((card, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className={`w-16 h-16 ${card.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <i className={`${card.icon} ${card.iconColor} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Our Solution?
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Reduce Waste by 60%',
                    desc: 'Proactive expiry management prevents products from going bad on shelves',
                  },
                  {
                    title: 'Increase Revenue by 25%',
                    desc: 'Strategic discounting moves inventory faster while maintaining profitability',
                  },
                  {
                    title: 'Save 2 Hours Daily',
                    desc: 'Automated tracking eliminates manual inventory checks and calculations',
                  },
                ].map((item, i) => (
                  <div className="flex items-start" key={i}>
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 mt-1">
                      <i className="ri-check-line text-green-600 dark:text-green-300 text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-xl p-8 text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-300 mb-2">₹15,000</div>
              <div className="text-gray-600 dark:text-gray-300 mb-4">Average monthly savings per store</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Based on 50% waste reduction and 20% revenue increase for medium-sized grocery stores
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-medium rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg whitespace-nowrap cursor-pointer"
          >
            <i className="ri-dashboard-line mr-2"></i>
            Launch Dashboard
          </Link>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            Start managing your perishable inventory smarter today
          </p>
        </div>
      </div>
    </div>
  );
}
