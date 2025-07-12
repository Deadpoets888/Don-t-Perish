'use client';

import { useState } from 'react';

interface Product {
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  averageSalesPerDay: number;
  costPrice: number;
  sellingPrice: number;
}

type UserRole = 'admin' | 'staff';

interface ProductEntryFormProps {
  onAddProduct: (product: Product) => void;
  userRole: UserRole;
  darkMode: boolean;
}

export default function ProductEntryForm({ onAddProduct, userRole, darkMode }: ProductEntryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dairy',
    quantity: 0,
    expiryDate: '',
    averageSalesPerDay: 0,
    costPrice: 0,
    sellingPrice: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Dairy', 'Bakery', 'Vegetables', 'Fruits', 'Meat', 'Frozen', 'Beverages', 'Snacks'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'averageSalesPerDay' || name === 'costPrice' || name === 'sellingPrice' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      onAddProduct(formData);
      setFormData({
        name: '',
        category: 'Dairy',
        quantity: 0,
        expiryDate: '',
        averageSalesPerDay: 0,
        costPrice: 0,
        sellingPrice: 0
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <i className="ri-add-box-line text-blue-600 text-xl"></i>
        </div>
        <h2 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Add New Product
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="e.g., Fresh Milk (1L)"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer pr-8 transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              min="0"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Sales per Day
            </label>
            <input
              type="number"
              name="averageSalesPerDay"
              value={formData.averageSalesPerDay || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              min="0"
              step="0.1"
              required
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          />
        </div>

        {userRole === 'admin' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cost Price (₹)
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Selling Price (₹)
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        )}

        {userRole === 'staff' && (
          <div className={`p-3 rounded-lg border transition-colors ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`flex items-center text-sm transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <i className="ri-information-line mr-2"></i>
              <span>Price information is managed by admin users</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Adding Product...
            </>
          ) : (
            <>
              <i className="ri-add-line mr-2"></i>
              Add Product
            </>
          )}
        </button>
      </form>

      <div className={`mt-4 p-3 rounded-lg transition-colors ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className={`flex items-center text-xs transition-colors ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <i className="ri-lightbulb-line mr-2"></i>
          <span>
            Enter accurate sales data to get better expiry predictions and discount recommendations
          </span>
        </div>
      </div>
    </div>
  );
}