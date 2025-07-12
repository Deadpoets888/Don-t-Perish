
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

type UserRole = 'admin' | 'staff';

interface DiscountSuggestionsProps {
  products: Product[];
  userRole: UserRole;
  darkMode: boolean;
}

interface DiscountSuggestion {
  product: Product;
  suggestedDiscount: number;
  newPrice: number;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
  estimatedBoost: number;
  potentialSavings: number;
  carbonSavings: {
    foodWastePrevented: number;
    co2Saved: number;
  };
}

export default function DiscountSuggestions({ products, userRole, darkMode }: DiscountSuggestionsProps) {
  const calculateDiscountSuggestions = (): DiscountSuggestion[] => {
    const suggestions: DiscountSuggestion[] = [];

    products.forEach(product => {
      if (product.markedAsSold || product.isIgnored) return;

      const today = new Date();
      const expiryDate = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      const daysUntilSoldOut = product.averageSalesPerDay > 0 
        ? Math.ceil(product.quantity / product.averageSalesPerDay)
        : Infinity;
      
      const willExpire = daysUntilSoldOut > daysUntilExpiry;

      if (willExpire || daysUntilExpiry <= 3) {
        let suggestedDiscount = 0;
        let reason = '';
        let urgency: 'high' | 'medium' | 'low' = 'low';
        let estimatedBoost = 1;

        if (daysUntilExpiry <= 1) {
          suggestedDiscount = 50;
          reason = 'Expires tomorrow - urgent clearance needed';
          urgency = 'high';
          estimatedBoost = 3;
        } else if (daysUntilExpiry <= 2) {
          suggestedDiscount = 35;
          reason = 'Expires within 2 days - significant discount needed';
          urgency = 'high';
          estimatedBoost = 2.5;
        } else if (daysUntilExpiry <= 3) {
          suggestedDiscount = 25;
          reason = 'Expires within 3 days - moderate discount recommended';
          urgency = 'medium';
          estimatedBoost = 2;
        } else if (willExpire) {
          const riskDays = daysUntilSoldOut - daysUntilExpiry;
          if (riskDays > 5) {
            suggestedDiscount = 30;
            reason = 'High risk of expiry - boost sales velocity';
            urgency = 'high';
            estimatedBoost = 2.2;
          } else if (riskDays > 2) {
            suggestedDiscount = 20;
            reason = 'Medium risk of expiry - increase sales pace';
            urgency = 'medium';
            estimatedBoost = 1.8;
          } else {
            suggestedDiscount = 15;
            reason = 'Low risk of expiry - slight discount to boost sales';
            urgency = 'low';
            estimatedBoost = 1.5;
          }
        }

        if (suggestedDiscount > 0) {
          const newPrice = product.sellingPrice * (1 - suggestedDiscount / 100);
          const potentialLoss = willExpire 
            ? (product.quantity - (product.averageSalesPerDay * daysUntilExpiry)) * product.costPrice
            : 0;
          
          const wastePreventedKg = willExpire 
            ? (product.quantity - (product.averageSalesPerDay * daysUntilExpiry)) * 0.5
            : product.quantity * 0.3;
          
          const co2SavedKg = wastePreventedKg * 2.75;
          
          suggestions.push({
            product,
            suggestedDiscount,
            newPrice,
            reason,
            urgency,
            estimatedBoost,
            potentialSavings: Math.max(0, potentialLoss),
            carbonSavings: {
              foodWastePrevented: Math.max(0, wastePreventedKg),
              co2Saved: Math.max(0, co2SavedKg)
            }
          });
        }
      }
    });

    return suggestions.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
  };

  const suggestions = calculateDiscountSuggestions();
  
  const totalCarbonSavings = suggestions.reduce((total, suggestion) => ({
    foodWastePrevented: total.foodWastePrevented + suggestion.carbonSavings.foodWastePrevented,
    co2Saved: total.co2Saved + suggestion.carbonSavings.co2Saved
  }), { foodWastePrevented: 0, co2Saved: 0 });

  const getUrgencyColor = (urgency: string) => {
    if (darkMode) {
      switch (urgency) {
        case 'high': return 'bg-red-900/20 border-red-700';
        case 'medium': return 'bg-yellow-900/20 border-yellow-700';
        default: return 'bg-blue-900/20 border-blue-700';
      }
    }
    switch (urgency) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      default: return '💡';
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className={`rounded-xl shadow-sm border p-6 transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-green-600 text-xl">💰</span>
          </div>
          <h2 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Discount Suggestions
          </h2>
        </div>
        <div className="text-center py-8">
          <span className="text-green-500 text-3xl mb-3">✅</span>
          <p className={`transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No discount suggestions needed at this time!
          </p>
          <p className={`text-sm mt-1 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            All products are selling at optimal pace
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
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-orange-600 text-xl">💰</span>
          </div>
          <h2 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Discount Suggestions
          </h2>
        </div>
        <div className={`text-sm transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {suggestions.length} product{suggestions.length !== 1 ? 's' : ''} need attention
        </div>
      </div>

      {totalCarbonSavings.co2Saved > 0 && (
        <div className={`mb-6 p-4 border rounded-lg transition-colors ${
          darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 text-lg">🌱</span>
            </div>
            <h3 className="font-semibold text-green-800">Carbon Savings Tracker</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border transition-colors ${
              darkMode ? 'bg-gray-700 border-green-600' : 'bg-white border-green-200'
            }`}>
              <div className="text-xs text-green-600 uppercase tracking-wide font-medium">Food Waste Prevented</div>
              <div className="text-2xl font-bold text-green-700">
                {totalCarbonSavings.foodWastePrevented.toFixed(1)}kg
              </div>
              <div className="text-sm text-green-600">By discounting instead of disposal</div>
            </div>
            <div className={`p-3 rounded-lg border transition-colors ${
              darkMode ? 'bg-gray-700 border-green-600' : 'bg-white border-green-200'
            }`}>
              <div className="text-xs text-green-600 uppercase tracking-wide font-medium">CO₂ Emissions Saved</div>
              <div className="text-2xl font-bold text-green-700">
                {totalCarbonSavings.co2Saved.toFixed(1)}kg CO₂e
              </div>
              <div className="text-sm text-green-600">Environmental impact reduction</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.product.id}
            className={`p-4 rounded-lg border-2 ${getUrgencyColor(suggestion.urgency)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">{getUrgencyIcon(suggestion.urgency)}</span>
                  <h3 className={`font-medium transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {suggestion.product.name}
                  </h3>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full transition-colors ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {suggestion.product.category}
                  </span>
                </div>

                <p className={`text-sm mb-3 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {suggestion.reason}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className={`p-3 rounded-lg border transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`text-xs uppercase tracking-wide transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Suggested Discount
                    </div>
                    <div className="text-lg font-bold text-red-600">{suggestion.suggestedDiscount}% OFF</div>
                  </div>
                  
                  <div className={`p-3 rounded-lg border transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`text-xs uppercase tracking-wide transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      New Price
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ₹{suggestion.newPrice.toFixed(2)}
                      <span className={`text-sm line-through ml-2 transition-colors ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        ₹{suggestion.product.sellingPrice}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`text-xs uppercase tracking-wide transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Expected Sales Boost
                    </div>
                    <div className="text-lg font-bold text-blue-600">{suggestion.estimatedBoost}x</div>
                  </div>
                </div>

                {suggestion.carbonSavings.co2Saved > 0 && (
                  <div className={`mb-3 p-3 border rounded-lg transition-colors ${
                    darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center text-green-700 mb-1">
                      <span className="text-sm mr-2">🌱</span>
                      <span className="text-sm font-medium">Carbon Impact Prevention</span>
                    </div>
                    <div className="text-sm text-green-600">
                      Prevents {suggestion.carbonSavings.foodWastePrevented.toFixed(1)}kg food waste — 
                      saves {suggestion.carbonSavings.co2Saved.toFixed(1)}kg CO₂e
                    </div>
                  </div>
                )}

                {suggestion.potentialSavings > 0 && (
                  <div className={`border rounded-lg p-3 transition-colors ${
                    darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center text-blue-700">
                      <span className="text-sm mr-2">💰</span>
                      <span className="text-sm font-medium">
                        Potential loss prevention: ₹{suggestion.potentialSavings.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <button 
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
                  disabled={userRole === 'staff' && suggestion.suggestedDiscount > 30}
                >
                  {userRole === 'staff' && suggestion.suggestedDiscount > 30 ? (
                    <>
                      <span className="mr-1">🔒</span>
                      Admin Only
                    </>
                  ) : (
                    'Apply Discount'
                  )}
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
          <span className="mr-2">ℹ</span>
          <span>
            Discount suggestions help minimize waste and maximize revenue. Carbon savings calculated using 
            1kg food waste = 2.75kg CO₂e emissions prevented.
            {userRole === 'staff' && ' (Discounts over 30% require admin approval)'}
          </span>
        </div>
      </div>
    </div>
  );
}
