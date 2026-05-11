import { HelmetProvider } from 'react-helmet-async';
import { useRouter } from 'next/router';
import { UserListsProvider } from '../src/context/UserListsContext';
import '../src/index.css';
import '../src/App.css';
import '../src/Utility/Loader.css';
import '../src/Utility/Navbar.css';
import Navbar from '../src/Utility/Navbar';
import Footer from '../src/Utility/Footer';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const hideLayoutOnHome = router.pathname === '/';

  return (
    <HelmetProvider>
      <UserListsProvider>
        {!hideLayoutOnHome && <Navbar />}
        <Component {...pageProps} />
        {!hideLayoutOnHome && <Footer />}
      </UserListsProvider>
    </HelmetProvider>
  );
}

export default MyApp;
