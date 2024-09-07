import { cache } from "react";

export interface TenantConfig {
  businessName: string;
  primaryColor: string;
  secondaryColor: string;
  services: Array<{
    id: number;
    name: string;
    price: number;
    duration: number;
  }>;
}

const tenantConfigs: { [key: string]: TenantConfig } = {
  tenant1: {
    businessName: "Sparkle Auto Detailing",
    primaryColor: "#3B82F6",
    secondaryColor: "#EF4444",
    services: [
      { id: 1, name: "Basic Wash", price: 30, duration: 30 },
      { id: 2, name: "Interior Detailing", price: 80, duration: 60 },
      { id: 3, name: "Exterior Detailing", price: 100, duration: 90 },
      { id: 4, name: "Full Detailing", price: 150, duration: 120 },
    ],
  },
  tenant2: {
    businessName: "Luxury Car Care",
    primaryColor: "#10B981",
    secondaryColor: "#6366F1",
    services: [
      { id: 1, name: "Premium Wash", price: 50, duration: 45 },
      { id: 2, name: "Interior Deep Clean", price: 120, duration: 90 },
      { id: 3, name: "Exterior Polish", price: 150, duration: 120 },
      { id: 4, name: "Full Luxury Detail", price: 250, duration: 180 },
    ],
  },
};

export const getTenantConfig = cache(
  async (tenant: string): Promise<TenantConfig> => {
    try {
      const response = await fetch(`/api/tenants/${tenant}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tenant config for ${tenant}`);
      }
      const tenantConfig: TenantConfig = await response.json();
      return tenantConfig;
    } catch (error) {
      console.error(error);
      return tenantConfigs[tenant] || tenantConfigs.tenant1;
    }
  }
);

