'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  averageSalesPerDay: number;
  costPrice: number;
  sellingPrice: number;
  dateAdded: string;
  isIgnored?: boolean;
  ignoredReason?: string;
  markedAsSold?: boolean;
}

interface DataVisualizerProps {
  products: Product[];
  darkMode: boolean;
}

export default function DataVisualizer({ products, darkMode }: DataVisualizerProps) {
  const calculateRiskAnalysis = (product: Product) => {
    const today = new Date();
    const expiryDate = new Date(product.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const daysUntilSoldOut = product.averageSalesPerDay > 0 
      ? Math.ceil(product.quantity / product.averageSalesPerDay)
      : Infinity;
    
    const willExpire = daysUntilSoldOut > daysUntilExpiry;
    
    let riskLevel: 'High' | 'Medium' | 'Low' = 'Low';
    if (willExpire && daysUntilExpiry <= 2) {
      riskLevel = 'High';
    } else if (willExpire && daysUntilExpiry <= 5) {
      riskLevel = 'Medium';
    } else if (daysUntilExpiry <= 1) {
      riskLevel = 'High';
    }

    return { ...product, riskLevel, daysUntilExpiry, willExpire };
  };

  const activeProducts = products.filter(p => !p.markedAsSold && !p.isIgnored);
  const analyzedProducts = activeProducts.map(calculateRiskAnalysis);

  // Category Risk Distribution
  const categoryRiskData = Object.entries(
    analyzedProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = { High: 0, Medium: 0, Low: 0 };
      }
      acc[category][product.riskLevel]++;
      return acc;
    }, {} as Record<string, Record<string, number>>)
  ).map(([category, risks]) => ({
    category,
    ...risks,
    total: risks.High + risks.Medium + risks.Low
  }));

  // Expiry Timeline
  const expiryTimelineData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const expiringItems = analyzedProducts.filter(p => p.expiryDate === dateStr).length;
    const atRiskItems = analyzedProducts.filter(p => {
      const daysUntil = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil === i && p.willExpire;
    }).length;

    return {
      day: `Day ${i + 1}`,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      expiring: expiringItems,
      atRisk: atRiskItems
    };
  });

  // Risk Distribution Pie Chart
  const riskDistribution = [
    { name: 'High Risk', value: analyzedProducts.filter(p => p.riskLevel === 'High').length, color: '#ef4444' },
    { name: 'Medium Risk', value: analyzedProducts.filter(p => p.riskLevel === 'Medium').length, color: '#f59e0b' },
    { name: 'Low Risk', value: analyzedProducts.filter(p => p.riskLevel === 'Low').length, color: '#10b981' }
  ].filter(item => item.value > 0);

  // Key Metrics
  const totalValue = analyzedProducts.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
  const atRiskValue = analyzedProducts
    .filter(p => p.willExpire)
    .reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
  const potentialWaste = analyzedProducts
    .filter(p => p.willExpire)
    .reduce((sum, p) => sum + (p.quantity - (p.averageSalesPerDay * p.daysUntilExpiry)), 0);

  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const subtextColor = darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          <i className="ri-bar-chart-box-line text-purple-600 text-xl"></i>
        </div>
        <h2 className={`text-xl font-semibold transition-colors ${textColor}`}>
          Analytics Dashboard
        </h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg border transition-colors ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-xs uppercase tracking-wide transition-colors ${subtextColor}`}>
            Total Inventory Value
          </div>
          <div className={`text-2xl font-bold transition-colors ${textColor}`}>
            ₹{totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-green-600">
            <i className="ri-arrow-up-line mr-1"></i>
            Active stock
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-xs uppercase tracking-wide transition-colors ${subtextColor}`}>
            At Risk Value
          </div>
          <div className="text-2xl font-bold text-red-600">
            ₹{atRiskValue.toLocaleString()}
          </div>
          <div className="text-sm text-red-600">
            <i className="ri-alert-line mr-1"></i>
            May expire
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-xs uppercase tracking-wide transition-colors ${subtextColor}`}>
            High Risk Items
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {analyzedProducts.filter(p => p.riskLevel === 'High').length}
          </div>
          <div className="text-sm text-orange-600">
            <i className="ri-fire-line mr-1"></i>
            Need attention
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-xs uppercase tracking-wide transition-colors ${subtextColor}`}>
            Potential Waste
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.max(0, potentialWaste).toFixed(0)} units
          </div>
          <div className="text-sm text-purple-600">
            <i className="ri-delete-bin-line mr-1"></i>
            If no action
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiry Timeline */}
        <div className={`p-4 rounded-lg border transition-colors ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 transition-colors ${textColor}`}>
            14-Day Expiry Forecast
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={expiryTimelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                axisLine={{ stroke: darkMode ? '#4b5563' : '#d1d5db' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                axisLine={{ stroke: darkMode ? '#4b5563' : '#d1d5db' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
              <Area type="monotone" dataKey="expiring" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="atRisk" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className={`p-4 rounded-lg border transition-colors ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 transition-colors ${textColor}`}>
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Risk Analysis */}
        <div className={`lg:col-span-2 p-4 rounded-lg border transition-colors ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 transition-colors ${textColor}`}>
            Category Risk Analysis
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryRiskData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                axisLine={{ stroke: darkMode ? '#4b5563' : '#d1d5db' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                axisLine={{ stroke: darkMode ? '#4b5563' : '#d1d5db' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
              <Legend />
              <Bar dataKey="High" stackId="a" fill="#ef4444" />
              <Bar dataKey="Medium" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Low" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`mt-4 p-4 rounded-lg transition-colors ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className={`flex items-center text-sm transition-colors ${subtextColor}`}>
          <i className="ri-information-line mr-2"></i>
          <span>
            Analytics update in real-time based on inventory data. Use these insights to make informed decisions about procurement and pricing.
          </span>
        </div>
      </div>
    </div>
  );
}