// App.js
import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Homepage from './Pages/Homepage';
import MoviesPagde from './Pages/Movies/MoviesPage';
import MoviePage from './Pages/Movies/MoviePage';
import TvShowsPage from './Pages/TvShows/TvShowsPage';
import TvPage from './Pages/TvShows/TvPage';
import CategoryPage from './Pages/CategoryPage';
import SearchPage from './Pages/SearchPage';
import Navbar from './Utility/Navbar';
import TvCategoryPage from './Pages/TvShows/hooks/TvCategoryPage';
import Footer from './Utility/Footer';
import ScrollToTop from './Utility/ScrollToTop';
import Loader from './Utility/Loader';
import { UserListsProvider } from './context/UserListsContext';
import { WatchLaterPage, FavoritesPage, CurrentlyWatchingPage } from './context/Userpages';

import './App.css';

function Layout() {
  const location = useLocation();
  const hideLayoutOnHome = location.pathname === '/';

  return (
    <>
      {!hideLayoutOnHome && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/tv/:id" element={<TvPage />} />
        <Route path="/tvshows" element={<TvShowsPage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/moviespagde" element={<MoviesPagde />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/tv-category/:categoryName" element={<TvCategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/watch-later" element={<WatchLaterPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/currently-watching" element={<CurrentlyWatchingPage />} />
      </Routes>
      {!hideLayoutOnHome && <Footer />}
    </>
  );
}

function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleDone = () => {
    setContentVisible(true);                          // المحتوى يبدأ يظهر
    setTimeout(() => setLoaderDone(true), 1200);      // اللودر يتشال بعد انتهاء الـ transition
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        opacity: contentVisible ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }}>
        <HelmetProvider>
          <UserListsProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Layout />
            </BrowserRouter>
          </UserListsProvider>
        </HelmetProvider>
      </div>

      {/* اللودر فوق المحتوى - بيختفي بـ fade */}
      {!loaderDone && <Loader onDone={handleDone} />}

    </div>
  );
}

export default App;