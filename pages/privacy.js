import Head from 'next/head';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>سياسة الخصوصية | VELORA</title>
        <meta
          name="description"
          content="سياسة خصوصية VELORA توضح كيفية جمع المعلومات وحمايتها واستخدامها داخل المنصة." />
      </Head>
      <main className="min-h-screen bg-[#060606] text-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <p className="text-sm uppercase text-[#e50914] font-semibold tracking-[0.25em]">سياسة الخصوصية</p>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">خصوصيتك مهمة بالنسبة لنا</h1>
            <p className="mt-6 leading-8 text-gray-300">
              في VELORA نلتزم بحماية معلوماتك الشخصية واستخدامها بطريقة آمنة وواضحة. هذه السياسة توضح كيف نجمّع البيانات وكيف نتعامل معها.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">المعلومات التي نجمعها</h2>
            <ul className="mt-6 list-disc space-y-4 pr-5 text-gray-300">
              <li>معلومات تقنية عامة مثل نوع المتصفح، عنوان IP، وصلاحية الجلسة.</li>
              <li>بيانات الاستخدام الداخلية لتحسين تجربة البحث والمحتوى.</li>
              <li>معلومات تُرسلها لنا عند التواصل عبر البريد الإلكتروني.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">كيف نستخدم البيانات</h2>
            <div className="mt-6 space-y-4 text-gray-300 leading-8">
              <p>نستخدم المعلومات لتحسين أداء المنصة، وتقديم تجربة تصفح أسرع، ومتابعة الأخطاء التقنية.</p>
              <p>لا نبيع بيانات المستخدمين لأي طرف ثالث، ولا نشارك معلومات حساسة إلا إذا تطلبها القوانين أو الجهات المختصة.</p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">الكوكيز والتخزين المحلي</h2>
            <p className="mt-6 text-gray-300 leading-8">
              قد نستخدم ملفات تعريف الارتباط (cookies) وأدوات مماثلة لتخزين تفضيلاتك وتحسين تجربة التصفح، لكننا لا نجمع معلومات شخصية إلا بموافقتك الصريحة.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">حقوقك</h2>
            <p className="mt-6 text-gray-300 leading-8">
              يحق لك طلب حذف البيانات أو تعديلها، ويمكنك التواصل معنا عبر البريد الإلكتروني التالي:
            </p>
            <p className="mt-4 text-[#e50914]">support@veloravelora.online</p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">التعديلات على السياسة</h2>
            <p className="mt-6 text-gray-300 leading-8">
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. التعديلات ستصبح سارية بمجرد نشرها على هذه الصفحة.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
