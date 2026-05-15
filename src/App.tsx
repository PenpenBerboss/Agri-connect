import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { BuyerProfile } from './pages/Dashboard/BuyerProfile';
import { MapView } from './pages/Map/MapView';
import { Favorites } from './pages/Favorites';
import { Cart } from './pages/Cart';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';
import { SellerProfile } from './pages/SellerProfile';
import { ReportsTab } from './pages/Dashboard/ReportsTab';
import { OrderDetails } from './pages/Dashboard/OrderDetails';
import { Toaster } from 'react-hot-toast';
import { useStore } from './application/store/useStore';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { isAuthenticated, user } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const DashboardContainer = () => {
  const { user } = useStore();
  if (user?.role === 'admin' || user?.role === 'farmer') return <Dashboard />;
  return <BuyerProfile />;
};

export default function App() {
  const { checkAuth, fetchProducts, fetchOrders } = useStore();

  React.useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="seller/:id" element={<SellerProfile />} />
          <Route path="map" element={<MapView />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="cart" element={<Cart />} />
          
          {/* Auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Dashboard */}
          <Route path="dashboard/*" element={
            <ProtectedRoute>
              <DashboardContainer />
            </ProtectedRoute>
          } />
          
          <Route path="orders/:id" element={
            <ProtectedRoute>
               <OrderDetails />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
