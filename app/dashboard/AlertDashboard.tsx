
'use client';

import { useState } from 'react';

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

type UserRole = 'admin' | 'staff';

interface AlertDashboardProps {
  products: Product[];
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  userRole: UserRole;
  darkMode: boolean;
}

interface RiskAnalysis {
  product: Product;
  daysUntilExpiry: number;
  daysUntilSoldOut: number;
  riskLevel: 'high' | 'medium' | 'low';
  willExpire: boolean;
  potentialLoss: number;
}

export default function AlertDashboard({ products, onUpdateProduct, onDeleteProduct, userRole, darkMode }: AlertDashboardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showIgnoreModal, setShowIgnoreModal] = useState(false);
  const [ignoringProduct, setIgnoringProduct] = useState<Product | null>(null);
  const [ignoreReason, setIgnoreReason] = useState('');

  const calculateRiskAnalysis = (product: Product): RiskAnalysis => {
    const today = new Date();
    const expiryDate = new Date(product.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const daysUntilSoldOut = product.averageSalesPerDay > 0
      ? Math.ceil(product.quantity / product.averageSalesPerDay)
      : Infinity;

    const willExpire = daysUntilSoldOut > daysUntilExpiry;

    let riskLevel: 'high' | 'medium' | 'low' = 'low';
    if (willExpire && daysUntilExpiry <= 2) {
      riskLevel = 'high';
    } else if (willExpire && daysUntilExpiry <= 5) {
      riskLevel = 'medium';
    } else if (daysUntilExpiry <= 1) {
      riskLevel = 'high';
    }

    const potentialLoss = willExpire
      ? (product.quantity - (product.averageSalesPerDay * daysUntilExpiry)) * product.costPrice
      : 0;

    return {
      product,
      daysUntilExpiry,
      daysUntilSoldOut,
      riskLevel,
      willExpire,
      potentialLoss: Math.max(0, potentialLoss)
    };
  };

  const riskAnalyses = products
    .filter(product => !product.isIgnored && !product.markedAsSold)
    .map(calculateRiskAnalysis);
  const sortedAnalyses = riskAnalyses.sort((a, b) => {
    const riskOrder = { high: 3, medium: 2, low: 1 };
    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
  });

  const highRiskCount = riskAnalyses.filter(r => r.riskLevel === 'high').length;
  const mediumRiskCount = riskAnalyses.filter(r => r.riskLevel === 'medium').length;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedProduct: Product) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, updatedProduct);
      setShowEditModal(false);
      setEditingProduct(null);
    }
  };

  const getRiskColor = (level: string) => {
    if (darkMode) {
      switch (level) {
        case 'high': return 'bg-red-900/20 border-red-700';
        case 'medium': return 'bg-yellow-900/20 border-yellow-700';
        default: return 'bg-green-900/20 border-green-700';
      }
    }
    switch (level) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-green-50 border-green-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return 'ri-error-warning-fill text-red-500';
      case 'medium': return 'ri-alert-fill text-yellow-500';
      default: return 'ri-checkbox-circle-fill text-green-500';
    }
  };

  const handleIgnoreAlert = (product: Product) => {
    setIgnoringProduct(product);
    setShowIgnoreModal(true);
  };

  const confirmIgnoreAlert = () => {
    if (ignoringProduct) {
      onUpdateProduct(ignoringProduct.id, {
        isIgnored: true,
        ignoredReason: ignoreReason || 'No reason provided'
      });
      setShowIgnoreModal(false);
      setIgnoringProduct(null);
      setIgnoreReason('');
    }
  };

  const handleMarkAsSold = (product: Product) => {
    onUpdateProduct(product.id, { markedAsSold: true });
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-red-600 text-xl">⚠</span>
          </div>
          <h2 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Risk Alerts
          </h2>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>High Risk: {highRiskCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Medium Risk: {mediumRiskCount}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedAnalyses.map((analysis) => (
          <div
            key={analysis.product.id}
            className={`p-4 rounded-lg border-2 ${getRiskColor(analysis.riskLevel)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`text-lg mr-2 ${getRiskIcon(analysis.riskLevel)}`}>
                    {analysis.riskLevel === 'high' ? '🔥' : analysis.riskLevel === 'medium' ? '⚡' : '✅'}
                  </span>
                  <h3 className={`font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {analysis.product.name}
                  </h3>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full transition-colors ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {analysis.product.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stock:</span>
                    <span className={`ml-1 font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {analysis.product.quantity}
                    </span>
                  </div>
                  <div>
                    <span className={`transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expires in:</span>
                    <span className={`ml-1 font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {analysis.daysUntilExpiry} days
                    </span>
                  </div>
                  <div>
                    <span className={`transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sales/day:</span>
                    <span className={`ml-1 font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {analysis.product.averageSalesPerDay}
                    </span>
                  </div>
                  <div>
                    <span className={`transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sold out in:</span>
                    <span className={`ml-1 font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {analysis.daysUntilSoldOut === Infinity ? '∞' : `${analysis.daysUntilSoldOut} days`}
                    </span>
                  </div>
                </div>

                {analysis.willExpire && (
                  <div className={`mt-3 p-3 border rounded-lg transition-colors ${darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center text-red-700">
                      <span className="text-sm mr-2">⚠</span>
                      <span className="text-sm font-medium">
                        Will expire before selling out! Potential loss: ₹{analysis.potentialLoss.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleMarkAsSold(analysis.product)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/20' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                  title="Mark as Sold"
                >
                  <span className="text-sm">✓</span>
                </button>

                <button
                  onClick={() => handleIgnoreAlert(analysis.product)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                  title="Ignore Alert"
                >
                  <span className="text-sm">👁</span>
                </button>

                {userRole === 'admin' && (
                  <>
                    <button
                      onClick={() => handleEdit(analysis.product)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                      title="Edit Product"
                    >
                      <span className="text-sm">✏</span>
                    </button>
                    <button
                      onClick={() => onDeleteProduct(analysis.product.id)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                      title="Delete Product"
                    >
                      <span className="text-sm">🗑</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showIgnoreModal && ignoringProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-full max-w-md mx-4 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ignore Alert
              </h3>
              <button
                onClick={() => setShowIgnoreModal(false)}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ✕
              </button>
            </div>

            <p className={`mb-4 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Why are you ignoring the alert for "{ignoringProduct.name}"?
            </p>

            <div className="space-y-3 mb-4">
              {['Already handled manually', 'False positive', 'Will be restocked soon', 'Customer pre-ordered', 'Other'].map((reason) => (
                <label key={reason} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ignoreReason"
                    value={reason}
                    checked={ignoreReason === reason}
                    onChange={(e) => setIgnoreReason(e.target.value)}
                    className="mr-3 cursor-pointer"
                  />
                  <span className={`transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {reason}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowIgnoreModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer ${darkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmIgnoreAlert}
                disabled={!ignoreReason}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm whitespace-nowrap cursor-pointer"
              >
                Ignore Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          userRole={userRole}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

interface EditProductModalProps {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
  userRole: UserRole;
  darkMode: boolean;
}

function EditProductModal({ product, onSave, onClose, userRole, darkMode }: EditProductModalProps) {
  const [formData, setFormData] = useState(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'averageSalesPerDay' || name === 'costPrice' || name === 'sellingPrice'
        ? parseFloat(value) || 0
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl p-6 w-full max-w-md mx-4 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Edit Product
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              min="0"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Sales per Day
            </label>
            <input
              type="number"
              name="averageSalesPerDay"
              value={formData.averageSalesPerDay}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              min="0"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </div>

          {userRole === 'admin' && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cost Price (₹)
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer ${darkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
