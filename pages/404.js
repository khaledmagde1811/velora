import Head from 'next/head';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>صفحة غير موجودة - VELORA</title>
        <meta name="description" content="الصفحة التي تبحث عنها غير موجودة. عُد إلى الصفحة الرئيسية لـ VELORA لمشاهدة أفلام ومسلسلات أون لاين." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="author" content="VELORA" />
        <link rel="canonical" href="https://www.veloravelora.online/404" />
        <meta property="og:title" content="صفحة غير موجودة - VELORA" />
        <meta property="og:description" content="الصفحة التي تبحث عنها غير موجودة. عُد إلى الصفحة الرئيسية لـ VELORA." />
        <meta property="og:url" content="https://www.veloravelora.online/404" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VELORA" />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="صفحة غير موجودة - VELORA" />
        <meta name="twitter:description" content="الصفحة التي تبحث عنها غير موجودة. عُد إلى الصفحة الرئيسية لـ VELORA." />
      </Head>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-6">الصفحة غير موجودة</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم حذفها. يرجى العودة إلى الصفحة الرئيسية.
          </p>
          <Link
            href="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </>
  );
};

export default Custom404;