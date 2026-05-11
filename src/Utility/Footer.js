// components/Footer.jsx
import React from 'react';
import { useNavigate } from '../next-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'استكشف': [
      { name: 'الرئيسية', path: '/' },
      { name: 'أفلام', path: '/moviespagde' },
      { name: 'مسلسلات', path: '/tvshows' },
      { name: 'الأحدث', path: '/latest' },
    ],
    'أقسام الأفلام': [
      { name: 'أكشن', category: 'action', type: 'movie' },
      { name: 'كوميدي', category: 'comedy', type: 'movie' },
      { name: 'رعب', category: 'horror', type: 'movie' },
      { name: 'رومانسي', category: 'romance', type: 'movie' },
      { name: 'كرتون', category: 'animation', type: 'movie' },
    ],
    'أقسام المسلسلات': [
      { name: 'أكشن', category: 'actionTV', type: 'tv' },
      { name: 'كوميدي', category: 'comedyTV', type: 'tv' },
      { name: 'دراما', category: 'dramaTV', type: 'tv' },
      { name: 'خيال علمي', category: 'scifiTV', type: 'tv' },
      { name: 'عربية', category: 'arabicTV', type: 'tv' },
    ],
   
  };

 

  const handleCategoryClick = (category, type) => {
    // هاي تحتاج للتعديل حسب الـ URLs عندك
    const categoryUrls = {
      // أفلام
      action: '/discover/movie?with_genres=28',
      comedy: '/discover/movie?with_genres=35',
      horror: '/discover/movie?with_genres=27',
      romance: '/discover/movie?with_genres=10749',
      animation: '/discover/movie?with_genres=16',
      // مسلسلات
      actionTV: '/discover/tv?with_genres=10759',
      comedyTV: '/discover/tv?with_genres=35',
      dramaTV: '/discover/tv?with_genres=18',
      scifiTV: '/discover/tv?with_genres=10765',
      arabicTV: '/discover/tv?with_original_language=ar',
    };

    const url = categoryUrls[category];
    if (url) {
      const encodedTitle = encodeURIComponent(category);
      const encodedUrl = encodeURIComponent(url);
      navigate(`/category/${encodedTitle}?url=${encodedUrl}&type=${type}`);
    }
  };

  return (
   <footer className="bg-gradient-to-b from-[#141414] to-black text-gray-400 border-t border-gray-800/50">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    
    {/* Links Flex */}
    <div className="flex flex-wrap justify-between gap-8 mb-8">
      {Object.entries(footerLinks).map(([section, links]) => (
        <div key={section} className="text-right flex-1 min-w-[150px]">
          <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
            {section}
            <span className="absolute -bottom-1 right-0 w-8 h-0.5 bg-[#e50914] rounded-full"></span>
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.name}>
                {link.path ? (
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm hover:text-[#e50914] transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                ) : (
                  <button
                    onClick={() => handleCategoryClick(link.category, link.type)}
                    className="text-sm hover:text-[#e50914] transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Copyright */}
    <div className="text-center pt-6 border-t border-gray-800/50">
      <p className="text-xs text-gray-500 mb-2">
        © {currentYear} VELORA. جميع الحقوق محفوظة.
      </p>
      <p className="text-[10px] text-gray-600">
        VELORA هي منصة لمشاهدة الأفلام والمسلسلات عبر الإنترنت
      </p>
    </div>
  </div>

  {/* Netflix-style red gradient line at top */}
  <div className="h-0.5 bg-gradient-to-r from-transparent via-[#e50914] to-transparent opacity-50"></div>
</footer>
  );
};

export default Footer;