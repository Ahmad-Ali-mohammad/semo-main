
import React, { createContext, useState, ReactNode } from 'react';

type WishlistContextType = {
  wishlist: number[];
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
};

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const addToWishlist = (id: number) => {
    setWishlist((prev) => [...new Set([...prev, id])]);
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((itemId) => itemId !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
