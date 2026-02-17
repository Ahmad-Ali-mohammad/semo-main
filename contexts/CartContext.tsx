
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Reptile } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Reptile) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const STORAGE_KEY = 'cart_items';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from sessionStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem(STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync with sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Reptile) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };
  
  const clearCart = () => {
      setCart([]);
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
