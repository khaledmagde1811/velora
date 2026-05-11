import Head from 'next/head';

const SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VELORA",
  "url": "https://veloravelora.online",
  "description": "منصة عربية لمشاهدة الأفلام والمسلسلات أونلاين بجودة عالية وتجربة سينمائية متميزة",
  "email": "support@veloravelora.online",
  "sameAs": ["https://instagram.com/veloravelora"],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@veloravelora.online",
    "contactType": "customer support",
    "availableLanguage": "Arabic"
  }
});

const values = [
  {
    title: "سهولة الوصول",
    body: "مشاهدة المحتوى بدون تسجيل مع تجربة تصفح بسيطة وسريعة من أي جهاز.",
    number: "01",
  },
  {
    title: "تنوع المحتوى",
    body: "تصنيفات حديثة تشمل أفلاماً ومسلسلات عربية وعالمية تتجدد باستمرار.",
    number: "02",
  },
  {
    title: "تجربة سينمائية",
    body: "واجهة مظلمة وعصرية مصممة لتقليل الإلهاء وتعظيم لحظة المشاهدة.",
    number: "03",
  },
  {
    title: "خصوصية المستخدم",
    body: "حماية بيانات المستخدمين وسياسة شفافة واضحة بدون مفاجآت.",
    number: "04",
  },
];

const contacts = [
  { label: "البريد الإلكتروني", value: "support@veloravelora.online", href: "mailto:support@veloravelora.online" },
  { label: "الدعم الفني", value: "info@veloravelora.online", href: "mailto:info@veloravelora.online" },
  { label: "إنستجرام", value: "@veloravelora", href: "https://instagram.com/veloravelora" },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>عن VELORA — منصة مشاهدة الأفلام والمسلسلات أونلاين</title>
        <meta
          name="description"
          content="VELORA منصة عربية لمشاهدة الأفلام والمسلسلات أونلاين. تعرّف على هويتنا ورسالتنا وقيمنا في تقديم تجربة سينمائية سهلة ومتميزة."
        />
        <meta name="keywords" content="VELORA, أفلام أونلاين, مسلسلات, مشاهدة أفلام, بث مباشر, عربي" />
        <meta property="og:title" content="عن VELORA — منصة مشاهدة الأفلام والمسلسلات" />
        <meta property="og:description" content="منصة عربية لمشاهدة الأفلام والمسلسلات بجودة عالية وتجربة سينمائية متميزة." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veloravelora.online/about" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="عن VELORA" />
        <meta name="twitter:description" content="تعرّف على VELORA ورسالتنا في تقديم تجربة مشاهدة عربية متميزة." />
        <link rel="canonical" href="https://veloravelora.online/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SCHEMA }}
        />
      </Head>

      <main
        className="min-h-screen bg-[#060606] text-white"
        dir="rtl"
        lang="ar"
        aria-label="صفحة عن VELORA"
      >
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/5 px-6 py-24 sm:px-12 lg:px-20 mt-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(229,9,20,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e50914]">
              عن المنصة
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              VELORA
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
              منصة عربية صُمِّمت لتجربة مشاهدة خفيفة وسريعة. مكتبة واسعة من المحتوى العالمي والعربي مع واجهة تضع المستخدم أولاً دائماً.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-px px-6 py-16 sm:px-12 lg:px-20">

          {/* Mission */}
          <section
            aria-labelledby="mission-heading"
            className="rounded-2xl border border-white/5 bg-[#0e0e0e] p-8 sm:p-10"
          >
            <h2
              id="mission-heading"
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e50914]"
            >
              رسالتنا
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/65">
              VELORA ليست مجرد موقع روابط. نحن نؤمن أن الوصول إلى المحتوى يجب أن يكون سلساً وبديهياً بدون حواجز أو تعقيدات. نحدّث مكتبتنا بانتظام ونضمن أن تجد دائماً ما تبحث عنه في أقل عدد ممكن من الخطوات.
            </p>
          </section>

          {/* Values */}
          <section
            aria-labelledby="values-heading"
            className="rounded-2xl border border-white/5 bg-[#0e0e0e] p-8 sm:p-10"
          >
            <h2
              id="values-heading"
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e50914]"
            >
              قيمنا
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {values.map((item) => (
                <article
                  key={item.number}
                  className="group relative rounded-xl border border-white/5 bg-[#141414] p-6 transition-colors hover:border-white/10"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-6 font-mono text-4xl font-bold text-white/5 select-none"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {item.number}
                  </span>
                  <h3 className="relative text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-7 text-white/55">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Distinction */}
          <section
            aria-labelledby="distinction-heading"
            className="rounded-2xl border border-white/5 bg-[#0e0e0e] p-8 sm:p-10"
          >
            <h2
              id="distinction-heading"
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e50914]"
            >
              ما الذي يميزنا
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-8 text-white/60">
              <p>
                تركّز VELORA على الفلاتر الواضحة والأقسام المنظّمة التي تجعل الوصول إلى الأفلام والمسلسلات فورياً. لا واجهات مربكة، لا خطوات زائدة.
              </p>
              <p>
                نحرص على إضافة أحدث الإصدارات والتوصيات أولاً بأول، لتبقى دائماً على اطلاع بأفضل ما يقدمه عالم الترفيه.
              </p>
              <p className="text-white/40">
                VELORA ليست مزوداً رسمياً لخدمة البث، بل منصة تجمع روابط العرض لتسهيل الوصول السريع إلى المحتوى.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section
            aria-labelledby="contact-heading"
            className="rounded-2xl border border-white/5 bg-[#0e0e0e] p-8 sm:p-10"
          >
            <h2
              id="contact-heading"
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e50914]"
            >
              تواصل معنا
            </h2>
            <p className="mt-4 text-sm text-white/50">
              فريق VELORA متاح للإجابة على أي سؤال أو اقتراح.
            </p>
            <dl className="mt-6 divide-y divide-white/5">
              {contacts.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center justify-between py-4"
                >
                  <dt className="text-sm text-white/40">{c.label}</dt>
                  <dd>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm font-medium text-[#e50914] transition-opacity hover:opacity-75"
                    >
                      {c.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

        </div>
      </main>
    </>
  );
}