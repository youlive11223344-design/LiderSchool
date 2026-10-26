(function () {
  const D = { uz: {}, ru: {}, en: {} };
  const K = (k, u, r, e) => { D.uz[k] = u; D.ru[k] = r; D.en[k] = e; };

  /* ================= UMUMIY ================= */
  K('nav.news', 'Yangiliklar', 'Новости', 'News');
  K('nav.loc', 'Manzil', 'Адрес', 'Location');
  K('nav.gal', 'Galereya', 'Галерея', 'Gallery');
  K('nav.campus', 'Kampus', 'Кампус', 'Campus');
  K('nav.team', 'Jamoa', 'Команда', 'Team');
  K('nav.video', 'Video', 'Видео', 'Videos');
  K('nav.admission', 'Qabul', 'Приём', 'Admission');
  K('nav.login', 'Kirish', 'Войти', 'Log in');
  K('aria.theme', 'Tun/Kun rejimi', 'Тёмная/светлая тема', 'Dark/light mode');
  K('aria.menu', 'Menyu', 'Меню', 'Menu');
  K('aria.lang', 'Til', 'Язык', 'Language');
  K('aria.close', 'Yopish', 'Закрыть', 'Close');
  K('aria.show', 'Parolni ko‘rsatish', 'Показать пароль', 'Show password');
  K('aria.hide', 'Parolni yashirish', 'Скрыть пароль', 'Hide password');
  K('th.light', 'Kunduzgi rejim', 'Дневной режим', 'Light mode');
  K('th.dark', 'Tungi rejim', 'Ночной режим', 'Dark mode');
  K('e.generic', 'Xatolik: ', 'Ошибка: ', 'Error: ');

  K('title.index', 'Lider xususiy maktabi', 'Частная школа «Лидер»', 'Lider Private School');
  K('title.login', 'Kirish — Lider xususiy maktabi', 'Вход — Частная школа «Лидер»', 'Log in — Lider Private School');
  K('title.profile', 'Profilim — Lider xususiy maktabi', 'Мой профиль — Частная школа «Лидер»', 'My profile — Lider Private School');
  K('brand', 'Lider xususiy maktabi', 'Частная школа «Лидер»', 'Lider Private School');
  K('foot', 'Barcha huquqlar himoyalangan', 'Все права защищены', 'All rights reserved');

  /* ================= BOSH SAHIFA ================= */
  K('hero.pre', 'Bugun o‘qigan bola, ertaga', 'Кто учится сегодня, тот завтра', 'The child who learns today will');
  K('hero.words',
    ['yetakchi bo‘ladi', 'olim bo‘ladi', 'kashfiyotchi bo‘ladi', 'jasur bo‘ladi'],
    ['будет лидером', 'будет учёным', 'будет первооткрывателем', 'будет смелым'],
    ['become a leader', 'become a scientist', 'become a pioneer', 'become fearless']);
  K('hero.p',
    'Lider xususiy maktabi — chuqur bilim, kuchli xarakter va dunyoga ochiq fikrlash. Kichik sinflar, har bir o‘quvchiga alohida e’tibor.',
    'Частная школа «Лидер» — глубокие знания, сильный характер и открытое мышление. Небольшие классы и индивидуальное внимание к каждому ученику.',
    'Lider Private School: deep knowledge, strong character and an open view of the world. Small classes and individual attention for every student.');
  K('hero.cta1', 'Qabulga ariza', 'Подать заявку', 'Apply now');
  K('hero.cta2', 'Kampusni ko‘rish', 'Посмотреть кампус', 'Explore the campus');
  K('stat1', 'yillik tajriba', 'лет опыта', 'years of experience');
  K('stat2', 'o‘quvchi sinfda (o‘rtacha)', 'учеников в классе (в среднем)', 'students per class (average)');
  K('stat3', '% oliygohga kirish', '% поступления в вузы', '% university admission');

  /* ================= YANGILIKLAR ================= */
  K('news.h2', 'Maktab yangiliklari', 'Новости школы', 'School news');
  K('news.lead', 'So‘nggi e’lonlar va voqealar.', 'Последние объявления и события.', 'Latest announcements and events.');
  K('news.more', 'To‘liq o‘qish', 'Читать полностью', 'Read more');
  K('news.less', 'Yopish', 'Свернуть', 'Close');

  /* ================= MANZIL ================= */
  K('loc.h2', 'Bizni toping', 'Как нас найти', 'Find us');
  K('loc.lead',
    'Tugmani bosing — telefoningizdagi xarita ilovasi hozirgi joyingizdan maktabgacha marshrutni o‘zi chizadi.',
    'Нажмите кнопку — карта на вашем телефоне сама построит маршрут от вашего местоположения до школы.',
    'Tap the button and the map app on your phone will plan the route from where you are to the school.');
  K('loc.name', 'Lider xususiy maktabi', 'Частная школа «Лидер»', 'Lider Private School');
  K('loc.addr',
    'FQWC+J3G, Shifokor ko‘chasi, Guliston, Sirdaryo viloyati, O‘zbekiston',
    'FQWC+J3G, улица Шифокор, Гулистан, Сырдарьинская область, Узбекистан',
    'FQWC+J3G, Shifokor Street, Guliston, Sirdaryo Region, Uzbekistan');
  K('loc.g', 'Yo‘nalishni olish (Google Maps)', 'Построить маршрут (Google Maps)', 'Get directions (Google Maps)');
  K('loc.y', 'Yandex Maps orqali ochish', 'Открыть в Яндекс Картах', 'Open in Yandex Maps');
  K('loc.me', 'Mening joyimdan masofa', 'Расстояние от меня', 'Distance from me');
  K('loc.map', 'Maktab xaritasi', 'Карта школы', 'School map');
  K('loc.nogeo', 'Brauzer joylashuvni qo‘llab-quvvatlamaydi.', 'Браузер не поддерживает геолокацию.', 'Your browser does not support geolocation.');
  K('loc.finding', 'Joylashuvingiz aniqlanmoqda…', 'Определяем ваше местоположение…', 'Finding your location…');
  K('loc.dist', 'Maktabgacha taxminan {km} km (to‘g‘ri chiziq bo‘yicha).', 'До школы примерно {km} км (по прямой).', 'About {km} km to the school (in a straight line).');
  K('loc.denied',
    'Ruxsat berilmadi. Brauzer sozlamalarida joylashuvga ruxsat bering.',
    'Доступ не разрешён. Разрешите доступ к геопозиции в настройках браузера.',
    'Permission denied. Allow location access in your browser settings.');

  /* ================= GALEREYA ================= */
  K('gal.h2', 'Maktab hayoti', 'Жизнь школы', 'School life');
  K('gal.lead',
    'Dars, tanaffus va to‘garaklardan lavhalar. Rasmni bosing — kattalashadi.',
    'Кадры с уроков, перемен и кружков. Нажмите на фото, чтобы увеличить.',
    'Moments from lessons, breaks and clubs. Click a photo to enlarge it.');
  K('gal.caps',
    ['Matematika darsi', 'Kimyo laboratoriyasi', 'Kutubxonada', 'Tanaffus', 'Robototexnika to‘garagi', 'Sport zali', 'Tasviriy san’at', 'Bitiruv kuni'],
    ['Урок математики', 'Химическая лаборатория', 'В библиотеке', 'Перемена', 'Кружок робототехники', 'Спортивный зал', 'Изобразительное искусство', 'Выпускной'],
    ['Maths lesson', 'Chemistry lab', 'In the library', 'Break time', 'Robotics club', 'Sports hall', 'Fine arts', 'Graduation day']);

  /* ================= KAMPUS ================= */
  K('campus.h2', 'Virtual kampus', 'Виртуальный кампус', 'Virtual campus');
  K('campus.lead', 'Xonani tanlang va u haqida bilib oling.', 'Выберите помещение и узнайте о нём.', 'Choose a room to learn more about it.');
  K('campus.aria', 'Kampus xaritasi', 'Карта кампуса', 'Campus map');
  K('campus.yard', '— markaziy hovli —', '— центральный двор —', '— central courtyard —');
  K('r.sinf', 'Sinfxonalar', 'Классы', 'Classrooms');
  K('r.lab', 'Laboratoriya', 'Лаборатория', 'Laboratory');
  K('r.kutub', 'Kutubxona', 'Библиотека', 'Library');
  K('r.zal', 'Sport zali', 'Спортзал', 'Sports hall');
  K('r.it', 'IT markazi', 'IT-центр', 'IT center');
  K('r.oshxona', 'Oshxona', 'Столовая', 'Canteen');
  K('rooms',
    {
      sinf: { t: 'Sinfxonalar', d: 'Keng, yorug‘ va zamonaviy jihozlangan sinflar. Har birida 20–25 o‘quvchi.', l: ['Interaktiv doska', 'Kondensioner', 'Ergonomik mebel'] },
      lab: { t: 'Laboratoriyalar', d: 'Fizika, kimyo va biologiya bo‘yicha amaliy mashg‘ulotlar.', l: ['Xavfsiz tajriba stollari', 'Mikroskoplar', 'Elektronika to‘plamlari'] },
      kutub: { t: 'Kutubxona', d: 'Uch tilda kitoblar va tinch o‘qish zonasi.', l: ['O‘zbek, rus, ingliz', 'Elektron katalog', 'Guruh xonasi'] },
      zal: { t: 'Sport zali', d: 'Basketbol, voleybol, gimnastika va suzish tayyorgarligi.', l: ['Professional pol qoplamasi', 'Murabbiylar', 'Suzish havzasi'] },
      it: { t: 'IT markazi', d: 'Dasturlash, robototexnika va 3D modellashtirish.', l: ['Kompyuterlar', '3D printer', 'Robot to‘plamlari'] },
      oshxona: { t: 'Oshxona', d: 'Kunlik issiq, sog‘lom ovqat.', l: ['Haftalik menyu', 'Allergiya hisobga olinadi'] }
    },
    {
      sinf: { t: 'Классы', d: 'Просторные, светлые и современно оборудованные классы. В каждом 20–25 учеников.', l: ['Интерактивная доска', 'Кондиционер', 'Эргономичная мебель'] },
      lab: { t: 'Лаборатории', d: 'Практические занятия по физике, химии и биологии.', l: ['Безопасные лабораторные столы', 'Микроскопы', 'Наборы по электронике'] },
      kutub: { t: 'Библиотека', d: 'Книги на трёх языках и зона тихого чтения.', l: ['Узбекский, русский, английский', 'Электронный каталог', 'Групповая комната'] },
      zal: { t: 'Спортзал', d: 'Баскетбол, волейбол, гимнастика и подготовка к плаванию.', l: ['Профессиональное напольное покрытие', 'Тренеры', 'Бассейн'] },
      it: { t: 'IT-центр', d: 'Программирование, робототехника и 3D-моделирование.', l: ['Компьютеры', '3D-принтер', 'Робототехнические наборы'] },
      oshxona: { t: 'Столовая', d: 'Ежедневное горячее и здоровое питание.', l: ['Недельное меню', 'Учитываются аллергии'] }
    },
    {
      sinf: { t: 'Classrooms', d: 'Spacious, bright and modern classrooms. 20–25 students in each.', l: ['Interactive whiteboard', 'Air conditioning', 'Ergonomic furniture'] },
      lab: { t: 'Laboratories', d: 'Hands-on lessons in physics, chemistry and biology.', l: ['Safe lab benches', 'Microscopes', 'Electronics kits'] },
      kutub: { t: 'Library', d: 'Books in three languages and a quiet reading area.', l: ['Uzbek, Russian, English', 'Electronic catalogue', 'Group study room'] },
      zal: { t: 'Sports hall', d: 'Basketball, volleyball, gymnastics and swimming training.', l: ['Professional flooring', 'Coaches', 'Swimming pool'] },
      it: { t: 'IT center', d: 'Programming, robotics and 3D modelling.', l: ['Computers', '3D printer', 'Robot kits'] },
      oshxona: { t: 'Canteen', d: 'Hot, healthy meals every day.', l: ['Weekly menu', 'Allergies are taken into account'] }
    });

  /* ================= JAMOA ================= */
  K('team.h2', 'Odamlar va loyihalar', 'Люди и проекты', 'People and projects');
  K('tab.team', 'O‘qituvchilar', 'Учителя', 'Teachers');
  K('tab.proj', 'O‘quvchi loyihalari', 'Проекты учеников', 'Student projects');
  K('team.list',
    [
      { r: 'Matematika, 15 yil tajriba', b: 'Olimpiada g‘oliblarini tayyorlaydi.' },
      { r: 'Kimyo', b: 'Kimyo to‘garagi rahbari.' },
      { r: 'Ingliz tili (IELTS 7.5)', b: 'Xalqaro sertifikatlarga tayyorlaydi.' },
      { r: 'Tarix', b: 'Huquq va Tarix fanlari mutaxasisi' }
    ],
    [
      { r: 'Математика, 15 лет опыта', b: 'Готовит победителей олимпиад.' },
      { r: 'Химия', b: 'Руководитель кружка по химии.' },
      { r: 'Английский язык (IELTS 7.5)', b: 'Готовит к международным сертификатам.' },
      { r: 'История', b: 'Специалист по праву и истории.' }
    ],
    [
      { r: 'Mathematics, 15 years of experience', b: 'Prepares Olympiad winners.' },
      { r: 'Chemistry', b: 'Leads the chemistry club.' },
      { r: 'English (IELTS 7.5)', b: 'Prepares students for international certificates.' },
      { r: 'History', b: 'Specialist in law and history.' }
    ]);
  K('proj.list',
    [
      { tag: 'Robototexnika', n: 'Aqlli sug‘orish tizimi', b: '8-sinf o‘quvchilari tomonidan yaratilgan, namlik sensorli qurilma.' },
      { tag: 'Dasturlash', n: 'Maktab ovqat menyu ilovasi', b: 'Telegram bot orqali kunlik menyu va fikr-mulohaza.' },
      { tag: 'Ekologiya', n: 'Plastik o‘rniga mato qoplar', b: '6-sinf eko-klubi loyihasi, shahar yarmarkasida taqdim etilgan.' }
    ],
    [
      { tag: 'Робототехника', n: 'Умная система полива', b: 'Создана учениками 8 класса: устройство с датчиком влажности.' },
      { tag: 'Программирование', n: 'Приложение школьного меню', b: 'Ежедневное меню и отзывы через Telegram-бот.' },
      { tag: 'Экология', n: 'Тканевые сумки вместо пластика', b: 'Проект эко-клуба 6 класса, представлен на городской ярмарке.' }
    ],
    [
      { tag: 'Robotics', n: 'Smart irrigation system', b: 'Built by 8th-grade students: a device with a moisture sensor.' },
      { tag: 'Programming', n: 'School lunch menu app', b: 'Daily menu and feedback through a Telegram bot.' },
      { tag: 'Ecology', n: 'Cloth bags instead of plastic', b: 'Project of the 6th-grade eco club, presented at the city fair.' }
    ]);
  K('tags',
    { Robototexnika: 'Robototexnika', Dasturlash: 'Dasturlash', Ekologiya: 'Ekologiya', 'San’at': 'San’at', Fan: 'Fan', Boshqa: 'Boshqa' },
    { Robototexnika: 'Робототехника', Dasturlash: 'Программирование', Ekologiya: 'Экология', 'San’at': 'Искусство', Fan: 'Наука', Boshqa: 'Другое' },
    { Robototexnika: 'Robotics', Dasturlash: 'Programming', Ekologiya: 'Ecology', 'San’at': 'Art', Fan: 'Science', Boshqa: 'Other' });

  /* ================= VIDEO ================= */
  K('vid.h2', 'Video-taqdimotlar', 'Видеопрезентации', 'Video presentations');
  K('vid.lead', 'Maktab haqida 1–2 daqiqalik videolar.', 'Видеоролики о школе длиной 1–2 минуты.', '1–2 minute videos about the school.');
  K('vid.list',
    [
      { t: 'Maktab bilan tanishuv', d: '1 daqiqada Lider maktabi.' },
      { t: 'Maktabda bir kun', d: 'Ertalabdan kechgacha.' },
      { t: 'Direktor murojaati', d: 'Ta’lim yondashuvimiz haqida.' }
    ],
    [
      { t: 'Знакомство со школой', d: 'Школа «Лидер» за 1 минуту.' },
      { t: 'Один день в школе', d: 'С утра до вечера.' },
      { t: 'Обращение директора', d: 'О нашем подходе к образованию.' }
    ],
    [
      { t: 'Meet the school', d: 'Lider School in 1 minute.' },
      { t: 'A day at school', d: 'From morning till evening.' },
      { t: 'Director’s address', d: 'About our approach to education.' }
    ]);

  /* ================= QABUL ARIZASI ================= */
  K('q.h2', 'Qabulga ariza', 'Заявка на поступление', 'Admission application');
  K('q.lead',
    'Ma’lumotlarni qoldiring, maktab xodimlari siz bilan bog‘lanib, qabul haqida batafsil aytib beradi.',
    'Оставьте данные, и сотрудники школы свяжутся с вами и подробно расскажут о приёме.',
    'Leave your details and our staff will contact you to explain the admission process.');
  K('q.parent', 'Ota-ona ismi', 'Имя родителя', 'Parent’s name');
  K('q.name.ph', 'Ism va familiya', 'Имя и фамилия', 'First and last name');
  K('q.phone', 'Telefon raqam', 'Номер телефона', 'Phone number');
  K('q.child', 'Farzandingiz ismi', 'Имя вашего ребёнка', 'Your child’s name');
  K('q.grade', 'Qaysi sinfga?', 'В какой класс?', 'Which grade?');
  K('q.pick', 'Tanlang', 'Выберите', 'Select');
  K('q.prep', 'Tayyorlov', 'Подготовительная группа', 'Preparatory');
  K('q.grade.n', '{n}-sinf', '{n} класс', 'Grade {n}');
  K('q.msg', 'Izoh (ixtiyoriy)', 'Комментарий (необязательно)', 'Comment (optional)');
  K('q.msg.ph', 'Savollaringiz yoki qulay vaqtni yozing', 'Напишите вопросы или удобное время', 'Write your questions or a convenient time');
  K('q.send', 'Ariza yuborish', 'Отправить заявку', 'Submit application');
  K('q.s1', 'Ariza qoldiring', 'Оставьте заявку', 'Submit an application');
  K('q.s1d', 'Shaklni to‘ldiring, bir daqiqa vaqt oladi.', 'Заполните форму, это займёт минуту.', 'Fill in the form, it takes a minute.');
  K('q.s2', 'Biz qo‘ng‘iroq qilamiz', 'Мы вам позвоним', 'We will call you');
  K('q.s2d', 'Xodimlarimiz siz bilan bog‘lanib, savollarga javob beradi.', 'Наши сотрудники свяжутся с вами и ответят на вопросы.', 'Our staff will get in touch and answer your questions.');
  K('q.s3', 'Tanishuv suhbati', 'Знакомство и беседа', 'Introductory meeting');
  K('q.s3d', 'Maktabni ko‘rasiz, o‘qituvchilar bilan tanishasiz.', 'Вы увидите школу и познакомитесь с учителями.', 'You will see the school and meet the teachers.');
  K('q.e.wait', 'Iltimos, bir daqiqadan keyin qayta urinib ko‘ring.', 'Пожалуйста, попробуйте снова через минуту.', 'Please try again in a minute.');
  K('q.e.parent', 'Ismingizni kiriting.', 'Введите ваше имя.', 'Enter your name.');
  K('q.e.phone', 'Telefon raqamni to‘g‘ri kiriting (masalan +998 90 123 45 67).', 'Введите номер телефона правильно (например, +998 90 123 45 67).', 'Enter a valid phone number (e.g. +998 90 123 45 67).');
  K('q.e.child', 'Farzandingiz ismini kiriting.', 'Введите имя ребёнка.', 'Enter your child’s name.');
  K('q.e.grade', 'Sinfni tanlang.', 'Выберите класс.', 'Select a grade.');
  K('q.sending', 'Yuborilmoqda…', 'Отправка…', 'Sending…');
  K('q.ok', 'Arizangiz qabul qilindi! Tez orada siz bilan bog‘lanamiz.', 'Ваша заявка принята! Мы скоро свяжемся с вами.', 'Your application has been received! We will contact you soon.');
  K('q.fail', 'Yuborib bo‘lmadi. Birozdan keyin qayta urinib ko‘ring.', 'Не удалось отправить. Попробуйте позже.', 'Could not send. Please try again later.');

  /* ================= JAMOA PANELI (members.js) ================= */
  K('m.signin',
    `O‘qituvchi sifatida ro‘yxatga qo‘shilish yoki o‘quvchi loyihasini joylash uchun <a href="login.html">akkauntga kiring</a>.`,
    `Чтобы добавить себя в список учителей или разместить проект ученика, <a href="login.html">войдите в аккаунт</a>.`,
    `To add yourself to the teachers list or post a student project, <a href="login.html">log in</a>.`);
  K('m.incomplete',
    `Profil to‘liq emas. <a href="login.html">Profilni yakunlang</a>.`,
    `Профиль заполнен не полностью. <a href="login.html">Завершите профиль</a>.`,
    `Your profile is incomplete. <a href="login.html">Complete your profile</a>.`);
  K('m.banned',
    'Akkauntingiz cheklangan, shuning uchun ma’lumot qo‘sha olmaysiz. Maktab ma’muriyati bilan bog‘laning.',
    'Ваш аккаунт ограничен, поэтому вы не можете добавлять данные. Свяжитесь с администрацией школы.',
    'Your account is restricted, so you cannot add content. Please contact the school administration.');
  K('m.t.in', 'Siz ro‘yxatdasiz', 'Вы в списке', 'You are on the list');
  K('m.t.add', 'O‘zingizni o‘qituvchilar ro‘yxatiga qo‘shing', 'Добавьте себя в список учителей', 'Add yourself to the teachers list');
  K('m.t.edit', 'Ma’lumotni tahrirlash', 'Редактирование данных', 'Edit your details');
  K('m.t.own',
    `Kartangiz pastda. «Tahrirlash» yoki «O‘chirish» tugmasidan foydalaning. Rasm va ismni <a href="profile.html">profil sahifasida</a> o‘zgartirasiz.`,
    `Ваша карточка ниже. Используйте кнопки «Редактировать» или «Удалить». Фото и имя меняются на <a href="profile.html">странице профиля</a>.`,
    `Your card is below. Use the “Edit” or “Delete” buttons. Change your photo and name on your <a href="profile.html">profile page</a>.`);
  K('m.t.r.ph', 'Fan va tajriba (masalan: Matematika, 5 yil)', 'Предмет и опыт (например: Математика, 5 лет)', 'Subject and experience (e.g. Mathematics, 5 years)');
  K('m.t.b.ph', 'Qisqacha o‘zingiz haqingizda', 'Коротко о себе', 'A short bio');
  K('m.t.note',
    `Kartadagi rasm va ism <a href="profile.html">profilingizdan</a> olinadi.`,
    `Фото и имя на карточке берутся из <a href="profile.html">вашего профиля</a>.`,
    `The photo and name on the card come from <a href="profile.html">your profile</a>.`);
  K('m.save', 'Saqlash', 'Сохранить', 'Save');
  K('m.add', 'Qo‘shish', 'Добавить', 'Add');
  K('m.cancel', 'Bekor qilish', 'Отмена', 'Cancel');
  K('m.p.add', 'O‘z loyihangizni qo‘shing', 'Добавьте свой проект', 'Add your project');
  K('m.p.edit', 'Loyihani tahrirlash', 'Редактирование проекта', 'Edit project');
  K('m.p.n.ph', 'Loyiha nomi', 'Название проекта', 'Project name');
  K('m.p.b.ph', 'Loyiha haqida qisqacha', 'Коротко о проекте', 'A short description');
  K('m.by', 'Muallif', 'Автор', 'Author');
  K('m.edit', 'Tahrirlash', 'Редактировать', 'Edit');
  K('m.del', 'O‘chirish', 'Удалить', 'Delete');
  K('m.confirm', 'Rostdan ham o‘chirmoqchimisiz?', 'Вы действительно хотите удалить?', 'Are you sure you want to delete this?');
  K('m.saveFail', 'Saqlab bo‘lmadi: ', 'Не удалось сохранить: ', 'Could not save: ');
  K('m.delFail', 'O‘chirib bo‘lmadi: ', 'Не удалось удалить: ', 'Could not delete: ');
  K('m.profile', 'Profilim', 'Мой профиль', 'My profile');

  /* ================= LOGIN ================= */
  K('l.back', '← Saytga qaytish', '← Вернуться на сайт', '← Back to the site');
  K('l.t.login', 'Kirish', 'Вход', 'Log in');
  K('l.t.reg', 'Ro‘yxatdan o‘tish', 'Регистрация', 'Sign up');
  K('l.s.login', 'Akkauntingiz bo‘lsa, kirish uchun login va parolni kiriting.', 'Если у вас есть аккаунт, введите логин и пароль.', 'If you have an account, enter your login and password.');
  K('l.s.reg', 'Yangi akkaunt yarating: ma’lumotlarni kiriting va parol o‘ylab toping.', 'Создайте новый аккаунт: введите данные и придумайте пароль.', 'Create a new account: enter your details and choose a password.');
  K('l.btn.login', 'Kirish', 'Войти', 'Log in');
  K('l.btn.reg', 'Akkaunt yaratish', 'Создать аккаунт', 'Create account');
  K('l.name', 'Ism va familiya', 'Имя и фамилия', 'Full name');
  K('l.name.ph', 'Masalan: Aziza Karimova', 'Например: Азиза Каримова', 'e.g. Aziza Karimova');
  K('l.id', 'Email yoki telefon raqam', 'Email или номер телефона', 'Email or phone number');
  K('l.id.ph', 'nom@gmail.com yoki +998 90 123 45 67', 'name@gmail.com или +998 90 123 45 67', 'name@gmail.com or +998 90 123 45 67');
  K('l.pw', 'Parol', 'Пароль', 'Password');
  K('l.pw.ph', 'Kamida 6 ta belgi', 'Не менее 6 символов', 'At least 6 characters');
  K('l.forgot', 'Parolni unutdim?', 'Забыли пароль?', 'Forgot your password?');
  K('l.pw2', 'Parolni takrorlang', 'Повторите пароль', 'Repeat password');
  K('l.who', 'Siz kimsiz?', 'Кто вы?', 'Who are you?');
  K('l.student', 'O‘quvchi', 'Ученик', 'Student');
  K('l.teacher', 'O‘qituvchi', 'Учитель', 'Teacher');
  K('l.terms',
    `<a href="#" class="tl">Foydalanish shartlari</a> bilan tanishdim va roziman`,
    `Я ознакомился(-лась) с <a href="#" class="tl">условиями использования</a> и согласен(-на)`,
    `I have read and agree to the <a href="#" class="tl">Terms of Use</a>`);
  K('l.or', 'yoki', 'или', 'or');
  K('l.google', 'Google bilan davom etish', 'Продолжить с Google', 'Continue with Google');
  K('l.fin', 'Profilni yakunlang', 'Завершите профиль', 'Complete your profile');
  K('l.finBtn', 'Saqlash va davom etish', 'Сохранить и продолжить', 'Save and continue');
  K('l.hint',
    'Telefon raqam bilan kirishda SMS yuborilmaydi: raqamingiz va parolingiz akkaunt nomi sifatida ishlatiladi. Parolni unutsangiz, tiklash imkoni bo‘lmaydi — uni eslab qoling.',
    'При входе по номеру телефона SMS не отправляется: номер и пароль служат данными аккаунта. Если вы забудете пароль, восстановить его будет нельзя — запомните его.',
    'When you sign in with a phone number, no SMS is sent: your number and password act as your account login. If you forget the password it cannot be recovered, so remember it.');
  K('l.tt', 'Foydalanish shartlari', 'Условия использования', 'Terms of Use');
  K('l.tlist',
    [
      'Ushbu sayt Lider xususiy maktabi o‘quvchilari, o‘qituvchilari va ota-onalari uchun mo‘ljallangan.',
      'Ro‘yxatdan o‘tishda to‘g‘ri ism va aloqa ma’lumotlarini kiriting. Boshqa shaxs nomidan akkaunt ochish taqiqlanadi.',
      'O‘qituvchilar faqat o‘zi haqidagi ma’lumotni, o‘quvchilar esa faqat o‘z loyihalarini joylashi mumkin. Har kim faqat o‘z yozuvini tahrirlaydi yoki o‘chiradi.',
      'Haqoratli, noqonuniy, boshqalarning mualliflik huquqini buzuvchi yoki maktab obro‘siga zarar yetkazuvchi materiallar joylashtirish mumkin emas.',
      'Parolingiz sir saqlanadi va uni boshqalarga bermang. Akkaunt orqali bajarilgan harakatlar uchun o‘zingiz javobgarsiz.',
      'Ma’lumotlaringiz (ism, email yoki telefon, rol) faqat sayt ishlashi uchun saqlanadi va uchinchi shaxslarga berilmaydi. Parol shifrlangan holda saqlanadi, maktab ma’muriyati ham uni ko‘ra olmaydi.',
      'Maktab ma’muriyati qoidalarni buzgan akkaunt va yozuvlarni ogohlantirishsiz o‘chirish huquqini saqlab qoladi.',
      'Shartlar o‘zgarishi mumkin; saytdan foydalanishni davom ettirish yangi shartlarga rozilikni bildiradi.'
    ],
    [
      'Этот сайт предназначен для учеников, учителей и родителей частной школы «Лидер».',
      'При регистрации указывайте достоверное имя и контактные данные. Создавать аккаунт от имени другого лица запрещено.',
      'Учителя могут размещать только информацию о себе, а ученики — только свои проекты. Каждый редактирует или удаляет только свои записи.',
      'Запрещено размещать оскорбительные и незаконные материалы, нарушающие чужие авторские права или вредящие репутации школы.',
      'Ваш пароль хранится в тайне, не передавайте его другим. За действия, совершённые через ваш аккаунт, отвечаете вы.',
      'Ваши данные (имя, email или телефон, роль) хранятся только для работы сайта и не передаются третьим лицам. Пароль хранится в зашифрованном виде, администрация школы его не видит.',
      'Администрация школы вправе без предупреждения удалять аккаунты и записи, нарушающие правила.',
      'Условия могут меняться; продолжая пользоваться сайтом, вы соглашаетесь с новыми условиями.'
    ],
    [
      'This site is intended for students, teachers and parents of Lider Private School.',
      'Provide your real name and contact details when signing up. Creating an account in someone else’s name is prohibited.',
      'Teachers may post only information about themselves and students only their own projects. Everyone edits or deletes only their own entries.',
      'Posting offensive or illegal material, content that infringes others’ copyright, or anything that harms the school’s reputation is prohibited.',
      'Keep your password secret and do not share it. You are responsible for actions taken through your account.',
      'Your data (name, email or phone, role) is stored only to operate the site and is not shared with third parties. Your password is stored encrypted and the school administration cannot see it.',
      'The school administration may delete accounts and entries that break the rules without prior notice.',
      'The terms may change; by continuing to use the site you accept the new terms.'
    ]);
  K('l.go', 'Kirdingiz! Sahifa ochilmoqda…', 'Вы вошли! Открываем страницу…', 'Signed in! Opening the page…');
  K('l.wait', 'Iltimos, kuting…', 'Пожалуйста, подождите…', 'Please wait…');
  K('l.e.id', 'Email yoki telefon raqamni to‘g‘ri kiriting (masalan +998 90 123 45 67).', 'Введите email или номер телефона правильно (например, +998 90 123 45 67).', 'Enter a valid email or phone number (e.g. +998 90 123 45 67).');
  K('l.e.pw', 'Parol kamida 6 ta belgidan iborat bo‘lsin.', 'Пароль должен содержать не менее 6 символов.', 'The password must be at least 6 characters.');
  K('l.e.noprof',
    'Bu akkaunt uchun profil topilmadi. «Ro‘yxatdan o‘tish» orqali qaytadan yarating yoki administratorga murojaat qiling.',
    'Для этого аккаунта не найден профиль. Зарегистрируйтесь заново через «Регистрация» или обратитесь к администратору.',
    'No profile was found for this account. Sign up again or contact the administrator.');
  K('l.e.name', 'Ism va familiyangizni kiriting.', 'Введите имя и фамилию.', 'Enter your full name.');
  K('l.e.match', 'Parollar bir xil emas.', 'Пароли не совпадают.', 'Passwords do not match.');
  K('l.e.role', 'O‘qituvchi yoki o‘quvchi ekanligingizni tanlang.', 'Выберите: вы учитель или ученик.', 'Choose whether you are a teacher or a student.');
  K('l.e.terms', 'Davom etish uchun foydalanish shartlariga rozilik bering.', 'Чтобы продолжить, примите условия использования.', 'Accept the Terms of Use to continue.');
  K('l.gopen', 'Google oynasi ochilmoqda…', 'Открываем окно Google…', 'Opening the Google window…');
  K('l.gdone', 'Google orqali kirdingiz. Profilni yakunlang.', 'Вы вошли через Google. Завершите профиль.', 'Signed in with Google. Complete your profile.');
  K('l.e.again', 'Qaytadan Google orqali kiring.', 'Войдите через Google ещё раз.', 'Sign in with Google again.');
  K('l.f.email', 'Avval yuqoridagi maydonga email manzilingizni yozing.', 'Сначала введите свой email в поле выше.', 'First enter your email in the field above.');
  K('l.f.phone',
    'Telefon raqam bilan ro‘yxatdan o‘tganlar parolni o‘zi tiklay olmaydi. Maktab ma’muriyatiga murojaat qiling.',
    'Пользователи, зарегистрированные по номеру телефона, не могут сами восстановить пароль. Обратитесь в администрацию школы.',
    'Users who signed up with a phone number cannot reset their password themselves. Please contact the school administration.');
  K('l.f.sending', 'Yuborilmoqda…', 'Отправка…', 'Sending…');
  K('l.f.ok',
    'Agar bu email bilan akkaunt mavjud bo‘lsa, parolni tiklash havolasi yuborildi. «Spam» papkasini ham tekshiring.',
    'Если аккаунт с этим email существует, ссылка для восстановления пароля отправлена. Проверьте и папку «Спам».',
    'If an account with this email exists, a password reset link has been sent. Check your Spam folder too.');

  /* ================= XATOLIK KODLARI ================= */
  K('e.invalid-credential', 'Login yoki parol noto‘g‘ri. Akkauntingiz bo‘lmasa, «Ro‘yxatdan o‘tish» ni tanlang.', 'Неверный логин или пароль. Если у вас нет аккаунта, выберите «Регистрация».', 'Incorrect login or password. If you don’t have an account, choose “Sign up”.');
  K('e.wrong-password', 'Parol noto‘g‘ri.', 'Неверный пароль.', 'Incorrect password.');
  K('e.user-not-found', 'Bunday akkaunt yo‘q. «Ro‘yxatdan o‘tish» ni tanlang.', 'Такого аккаунта нет. Выберите «Регистрация».', 'No such account. Choose “Sign up”.');
  K('e.email-already-in-use', 'Bu email yoki telefon bilan akkaunt bor. «Kirish» orqali kiring.', 'Аккаунт с этим email или номером уже существует. Войдите через «Вход».', 'An account with this email or phone already exists. Use “Log in”.');
  K('e.weak-password', 'Parol juda oddiy: kamida 6 ta belgi kiriting.', 'Слишком простой пароль: введите не менее 6 символов.', 'Password is too weak: use at least 6 characters.');
  K('e.invalid-email', 'Email manzil noto‘g‘ri.', 'Неверный адрес email.', 'Invalid email address.');
  K('e.too-many-requests', 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.', 'Слишком много попыток. Попробуйте позже.', 'Too many attempts. Please try again later.');
  K('e.network-request-failed', 'Internet bilan aloqa yo‘q.', 'Нет подключения к интернету.', 'No internet connection.');
  K('e.popup-closed-by-user', 'Google oynasi yopildi.', 'Окно Google закрыто.', 'The Google window was closed.');
  K('e.popup-blocked', 'Brauzer Google oynasini blokladi. Ruxsat bering.', 'Браузер заблокировал окно Google. Разрешите всплывающие окна.', 'Your browser blocked the Google window. Please allow pop-ups.');
  K('e.unauthorized-domain', 'Bu domen Firebase’da ruxsat etilmagan (Authentication → Settings → Authorized domains).', 'Этот домен не разрешён в Firebase (Authentication → Settings → Authorized domains).', 'This domain is not authorized in Firebase (Authentication → Settings → Authorized domains).');
  K('e.permission-denied', 'Bazaga yozishga ruxsat yo‘q (Firestore rules ni tekshiring).', 'Нет прав на запись в базу (проверьте правила Firestore).', 'No permission to write to the database (check the Firestore rules).');
  K('e.requires-recent-login', 'Xavfsizlik uchun qaytadan kiring va urinib ko‘ring.', 'В целях безопасности войдите заново и повторите попытку.', 'For security, sign in again and try once more.');

  /* ================= PROFIL ================= */
  K('p.user', 'Foydalanuvchi', 'Пользователь', 'User');
  K('p.photo', 'Rasm yuklash', 'Загрузить фото', 'Upload photo');
  K('p.photoDel', 'Rasmni o‘chirish', 'Удалить фото', 'Remove photo');
  K('p.since', 'Ro‘yxatdan o‘tgan: {d}', 'Дата регистрации: {d}', 'Joined: {d}');
  K('p.h.info', 'Shaxsiy ma’lumotlar', 'Личные данные', 'Personal details');
  K('p.bio', 'O‘zim haqimda', 'О себе', 'About me');
  K('p.bio.ph', 'Qisqacha o‘zingiz haqingizda yozing', 'Коротко напишите о себе', 'Write a short bio');
  K('p.h.act', 'Faoliyatim', 'Моя активность', 'My activity');
  K('p.a.t.in', 'Siz o‘qituvchilar ro‘yxatidasiz.', 'Вы в списке учителей.', 'You are on the teachers list.');
  K('p.a.t.view', 'Kartamni ko‘rish', 'Посмотреть карточку', 'View my card');
  K('p.a.t.out', 'Siz hali o‘qituvchilar ro‘yxatida emassiz.', 'Вас ещё нет в списке учителей.', 'You are not on the teachers list yet.');
  K('p.a.t.join', 'Ro‘yxatga qo‘shilish', 'Добавиться в список', 'Join the list');
  K('p.a.s.cnt', 'Qo‘shgan loyihalaringiz: <b>{n}</b>', 'Добавленных проектов: <b>{n}</b>', 'Projects you have added: <b>{n}</b>');
  K('p.a.s.view', 'Loyihalarimni ko‘rish', 'Посмотреть мои проекты', 'View my projects');
  K('p.a.s.add', 'Loyiha qo‘shish', 'Добавить проект', 'Add a project');
  K('p.h.pw', 'Parolni o‘zgartirish', 'Смена пароля', 'Change password');
  K('p.cur', 'Joriy parol', 'Текущий пароль', 'Current password');
  K('p.new1', 'Yangi parol', 'Новый пароль', 'New password');
  K('p.new2', 'Yangi parolni takrorlang', 'Повторите новый пароль', 'Repeat new password');
  K('p.pwBtn', 'Parolni yangilash', 'Обновить пароль', 'Update password');
  K('p.gnote', 'Siz Google orqali kirgansiz, shuning uchun parolni Google akkauntingiz sozlamalarida o‘zgartirasiz.', 'Вы вошли через Google, поэтому пароль меняется в настройках вашего аккаунта Google.', 'You signed in with Google, so you change your password in your Google account settings.');
  K('p.h.out', 'Chiqish', 'Выход', 'Sign out');
  K('p.outTxt', 'Bu qurilmadagi akkauntingizdan chiqasiz.', 'Вы выйдете из аккаунта на этом устройстве.', 'You will be signed out on this device.');
  K('p.outBtn', 'Akkauntdan chiqish', 'Выйти из аккаунта', 'Sign out');
  K('p.h.del', 'Akkauntni o‘chirish', 'Удаление аккаунта', 'Delete account');
  K('p.delTxt', 'Akkauntingiz, profilingiz, o‘qituvchi kartangiz va loyihalaringiz butunlay o‘chiriladi. Buni qaytarib bo‘lmaydi.', 'Ваш аккаунт, профиль, карточка учителя и проекты будут удалены навсегда. Это нельзя отменить.', 'Your account, profile, teacher card and projects will be deleted permanently. This cannot be undone.');
  K('p.delPw', 'Tasdiqlash uchun parolingiz', 'Ваш пароль для подтверждения', 'Your password to confirm');
  K('p.m.img', 'Faqat rasm faylini tanlang.', 'Выберите файл изображения.', 'Choose an image file.');
  K('p.m.up', 'Yuklanmoqda…', 'Загрузка…', 'Uploading…');
  K('p.m.imgOk', 'Rasm yangilandi.', 'Фото обновлено.', 'Photo updated.');
  K('p.m.imgAsk', 'Profil rasmi o‘chirilsinmi?', 'Удалить фото профиля?', 'Remove your profile photo?');
  K('p.m.imgRm', 'Rasm o‘chirildi.', 'Фото удалено.', 'Photo removed.');
  K('p.m.name', 'Ism kamida 2 ta belgidan iborat bo‘lsin.', 'Имя должно содержать не менее 2 символов.', 'The name must be at least 2 characters.');
  K('p.m.saving', 'Saqlanmoqda…', 'Сохранение…', 'Saving…');
  K('p.m.saved', 'Saqlandi.', 'Сохранено.', 'Saved.');
  K('p.m.cur', 'Joriy parolni kiriting.', 'Введите текущий пароль.', 'Enter your current password.');
  K('p.m.short', 'Yangi parol kamida 6 ta belgidan iborat bo‘lsin.', 'Новый пароль должен содержать не менее 6 символов.', 'The new password must be at least 6 characters.');
  K('p.m.mis', 'Yangi parollar bir xil emas.', 'Новые пароли не совпадают.', 'The new passwords do not match.');
  K('p.m.check', 'Tekshirilmoqda…', 'Проверка…', 'Checking…');
  K('p.m.pwOk', 'Parol o‘zgartirildi.', 'Пароль изменён.', 'Password changed.');
  K('p.m.delAsk', 'Akkaunt va unga tegishli barcha ma’lumotlar butunlay o‘chiriladi. Davom etasizmi?', 'Аккаунт и все связанные с ним данные будут удалены навсегда. Продолжить?', 'Your account and all related data will be deleted permanently. Continue?');
  K('p.m.delPw', 'Tasdiqlash uchun parolingizni kiriting.', 'Введите пароль для подтверждения.', 'Enter your password to confirm.');
  K('p.m.readFail', 'Rasm o‘qilmadi.', 'Не удалось прочитать изображение.', 'Could not read the image.');

  /* ================= MOTOR ================= */
  const LANGS = { uz: 'UZ', ru: 'RU', en: 'EN' };
  const LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
  let lang = 'uz';
  try { const s = localStorage.getItem('lang'); if (D[s]) lang = s; } catch (e) {}

  const get = k => (D[lang][k] !== undefined ? D[lang][k] : D.uz[k]);
  const has = k => D.uz[k] !== undefined;
  const t = (k, v) => {
    let s = get(k);
    if (s === undefined) return k;
    if (v && typeof s === 'string') for (const x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  };

  function apply(root) {
    const r = root || document;
    r.querySelectorAll('[data-i]').forEach(e => { e.textContent = t(e.dataset.i); });
    r.querySelectorAll('[data-ih]').forEach(e => { e.innerHTML = t(e.dataset.ih); });
    r.querySelectorAll('[data-ip]').forEach(e => { e.placeholder = t(e.dataset.ip); });
    r.querySelectorAll('[data-ia]').forEach(e => e.setAttribute('aria-label', t(e.dataset.ia)));
    r.querySelectorAll('[data-list]').forEach(e => {
      e.innerHTML = (get(e.dataset.list) || []).map(x => '<li>' + x + '</li>').join('');
    });
    r.querySelectorAll('.eye').forEach(b => b.setAttribute('aria-label', t(b.classList.contains('on') ? 'aria.hide' : 'aria.show')));
    document.documentElement.lang = lang;
  }

  function set(l) {
    if (!D[l]) return;
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    const s = document.getElementById('lang');
    if (s) s.value = l;
    apply();
    window.dispatchEvent(new Event('langchange'));
  }

  const CSS = `
#lang{order:2;flex:none;margin-right:10px;padding:7px 8px;border-radius:999px;border:1.5px solid rgba(255,255,255,.4);background:rgba(255,255,255,.08);color:#fff;font:700 .8rem var(--sans);cursor:pointer}
#lang:hover{border-color:var(--gold2)}
#lang option{background:#fff;color:#0A1B45}
[data-theme=dark] #lang option{background:#141f3d;color:#e6ebfa}
#lang.float{position:fixed;top:14px;right:14px;z-index:60;margin:0;background:var(--card);color:var(--head);border-color:var(--border)}
.top #lang{margin-left:auto;margin-right:14px}
.hero h1 i{font-style:normal}
@media(max-width:820px){#lang{margin-left:auto;margin-right:8px}#authLi{margin-left:0}}`;

  function mount() {
    const s = document.createElement('select');
    s.id = 'lang';
    s.dataset.ia = 'aria.lang';
    s.innerHTML = Object.keys(LANGS).map(k => '<option value="' + k + '">' + LANGS[k] + '</option>').join('');
    s.value = lang;
    s.onchange = () => set(s.value);
    const nav = document.querySelector('nav .wrap');
    const top = document.querySelector('.top .wrap');
    if (nav) nav.insertBefore(s, document.getElementById('authLi'));
    else if (top) top.insertBefore(s, top.lastElementChild);
    else { s.classList.add('float'); document.body.appendChild(s); }
  }

  function init() {
    const st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    mount();
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.I18N = { t, get, has, apply, set, current: () => lang, locale: () => LOCALES[lang] };
})();