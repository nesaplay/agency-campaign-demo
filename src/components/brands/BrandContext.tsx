import React, { createContext, useContext, useState, useCallback } from "react";
import { Brand } from "./types";
import { mockBrands } from "./mockBrandsData";

interface BrandContextType {
  brands: Brand[];
  activeBrand: Brand | null;
  setActiveBrand: (brand: Brand) => void;
  addBrand: (
    newBrandData: Omit<Brand, "id" | "campaignCount" | "isActive" | "attachments" | "metrics"> 
                  & { attachments?: FileList | null; metrics?: Brand['metrics'] }
  ) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [activeBrand, setActiveBrandState] = useState<Brand | null>(
    () =>
      mockBrands.find((brand) => brand.isActive) ||
      (mockBrands.length > 0 ? { ...mockBrands[0], isActive: true } : null),
  );

  useState(() => {
    if (activeBrand && !mockBrands.find((b) => b.id === activeBrand.id && b.isActive)) {
      setBrands((prevBrands) => prevBrands.map((b) => ({ ...b, isActive: b.id === activeBrand.id })));
    }
  });

  const setActiveBrand = useCallback((brand: Brand) => {
    setActiveBrandState({ ...brand, isActive: true });
    setBrands((prevBrands) => prevBrands.map((b) => ({ ...b, isActive: b.id === brand.id })));
  }, []);

  const addBrand = useCallback(
    (
      newBrandData: Omit<Brand, "id" | "campaignCount" | "isActive" | "attachments" | "metrics"> 
                    & { attachments?: FileList | null; metrics?: Brand['metrics'] }
    ) => {
      const newBrand: Brand = {
        id: Date.now().toString(),
        campaignCount: 0,
        isActive: false,
        logoUrl: "",
        ...newBrandData,
        attachments: newBrandData.attachments
          ? Array.from(newBrandData.attachments).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))
          : [],
        metrics: {
          targetAudience: newBrandData.metrics?.targetAudience ?? { primary: '', interests: [], locations: [] },
          objectives: newBrandData.metrics?.objectives ?? [],
          performance: newBrandData.metrics?.performance ?? [],
        }
      };

      setBrands((prevBrands) => [...prevBrands, newBrand]);
    },
    [],
  );

  return (
    <BrandContext.Provider value={{ brands, activeBrand, setActiveBrand, addBrand }}>{children}</BrandContext.Provider>
  );
};

export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};
