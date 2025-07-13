"use client";

import { useState, useEffect } from "react";
import ProductEntryForm from "./ProductEntryForm";
import AlertDashboard from "./AlertDashboard";
import DiscountSuggestions from "./DiscountSuggestions";
import DataVisualizer from "./DataVisualizer";
import ProcurementRecommendations from "./ProcurementRecommendations";

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

type UserRole = "admin" | "staff";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);

      // Load dark mode preference from localStorage
      const storedDarkMode = localStorage.getItem("darkMode");
      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === "true");
      }

      // Load initial product data
      setProducts([
        {
          id: "1",
          name: "Fresh Milk (1L)",
          category: "Dairy",
          quantity: 24,
          expiryDate: "2024-01-15",
          averageSalesPerDay: 8,
          costPrice: 45,
          sellingPrice: 65,
          dateAdded: "2024-01-10",
        },
        {
          id: "2",
          name: "Whole Wheat Bread",
          category: "Bakery",
          quantity: 15,
          expiryDate: "2024-01-14",
          averageSalesPerDay: 12,
          costPrice: 25,
          sellingPrice: 40,
          dateAdded: "2024-01-10",
        },
        {
          id: "3",
          name: "Fresh Tomatoes (1kg)",
          category: "Vegetables",
          quantity: 30,
          expiryDate: "2024-01-13",
          averageSalesPerDay: 5,
          costPrice: 35,
          sellingPrice: 50,
          dateAdded: "2024-01-09",
        },
        {
          id: "4",
          name: "Greek Yogurt",
          category: "Dairy",
          quantity: 18,
          expiryDate: "2024-01-18",
          averageSalesPerDay: 6,
          costPrice: 60,
          sellingPrice: 85,
          dateAdded: "2024-01-10",
        },
        {
          id: "5",
          name: "Fresh Spinach",
          category: "Vegetables",
          quantity: 12,
          expiryDate: "2024-01-12",
          averageSalesPerDay: 3,
          costPrice: 20,
          sellingPrice: 35,
          dateAdded: "2024-01-08",
        },
        {
          id: "6",
          name: "Banana (dozen)",
          category: "Fruits",
          quantity: 5,
          expiryDate: "2024-01-16",
          averageSalesPerDay: 15,
          costPrice: 30,
          sellingPrice: 45,
          dateAdded: "2024-01-10",
        },
        {
          id: "7",
          name: "Chicken Breast (1kg)",
          category: "Meat",
          quantity: 8,
          expiryDate: "2024-01-17",
          averageSalesPerDay: 12,
          costPrice: 180,
          sellingPrice: 220,
          dateAdded: "2024-01-10",
        },
      ]);
    }
  }, []);

  const addProduct = (product: Omit<Product, "id" | "dateAdded">) => {
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const exportData = (format: "csv" | "pdf") => {
    const csvData = products.map((product) => ({
      Name: product.name,
      Category: product.category,
      Quantity: product.quantity,
      "Expiry Date": product.expiryDate,
      "Sales Per Day": product.averageSalesPerDay,
      "Cost Price": product.costPrice,
      "Selling Price": product.sellingPrice,
      "Date Added": product.dateAdded,
    }));

    if (format === "csv") {
      const csvContent = [
        Object.keys(csvData[0]).join(","),
        ...csvData.map((row) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory-report-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
    } else {
      alert("PDF export feature coming soon! For now, use CSV export.");
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-store-2-line text-white text-lg"></i>
          </div>
          <div className="text-lg text-gray-600">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`shadow-sm border-b transition-colors ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-store-2-line text-white text-lg"></i>
              </div>
              <h1
                className={`text-xl font-bold transition-colors ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Don-t-perish
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Role Selector */}
              <div className="flex items-center space-x-2">
                <i
                  className={`ri-user-line text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                ></i>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className={`px-3 py-1 rounded-lg border text-sm cursor-pointer pr-8 transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportData("csv")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <i className="ri-download-line mr-1"></i>
                  Export CSV
                </button>
                <button
                  onClick={() => exportData("pdf")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    darkMode
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  <i className="ri-file-pdf-line mr-1"></i>
                  Export PDF
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => {
                  setDarkMode((prev) => {
                    const newMode = !prev;
                    if (typeof window !== "undefined") {
                      localStorage.setItem("darkMode", newMode.toString());
                    }
                    return newMode;
                  });
                }}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <i
                  className={`text-lg ${
                    darkMode ? "ri-sun-line" : "ri-moon-line"
                  }`}
                ></i>
              </button>

              <div
                className={`text-sm transition-colors ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Products:{" "}
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {products.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProductEntryForm
              onAddProduct={addProduct}
              userRole={userRole}
              darkMode={darkMode}
            />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <AlertDashboard
              products={products}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
              userRole={userRole}
              darkMode={darkMode}
            />

            <ProcurementRecommendations
              products={products}
              darkMode={darkMode}
            />

            <DiscountSuggestions
              products={products}
              userRole={userRole}
              darkMode={darkMode}
            />

            <DataVisualizer products={products} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
