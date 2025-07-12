'use client';

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

interface ProcurementRecommendationsProps {
  products: Product[];
  darkMode: boolean;
}

interface ProcurementItem {
  product: Product;
  daysUntilSoldOut: number;
  recommendedQuantity: number;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  estimatedRevenue: number;
}

export default function ProcurementRecommendations({ products, darkMode }: ProcurementRecommendationsProps) {
  const calculateProcurementRecommendations = (): ProcurementItem[] => {
    const recommendations: ProcurementItem[] = [];

    products.forEach(product => {
      if (product.markedAsSold || product.isIgnored) return;

      const daysUntilSoldOut = product.averageSalesPerDay > 0 
        ? Math.ceil(product.quantity / product.averageSalesPerDay)
        : Infinity;

      if (daysUntilSoldOut <= 7 && daysUntilSoldOut !== Infinity) {
        let urgency: 'high' | 'medium' | 'low' = 'low';
        let reason = '';
        let recommendedQuantity = 0;

        if (daysUntilSoldOut <= 2) {
          urgency = 'high';
          reason = 'Will sell out within 2 days - urgent reorder needed';
          recommendedQuantity = Math.ceil(product.averageSalesPerDay * 14); // 2 weeks supply
        } else if (daysUntilSoldOut <= 4) {
          urgency = 'medium';
          reason = 'Will sell out within 4 days - reorder recommended';
          recommendedQuantity = Math.ceil(product.averageSalesPerDay * 10); // 10 days supply
        } else if (daysUntilSoldOut <= 7) {
          urgency = 'low';
          reason = 'Will sell out within a week - plan reorder';
          recommendedQuantity = Math.ceil(product.averageSalesPerDay * 7); // 1 week supply
        }

        const estimatedRevenue = recommendedQuantity * (product.sellingPrice - product.costPrice);

        recommendations.push({
          product,
          daysUntilSoldOut,
          recommendedQuantity,
          urgency,
          reason,
          estimatedRevenue
        });
      }
    });

    return recommendations.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
  };

  const recommendations = calculateProcurementRecommendations();

  const getUrgencyColor = (urgency: string) => {
    if (darkMode) {
      switch (urgency) {
        case 'high': return 'bg-purple-900/20 border-purple-700';
        case 'medium': return 'bg-blue-900/20 border-blue-700';
        default: return 'bg-green-900/20 border-green-700';
      }
    }
    switch (urgency) {
      case 'high': return 'bg-purple-50 border-purple-200';
      case 'medium': return 'bg-blue-50 border-blue-200';
      default: return 'bg-green-50 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'ri-flashlight-fill text-purple-500';
      case 'medium': return 'ri-time-line text-blue-500';
      default: return 'ri-shopping-cart-line text-green-500';
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className={`rounded-xl shadow-sm border p-6 transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <i className="ri-shopping-cart-2-line text-purple-600 text-xl"></i>
          </div>
          <h2 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Procurement Recommendations
          </h2>
        </div>
        <div className="text-center py-8">
          <i className="ri-checkbox-circle-fill text-green-500 text-3xl mb-3"></i>
          <p className={`transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            All products have sufficient stock levels!
          </p>
          <p className={`text-sm mt-1 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No urgent reorders needed at this time
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <i className="ri-shopping-cart-2-line text-purple-600 text-xl"></i>
          </div>
          <h2 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Procurement Recommendations
          </h2>
        </div>
        <div className={`text-sm transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {recommendations.length} item{recommendations.length !== 1 ? 's' : ''} need reordering
        </div>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {recommendations.map((item) => (
          <div
            key={item.product.id}
            className={`p-4 rounded-lg border-2 ${getUrgencyColor(item.urgency)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <i className={`${getUrgencyIcon(item.urgency)} text-lg mr-2`}></i>
                  <h3 className={`font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.product.name}
                  </h3>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full transition-colors ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.product.category}
                  </span>
                </div>

                <p className={`text-sm mb-3 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.reason}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className={`p-3 rounded-lg border transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`text-xs uppercase tracking-wide transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Current Stock
                    </div>
                    <div className={`text-lg font-bold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.product.quantity}
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg border transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`text-xs uppercase tracking-wide transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Sells Out In
                    </div>
                    <div className="text-lg font-bold text-orange-600">
                      {item.daysUntilSoldOut} days
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`text-xs uppercase tracking-wide transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Recommended Qty
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {item.recommendedQuantity}
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`text-xs uppercase tracking-wide transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Est. Revenue
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ₹{item.estimatedRevenue.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-4">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">
                  <i className="ri-add-line mr-1"></i>
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-4 p-4 rounded-lg transition-colors ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className={`flex items-center text-sm transition-colors ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <i className="ri-information-line mr-2"></i>
          <span>
            Recommendations based on current sales velocity and stock levels. 
            Reorder quantities ensure optimal inventory without overstocking.
          </span>
        </div>
      </div>
    </div>
  );
}