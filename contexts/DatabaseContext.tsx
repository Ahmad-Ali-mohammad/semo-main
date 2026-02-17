import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Reptile, Order, Address, User, Article, HeroSlide, Supply } from '../types';
import { api } from '../services/api';

interface DatabaseContextType {
  products: Reptile[];
  orders: Order[];
  addresses: Address[];
  users: User[];
  articles: Article[];
  heroSlides: HeroSlide[];
  supplies: Supply[];
  loading: boolean;
  backendAvailable: boolean;
  dataSource: 'api';
  addProduct: (product: Reptile) => void;
  deleteProduct: (id: number) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: number) => void;
  createOrder: (order: Order) => void;
  updateOrder: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentVerificationStatus'], rejectionReason?: string) => void;
  addArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
  saveHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  addSupply: (supply: Supply) => void;
  deleteSupply: (id: number) => void;
  refreshData: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Reptile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  const refreshData = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.getProducts(),
      api.getOrders(),
      api.getAddresses(),
      api.getUsers(),
      api.getArticles(),
      api.getHeroSlides(),
      api.getSupplies(),
    ])
      .then(([p, o, a, u, ar, h, s]) => {
        setProducts(Array.isArray(p) ? p : []);
        setOrders(Array.isArray(o) ? o : []);
        setAddresses(Array.isArray(a) ? a : []);
        setUsers(Array.isArray(u) ? u : []);
        setArticles(Array.isArray(ar) ? ar : []);
        setHeroSlides(Array.isArray(h) ? h : []);
        setSupplies(Array.isArray(s) ? s : []);
        setBackendAvailable(true);
      })
      .catch((error) => {
        console.error(error);
        setBackendAvailable(false);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addProduct = (product: Reptile) => {
    api.saveProduct(product).then(() => refreshData()).catch(console.error);
  };

  const deleteProduct = (id: number) => {
    api.deleteProduct(id).then(() => refreshData()).catch(console.error);
  };

  const addAddress = (address: Address) => {
    api.saveAddress(address).then(() => refreshData()).catch(console.error);
  };

  const removeAddress = (id: number) => {
    api.deleteAddress(id).then(() => refreshData()).catch(console.error);
  };

  const addArticle = (article: Article) => {
    api.saveArticle(article).then(() => refreshData()).catch(console.error);
  };

  const deleteArticle = (id: number) => {
    api.deleteArticle(id).then(() => refreshData()).catch(console.error);
  };

  const saveHeroSlide = (slide: HeroSlide) => {
    api.saveHeroSlide(slide).then(() => refreshData()).catch(console.error);
  };

  const deleteHeroSlide = (id: string) => {
    api.deleteHeroSlide(id).then(() => refreshData()).catch(console.error);
  };

  const createOrder = (order: Order) => {
    api.saveOrder(order).then(() => refreshData()).catch(console.error);
  };

  const updateOrder = (id: string, status: Order['status']) => {
    api.updateOrderStatus(id, status).then(() => refreshData()).catch(console.error);
  };

  const deleteOrder = (id: string) => {
    api.deleteOrder(id).then(() => refreshData()).catch(console.error);
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: Order['paymentVerificationStatus'], rejectionReason?: string) => {
    api.updateOrderPaymentStatus(orderId, paymentStatus, rejectionReason).then(() => refreshData()).catch(console.error);
  };

  const updateUser = (user: User) => {
    api.saveUser(user).then(() => refreshData()).catch(console.error);
  };

  const deleteUser = (_id: string) => {
    refreshData();
  };

  const addSupply = (supply: Supply) => {
    api.saveSupply(supply).then(() => refreshData()).catch(console.error);
  };

  const deleteSupply = (id: number) => {
    api.deleteSupply(id).then(() => refreshData()).catch(console.error);
  };

  return (
    <DatabaseContext.Provider value={{
      products,
      orders,
      addresses,
      users,
      articles,
      heroSlides,
      supplies,
      loading,
      backendAvailable,
      dataSource: 'api',
      addProduct,
      deleteProduct,
      addAddress,
      removeAddress,
      createOrder,
      updateOrder,
      deleteOrder,
      updateOrderPaymentStatus,
      addArticle,
      deleteArticle,
      saveHeroSlide,
      deleteHeroSlide,
      updateUser,
      deleteUser,
      addSupply,
      deleteSupply,
      refreshData
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};
