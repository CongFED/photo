'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BookingItem, CustomerInfo, PricingResult } from '@/types/booking';

interface BookingState {
  items: BookingItem[];
  startDate: string;
  endDate: string;
  receiveTime: string;
  returnTime: string;
  customerInfo: Partial<CustomerInfo>;
  pricing: PricingResult | null;
  lastBookingCode: string | null;
}

interface BookingContextType extends BookingState {
  addItem: (item: BookingItem) => void;
  removeItem: (productId: string) => void;
  updateDates: (startDate: string, endDate: string) => void;
  updateTimes: (receiveTime: string, returnTime: string) => void;
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  updatePricing: (pricing: PricingResult) => void;
  setLastBookingCode: (code: string) => void;
  clearBooking: () => void;
  totalItems: number;
}

const initialState: BookingState = {
  items: [],
  startDate: '',
  endDate: '',
  receiveTime: '09:00',
  returnTime: '18:00',
  customerInfo: {},
  pricing: null,
  lastBookingCode: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'photograper-booking';

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed);
      }
    } catch {
      // localStorage not available
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage not available
    }
  }, [state, isHydrated]);

  const addItem = useCallback((item: BookingItem) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { ...prev, items: [...prev.items, item] };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  }, []);

  const updateDates = useCallback((startDate: string, endDate: string) => {
    setState((prev) => ({ ...prev, startDate, endDate }));
  }, []);

  const updateTimes = useCallback((receiveTime: string, returnTime: string) => {
    setState((prev) => ({ ...prev, receiveTime, returnTime }));
  }, []);

  const updateCustomerInfo = useCallback((info: Partial<CustomerInfo>) => {
    setState((prev) => ({
      ...prev,
      customerInfo: { ...prev.customerInfo, ...info },
    }));
  }, []);

  const updatePricing = useCallback((pricing: PricingResult) => {
    setState((prev) => ({ ...prev, pricing }));
  }, []);

  const setLastBookingCode = useCallback((code: string) => {
    setState((prev) => ({ ...prev, lastBookingCode: code }));
  }, []);

  const clearBooking = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BookingContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateDates,
        updateTimes,
        updateCustomerInfo,
        updatePricing,
        setLastBookingCode,
        clearBooking,
        totalItems,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextType {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
