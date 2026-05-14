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
  if (user?.role === 'admin') return <AdminDashboard />;
  return user?.role === 'farmer' ? <Dashboard /> : <BuyerProfile />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
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
