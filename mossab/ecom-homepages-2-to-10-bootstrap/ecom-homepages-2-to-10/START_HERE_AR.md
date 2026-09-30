# صفحات Ecom الرئيسية 2 إلى 10

هذا المشروع يحتوي على الأكواد الكاملة للصفحات التسع: HTML مستقل لكل صفحة، Bootstrap 5.3.3، وCSS وJavaScript مشتركين. لا يحتاج React أو npm أو قاعدة بيانات حتى تشغّلوه.

## تشغيل المشروع

1. فك ضغط الملف كاملاً، ولا تفتح الملفات مباشرة من داخل ZIP.
2. افتح مجلد `ecom-homepages-2-to-10` في VS Code بواسطة File → Open Folder.
3. افتح `index.html` بواسطة Live Server. هذه صفحة اختيار، وليست Homepage 1.
4. اختر الصفحة المطلوبة من القائمة. ملفات الموقع الفعلية هي `index-2.html` حتى `index-10.html`.
5. خليك متصل بالإنترنت: الصور والخطوط تأتي من روابطها الأصلية. Bootstrap موجود محلياً داخل المشروع.

## توزيع الفريق بحسب ملفكم

| الصفحة | مصعب — Mossab | ضياء — Diyaa | منتصر — Montaser | جان — Jan |
| --- | --- | --- | --- | --- |
| 2 | Header / Hero → Featured Categories → Flash Deals | Trending Products | LIMITED WEEKLY DEAL → Top Selling Products → Top Brands | Best seller / Featured products / Most viewed / Trending → News → Footer |
| 3 | Header / Hero / Benefits / Banners → SHOCKING DEAL | Trending Products → Refrigerators & Freezers الأولى | Kitchen Appliances → Refrigerators & Freezers الثانية → Promotions | News → Subscription → Footer |
| 4 | Header / Categories / أول مجموعة منتجات → قبل Trending Products | Trending Products → Top Rate Products | Best seller → New Products → Top Selling Products | News → Benefits → Subscription → Footer |
| 5 | Header / Hero / Benefits → Most Popular Categories | مجموعات المنتجات والإعلانات حتى قبل Trending This Week | Trending This Week → Best seller → Trending Products | News → Benefits → Subscription → Footer |
| 6 | Header / Hero / Benefits → Most Popular Categories | Weekly selection الأولى والبنرات التالية | Weekly selection الثانية والبنرات التالية | News → Benefits → Subscription → Footer |
| 7 | Header / Hero → Most Popular Categories → SHOCKING DEAL | Promotional banners → Milk Powders | Kids Toys → Kid Fashion | News → Benefits → Subscription → Footer |
| 8 | Header / Book banners → Latest Deals | Best Book Colletion → Picked By Ecom | Top Selling Books → Exclusive Offers → History Books | Best seller / Featured products / Most viewed / Trending → News → Footer |
| 9 | Header → New arrivals → Best selling → Hot Deals → Top Ranking → Dropshipping → Upcoming deals | Computers Accessories → Home Application | Furniture & Decor → Tools, Equipment → Best seller → Featured products | Most viewed → Trending → News → Footer |

الصفحة 10: الـPDF يقول إن الأقسام لم تكن مؤكدة، ولا يتضمن توزيعاً. تم فحص الرابط الأصلي، وأُضيفت الصفحة. التوزيع التالي **مقترح فقط**: مصعب للهيدر والفئات والبنرات الرئيسية؛ ضياء لـFeatured Products وبنرات العروض؛ منتصر لـPlant pots وPlant tools والبنر التالي؛ جان للأخبار والمزايا والاشتراك والفوتر. التعليقات داخل الصفحة العاشرة توضح أن هذا مقترح.

## كيف تلاقوا قسم كل عضو؟

كل قسم يبدأ بتعليق إنجليزي، مثال:

```html
<!-- START DIYAA | Homepage 6 | Weekly selection -->
```

وينتهي بتعليق `END`. ابحثوا بـCtrl+F عن `MOSSAB` أو `DIYAA` أو `MONTASER` أو `JAN`. بعض الصفحات فيها أعمدة لأعضاء مختلفين داخل صف Bootstrap مشترك؛ التعليق الموجود فوق العمود يحدد صاحبه.

## شرح مختصر لكل خطوة

1. **HTML:** `header` للهيدر، `main` لمحتوى الصفحة، و`section` لكل مجموعة. كل منتج مكتوب داخل `article`، فبتقدروا تغيروا عنوانه وصورته بسهولة.
2. **Bootstrap:** `container` يحدد عرض المحتوى؛ `row` يصنع صفاً؛ `col` و`col-md-6` و`col-xl-3` تقسم الأعمدة حسب عرض الشاشة. `g-3` و`g-4` تضيف مسافات بين الأعمدة.
3. **CSS:** ابحثوا عن التعليقات الإنجليزية. التنسيقات المشتركة أولاً، ثم تنسيقات الصفحات مثل `.home-6`. CSS يضبط ألوان Ecom وحجم الصور والخطوط والبنرات؛ تقسيم الأعمدة الأساسي من Bootstrap.
4. **صور:** كل `src` وكل صورة خلفية تحتوي رابط الموقع الأصلي كاملاً وباسم الملف الأصلي. لا توجد صور محلية بأسماء بديلة. ملف `IMAGE_LINKS.txt` يجمع الروابط لتقدروا تنسخوها.
5. **JavaScript:** `querySelector` يختار عنصراً؛ `addEventListener` ينتظر الضغطة؛ `dataset.name` و`dataset.price` يقرآن بيانات المنتج من HTML. المتغير `cart` هو Array، و`push` يضيف منتجاً، و`splice` يحذفه.
6. **حفظ مؤقت:** `sessionStorage` يحفظ السلة والمفضلة خلال جلسة المتصفح. `JSON.stringify` يحول Array لنص، و`JSON.parse` يرجعه Array. لا يوجد سيرفر أو حساب مستخدم.
7. **Bootstrap JavaScript:** الملف `bootstrap.bundle.min.js` يشغّل القائمة والتبويبات والسلايدر والـModal والسلة الجانبية. لذلك مكتوب قبل `script.js` بنهاية HTML.

## ما الذي يعمل؟

- قائمة Home للتنقل بين الصفحات التسع، وقائمة موبايل قابلة للفتح والإغلاق.
- تبويبات المنتجات، وسلايدر البنرات في الصفحات التي تحتويه.
- إضافة للسلة، زيادة الكمية عند تكرار المنتج، حذف المنتج، الإجمالي وتصفير السلة.
- المفضلة وعدّادها، فلترة المنتجات المحفوظة، والبحث في الصفحة المفتوحة.
- نموذج الاشتراك يتحقق من البريد ويعرض رسالة فقط؛ لا يرسل بريداً فعلياً.
- زر الأخبار يفتح معاينة عنوان داخل Modal؛ صفحات المقالات ليست ضمن هذا التاسك.
- زر الرجوع للأعلى.

## طريقة التعاون على GitHub

اشتغلوا بصفحة واحدة كل مرة مثل اتفاقكم. كل شخص يعدّل أقسامه، ويكتب اسم الصفحة والقسم في رسالة commit. ملفات `style.css` و`script.js` مشتركة: اتفقوا قبل تعديل نفس المنطقة فيها، واعملوا Pull قبل Push. لا تستبدلوا الملف المشترك بنسخة قديمة.

## ملاحظات عن المطابقة والتحقق

هذه إعادة بناء تعليمية بمستوى HTML وBootstrap وCSS وJavaScript. الأقسام الأساسية والنصوص وصور المنتجات المرجعية موجودة، لكن توزيع بعض السلايدرات والبنرات والقوائم الثانوية مبسّط؛ لا تعتبروا النسخة مطابقة بالبكسل للموقع الأصلي. قارنوها معه على نفس عرض الشاشة قبل التسليم النهائي واضبطوا المسافات والمقاسات المطلوبة مع الأستاذ.

وجدت صورة واحدة في المرجع ترجع 404: `homepage1/imgsp8.png` بالصفحة الثالثة. استُخدمت صورة `homepage1/screen.png` الموجودة في نفس الموقع لمنتج iMac بدلاً منها. بقية روابط الصور المستخدمة تحققت منها أثناء العمل.

تم فحص الصفحات على عرض 1440 و390 بكسل، وفحص البحث والسلة والمفضلة والاشتراك. الصور تعتمد على الموقع الخارجي؛ إذا تغيّر رابط أو توقف الموقع لن تظهر الصورة.

## ملف الأكواد المجمّع

`ECOM_HOMEPAGES_2_TO_10_FULL_SOURCE.txt` يجمع الأكواد لتسهيل النسخ والقراءة. كل جزء يبدأ باسم ملفه. لا تلصق كل المحتوى في `index.html` واحد؛ انسخ جزء كل ملف إلى الملف الموافق، أو استخدم ملفات المشروع الجاهزة داخل ZIP.
