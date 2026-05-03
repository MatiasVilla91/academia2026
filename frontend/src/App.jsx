import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
