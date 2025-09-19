"use client";

import React, { createContext, useContext } from "react";

const CustomerContext = createContext(null);

export function CustomerProvider({ children, customer }) {
  return (
    <CustomerContext.Provider value={customer}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  return context;
}
