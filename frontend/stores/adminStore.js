"use client";

import { create } from "zustand";

export const useAdminStore = create((set) => ({
  notifications: [],
  aiRules: {
    reviewGenerator: true,
    productFinder: true,
    negotiationDrafter: true,
    descriptionWriter: true,
    costCalculator: true,
  },
  pushNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: `${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...notification,
        },
        ...state.notifications,
      ],
    })),
  toggleRule: (key) =>
    set((state) => ({
      aiRules: { ...state.aiRules, [key]: !state.aiRules[key] },
    })),
}));
