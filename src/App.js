// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Homepage from './Pages/Homepage';
import MoviesPagde from './Pages/Movies/MoviesPage';
import MoviePage from './Pages/Movies/MoviePage';
import TvShowsPage from './Pages/TvShows/TvShowsPage';
import TvPage from './Pages/TvShows/TvPage';
import CategoryPage from './Pages/CategoryPage';
import SearchPage from './Pages/SearchPage';
import './App.css';
import Navbar from './Utility/Navbar';
import TvCategoryPage from './Pages/TvShows/TvCategoryPage';
import Footer from './Utility/Footer';
import ScrollToTop from './Utility/ScrollToTop';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop /> {/* أضف هذا المكون هنا */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* مسلسلات - الأكثر تحديداً أولاً */}
          <Route path="/tv/:id" element={<TvPage />} />
          <Route path="/tvshows" element={<TvShowsPage />} />
          {/* أفلام */}
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/moviespagde" element={<MoviesPagde />} />
          {/* صفحات عامة */}
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/tv-category/:categoryName" element={<TvCategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;