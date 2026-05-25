import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ModelListPage } from './pages/ModelListPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BrandsPage } from './pages/BrandsPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Catalog Public Routes
import { CatalogLayout } from './layouts/CatalogLayout';
import { CatalogHomePage } from './pages/catalog/CatalogHomePage';
import { CatalogBrandsPage } from './pages/catalog/CatalogBrandsPage';
import { CatalogModelsPage } from './pages/catalog/CatalogModelsPage';
import { CatalogAllCategoriesPage } from './pages/catalog/CatalogAllCategoriesPage';
import { CatalogAllBrandsPage } from './pages/catalog/CatalogAllBrandsPage';
import { CatalogAllModelsPage } from './pages/catalog/CatalogAllModelsPage';
// import { CatalogPlaceholderPage } from './pages/catalog/CatalogPlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching when switching back to browser tab
      staleTime: 5 * 60 * 1000,     // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000,       // Keep cache in memory for 10 minutes
      retry: 1,                     // Retry failed requests once
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<LandingPage />} />

              {/* Public Catalog Routes (Now at Root) */}
              <Route path="/" element={<CatalogLayout />}>
                <Route index element={<CatalogHomePage />} />
                <Route path="categories" element={<CatalogAllCategoriesPage />} />
                <Route path="brands" element={<CatalogAllBrandsPage />} />
                <Route path="models" element={<CatalogAllModelsPage />} />
                <Route path="category/:categoryId/brands" element={<CatalogBrandsPage />} />
                <Route path="category/:categoryId/brand/:brandId/models" element={<CatalogModelsPage />} />
                <Route path="brand/:brandId/models" element={<CatalogModelsPage />} />

                {/* Secondary Sidebar Route Placeholders */}
                {/* <Route path="updates" element={<CatalogPlaceholderPage title="Recent Updates Feed" description="Stay tuned! The live feed of compatibility additions and database updates is being prepared for public access." />} />
                <Route path="compare" element={<CatalogPlaceholderPage title="Device Compatibility Compare" description="Our comparison engine is getting a visual upgrade. You will soon be able to compare connectors, frames, and parts side-by-side." />} />
                <Route path="favorites" element={<CatalogPlaceholderPage title="My Saved Favorites" description="Save your frequently searched models. This feature is coming soon to public dashboards using local device storage." />} />
                <Route path="support" element={<CatalogPlaceholderPage title="Technician Support Desk" description="Need assistance? Our community forum and direct WhatsApp support channel is available under the Join Community button on the sidebar." />} /> */}
              </Route>
              {/* Authenticated user routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="models" element={<ModelListPage />} />
                  <Route path="brands" element={<BrandsPage />} />
                  <Route path="search" element={<SearchPage />} />

                  {/* Admin restricted routes */}
                  <Route element={<ProtectedRoute allowedRoles={['Super Admin', 'Admin']} />}>
                    <Route path="admin" element={<AdminDashboardPage />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
