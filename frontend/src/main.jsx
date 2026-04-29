import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LangProvider } from './i18n/LangProvider';
import App from './App';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import CategoryPage from './pages/CategoryPage';
import NotFound from './pages/NotFound';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="curso/:slug" element={<CourseDetail />} />
              <Route path="categoria/:category" element={<CategoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </HelmetProvider>
  </React.StrictMode>
);
