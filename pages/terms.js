import Head from 'next/head';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>الشروط والأحكام | VELORA</title>
        <meta
          name="description"
          content="الشروط والأحكام الخاصة بمنصة VELORA للمشاهدة عبر الإنترنت. تشمل قواعد الاستخدام والتزامات المستخدم." />
      </Head>
      <main className="min-h-screen bg-[#060606] text-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <p className="text-sm uppercase text-[#e50914] font-semibold tracking-[0.25em]">الشروط والأحكام</p>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">شروط استخدام منصة VELORA</h1>
            <p className="mt-6 leading-8 text-gray-300">
              باستخدامك VELORA، فإنك توافق على شروط الاستخدام التالية. الرجاء قراءتها بعناية قبل استخدام الموقع.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">استخدام المنصة</h2>
            <p className="mt-6 text-gray-300 leading-8">
              VELORA تقدم محتوى مرئيًا للمساعدة على الوصول إلى الأفلام والمسلسلات. المنصة لا تتحمل مسؤولية أي محتوى خارجي أو روابط تابعة لطرف ثالث.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">المسؤولية</h2>
            <p className="mt-6 text-gray-300 leading-8">
              VELORA غير مسؤولة عن أي ضرر مباشر أو غير مباشر أو خسارة تنشأ عن استخدام الموقع. جميع المعلومات الواردة هي لأغراض إعلامية وتجريبية فقط.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">حقوق الملكية</h2>
            <p className="mt-6 text-gray-300 leading-8">
              جميع العلامات التجارية وحقوق المحتوى تنتمي إلى أصحابها الأصليين. VELORA لا تدعي ملكية أي محتوى تابع لجهة ثالثة.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">التعديلات</h2>
            <p className="mt-6 text-gray-300 leading-8">
              تحتفظ VELORA بحق تعديل هذه الشروط في أي وقت. الاستمرار في استخدام الموقع بعد التعديلات يعني قبولك لها.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">
            <h2 className="text-2xl font-semibold">القانون الواجب التطبيق</h2>
            <p className="mt-6 text-gray-300 leading-8">
              تخضع هذه الشروط للقوانين المعمول بها في جمهورية مصر العربية، وأي نزاع سيتم حله أمام الجهات القضائية المختصة.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
