// App.js
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleDone = () => {
    setContentVisible(true);                          // المحتوى يبدأ يظهر
    setTimeout(() => setLoaderDone(true), 1200);      // اللودر يتشال بعد انتهاء الـ transition
  };

  return (
    <div style={{ position: 'relative' }}>

      {/* المحتوى موجود في الخلفية من الأول */}
      <div style={{
        opacity: contentVisible ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }}>
        <HelmetProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/tv/:id" element={<TvPage />} />
              <Route path="/tvshows" element={<TvShowsPage />} />
              <Route path="/movie/:id" element={<MoviePage />} />
              <Route path="/moviespagde" element={<MoviesPagde />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/tv-category/:categoryName" element={<TvCategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </HelmetProvider>
      </div>

      {/* اللودر فوق المحتوى - بيختفي بـ fade */}
      {!loaderDone && <Loader onDone={handleDone} />}

    </div>
  );
}

export default App;