"use client";

import React, { useState } from "react";
import WishlistTab from "./WishlistTab";

export default function AccountTabs({ customer }) {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "wishlist", label: "Wishlist", icon: "❤️" },
  ];
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-3 w-full">
                <div className="flex flex-row gap-2 items-center justify-start w-full">
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-900">
                    {customer?.emailAddress?.emailAddress}
                  </p>
                </div>
                {customer?.phoneNumber?.phoneNumber && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">
                      {customer?.phoneNumber?.phoneNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {customer?.defaultAddress && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Default Address</h2>
                <div className="space-y-2">
                  <p className="text-gray-900">
                    {customer?.defaultAddress.address1}
                    {customer?.defaultAddress.address2 && 
                      `, ${customer?.defaultAddress.address2}`
                    }
                  </p>
                  <p className="text-gray-900">
                    {customer?.defaultAddress.city}
                    {customer?.defaultAddress.province && 
                      `, ${customer?.defaultAddress.province}`
                    }
                  </p>
                  <p className="text-gray-900">
                    {customer?.defaultAddress.country} {customer?.defaultAddress.zip}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
              <a
                href="/logout"
                className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
              >
                Logout
              </a>
            </div>
          </div>
        )}

        {activeTab === "wishlist" && <WishlistTab />}
      </div>
    </div>
  );
}
