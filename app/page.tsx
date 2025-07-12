
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="ri-store-2-line text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Perishable Inventory Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reduce food waste and maximize profits with intelligent expiry tracking, 
            risk alerts, and automated discount suggestions for your grocery store
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-add-box-line text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Entry</h3>
            <p className="text-gray-600 text-sm">
              Easily log product details including expiry dates, stock levels, and sales velocity
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-alarm-warning-line text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Alerts</h3>
            <p className="text-gray-600 text-sm">
              Get real-time notifications for products at risk of expiring before they sell out
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-discount-percent-line text-orange-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discount Engine</h3>
            <p className="text-gray-600 text-sm">
              Receive intelligent discount suggestions to boost sales and minimize waste
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose Our Solution?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Reduce Waste by 60%</h4>
                    <p className="text-gray-600 text-sm">Proactive expiry management prevents products from going bad on shelves</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Increase Revenue by 25%</h4>
                    <p className="text-gray-600 text-sm">Strategic discounting moves inventory faster while maintaining profitability</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Save 2 Hours Daily</h4>
                    <p className="text-gray-600 text-sm">Automated tracking eliminates manual inventory checks and calculations</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-8 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">₹15,000</div>
              <div className="text-gray-600 mb-4">Average monthly savings per store</div>
              <div className="text-sm text-gray-500">
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
          <p className="text-gray-500 text-sm mt-4">
            Start managing your perishable inventory smarter today
          </p>
        </div>
      </div>
    </div>
  );
}
