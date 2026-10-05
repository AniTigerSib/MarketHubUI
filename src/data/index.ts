export type Lang = 'en' | 'ru'

export interface Category {
  id: string
  en: string
  ru: string
  count: number
}

export interface City {
  id: string
  en: string
  ru: string
}

export interface Listing {
  id: number
  cat: string
  sub?: string
  en: string
  ru: string
  price: number
  city: string
  h: number
  cond: 'new' | 'used'
  seller: 'private' | 'business'
  photo: string
  den: string
  dru: string
  suffix?: string
  mine?: boolean
  status?: 'active' | 'review' | 'rejected' | 'archived'
  views?: number
  favs?: number
  chats?: number
  reason?: Record<string, string>
}

export interface Seller {
  name: string
  since: number
  rating: number
  reviews: number
  phone: string
}

export interface Thread {
  id: number
  lid: number
  who: string
  role: 'buying' | 'selling'
  unread: number
  msgs: Message[]
}

export interface Message {
  me: boolean
  text: string | Record<string, string>
  at: string
}

export interface PostForm {
  cat: string
  sub: string
  title: string
  desc: string
  price: string
  city: string
  cond: 'new' | 'used'
  photos: number
  viaMsg: boolean
  viaPhone: boolean
  editId: number | null
}

export const categories: Category[] = [
  { id: 'transport', en: 'Transport', ru: 'Транспорт', count: 412300 },
  { id: 'realty', en: 'Real estate', ru: 'Недвижимость', count: 288140 },
  { id: 'jobs', en: 'Jobs', ru: 'Работа', count: 96500 },
  { id: 'services', en: 'Services', ru: 'Услуги', count: 154020 },
  { id: 'electronics', en: 'Electronics', ru: 'Электроника', count: 530870 },
  { id: 'home', en: 'Home & garden', ru: 'Дом и сад', count: 377400 },
  { id: 'clothing', en: 'Clothing', ru: 'Одежда', count: 615900 },
  { id: 'kids', en: 'Kids', ru: 'Детям', count: 241300 },
  { id: 'hobbies', en: 'Hobbies & sport', ru: 'Хобби и спорт', count: 189750 },
  { id: 'pets', en: 'Pets', ru: 'Животные', count: 58200 },
]

export const cities: City[] = [
  { id: 'msk', en: 'Moscow', ru: 'Москва' },
  { id: 'spb', en: 'Saint Petersburg', ru: 'Санкт-Петербург' },
  { id: 'kzn', en: 'Kazan', ru: 'Казань' },
  { id: 'nsk', en: 'Novosibirsk', ru: 'Новосибирск' },
  { id: 'ekb', en: 'Yekaterinburg', ru: 'Екатеринбург' },
]

function L(
  id: number,
  cat: string,
  en: string,
  ru: string,
  price: number,
  city: string,
  h: number,
  cond: 'new' | 'used',
  seller: 'private' | 'business',
  photo: string,
  den: string,
  dru: string,
  suffix?: string,
): Listing {
  return { id, cat, en, ru, price, city, h, cond, seller, photo, den, dru, suffix }
}

export const listings: Listing[] = [
  L(
    1,
    'electronics',
    'iPhone 13, 128 GB, blue',
    'iPhone 13, 128 ГБ, синий',
    41990,
    'msk',
    2,
    'used',
    'private',
    'phone, front + back',
    'Battery 89%, always in a case. Box and cable included.',
    'Аккумулятор 89%, всегда в чехле. Коробка и кабель в комплекте.',
  ),
  L(
    2,
    'hobbies',
    'Trek Marlin 7 mountain bike, 29"',
    'Горный велосипед Trek Marlin 7, 29"',
    38000,
    'msk',
    3,
    'used',
    'private',
    'bicycle, side view',
    'Frame L, hydraulic brakes, serviced this spring.',
    'Рама L, гидравлические тормоза, ТО этой весной.',
  ),
  L(
    3,
    'realty',
    '2-room apartment, 54 m², 3/9 fl.',
    '2-к. квартира, 54 м², 3/9 эт.',
    12500000,
    'kzn',
    4,
    'used',
    'business',
    'apartment interior',
    'Renovated, 7 min walk to metro, quiet courtyard.',
    'С ремонтом, 7 минут до метро, тихий двор.',
  ),
  L(
    4,
    'home',
    'Corner sofa bed, grey',
    'Угловой диван-кровать, серый',
    15000,
    'spb',
    5,
    'used',
    'private',
    'sofa in living room',
    'Folds out to a double bed, storage box inside.',
    'Раскладывается в двуспальную кровать, есть ящик для белья.',
  ),
  L(
    5,
    'transport',
    'Toyota Camry 2.5, 2018',
    'Toyota Camry 2.5, 2018',
    2350000,
    'msk',
    6,
    'used',
    'private',
    'car, three-quarter view',
    '84 000 km, one owner, full service history.',
    '84 000 км, один владелец, полная история обслуживания.',
  ),
  L(
    6,
    'electronics',
    'MacBook Air M1, 8/256',
    'MacBook Air M1, 8/256',
    54000,
    'nsk',
    8,
    'used',
    'private',
    'laptop on desk',
    '212 battery cycles, no scratches.',
    '212 циклов зарядки, без царапин.',
  ),
  L(
    7,
    'clothing',
    'Down jacket, size M',
    'Пуховик, размер M',
    9500,
    'msk',
    10,
    'new',
    'business',
    'jacket on hanger',
    'New with tags, warm down filling down to −25 °C.',
    'Новый с бирками, утеплитель до −25 °C.',
  ),
  L(
    8,
    'kids',
    'Baby stroller 2-in-1',
    'Коляска 2 в 1',
    18000,
    'ekb',
    12,
    'used',
    'private',
    'stroller',
    'Bassinet + seat unit, rain cover included.',
    'Люлька + прогулочный блок, дождевик в комплекте.',
  ),
  L(
    9,
    'electronics',
    'PlayStation 5 with disc drive',
    'PlayStation 5 с дисководом',
    45000,
    'ekb',
    20,
    'used',
    'private',
    'game console',
    'Two controllers, three games.',
    'Два геймпада, три игры.',
  ),
  L(
    10,
    'home',
    'Oak dining table, 160 cm',
    'Обеденный стол из дуба, 160 см',
    22000,
    'spb',
    26,
    'used',
    'private',
    'wooden table',
    'Solid oak, seats six.',
    'Массив дуба, на 6 человек.',
  ),
  L(
    11,
    'jobs',
    'Barista, full-time',
    'Бариста, полная занятость',
    65000,
    'msk',
    30,
    'new',
    'business',
    'coffee bar',
    '2/2 shifts, training provided.',
    'График 2/2, обучение за наш счёт.',
    '/mo',
  ),
  L(
    12,
    'hobbies',
    'Acoustic guitar Yamaha F310',
    'Акустическая гитара Yamaha F310',
    11000,
    'kzn',
    34,
    'used',
    'private',
    'guitar',
    'Great first guitar, new strings.',
    'Отличная первая гитара, новые струны.',
  ),
  L(
    13,
    'services',
    'Turnkey apartment renovation',
    'Ремонт квартир под ключ',
    3500,
    'msk',
    40,
    'new',
    'business',
    'renovation works',
    'Estimate within a day, 2-year warranty.',
    'Смета за день, гарантия 2 года.',
    '/m²',
  ),
  L(
    14,
    'electronics',
    'Samsung 55" 4K Smart TV',
    'Телевизор Samsung 55" 4K Smart TV',
    32000,
    'nsk',
    48,
    'used',
    'business',
    'television',
    'Wall mount included.',
    'Кронштейн в комплекте.',
  ),
  L(
    15,
    'kids',
    'Kids bike, 20"',
    'Детский велосипед, 20"',
    6500,
    'msk',
    52,
    'used',
    'private',
    'kids bicycle',
    'For ages 6–9, minor scuffs.',
    'Для 6–9 лет, небольшие потёртости.',
  ),
  L(
    16,
    'pets',
    'Cat tree, 150 cm',
    'Когтеточка-домик, 150 см',
    4800,
    'spb',
    70,
    'new',
    'business',
    'cat tree',
    'Sisal posts, two platforms and a hideout.',
    'Сизалевые столбики, две лежанки и домик.',
  ),
]

const SUB_OF: Record<number, string> = {
  1: 'phones',
  2: 'bikes',
  3: 'apartments',
  4: 'furniture',
  5: 'cars',
  6: 'laptops',
  7: 'men',
  8: 'strollers',
  9: 'consoles',
  10: 'furniture',
  11: 'vacancies',
  12: 'music',
  13: 'repair',
  14: 'tv',
  15: 'kidstransport',
  16: 'supplies',
  101: 'audio',
  102: 'furniture',
  103: 'decor',
  104: 'shoes',
  105: 'kidstransport',
}
listings.forEach((l) => {
  l.sub = SUB_OF[l.id]
})

function S(id: string, en: string, ru: string) {
  return { id, en, ru }
}
export const subcategories: Record<string, { id: string; en: string; ru: string }[]> = {
  transport: [
    S('cars', 'Cars', 'Автомобили'),
    S('motorcycles', 'Motorcycles', 'Мотоциклы'),
    S('parts', 'Parts & accessories', 'Запчасти и аксессуары'),
  ],
  realty: [
    S('apartments', 'Apartments', 'Квартиры'),
    S('houses', 'Houses & cottages', 'Дома и дачи'),
    S('rooms', 'Rooms', 'Комнаты'),
  ],
  jobs: [S('vacancies', 'Vacancies', 'Вакансии'), S('resumes', 'Resumes', 'Резюме')],
  services: [
    S('repair', 'Repair & construction', 'Ремонт и строительство'),
    S('cleaning', 'Cleaning', 'Уборка'),
    S('beauty', 'Beauty & health', 'Красота и здоровье'),
  ],
  electronics: [
    S('phones', 'Phones', 'Телефоны'),
    S('laptops', 'Laptops', 'Ноутбуки'),
    S('audio', 'Audio', 'Аудио'),
    S('tv', 'TV & video', 'Телевизоры'),
    S('consoles', 'Game consoles', 'Игровые приставки'),
  ],
  home: [
    S('furniture', 'Furniture', 'Мебель'),
    S('appliances', 'Appliances', 'Бытовая техника'),
    S('decor', 'Decor & lighting', 'Декор и освещение'),
  ],
  clothing: [
    S('women', 'Women', 'Женская одежда'),
    S('men', 'Men', 'Мужская одежда'),
    S('shoes', 'Shoes', 'Обувь'),
  ],
  kids: [
    S('strollers', 'Strollers & car seats', 'Коляски и автокресла'),
    S('toys', 'Toys', 'Игрушки'),
    S('kidsclothes', 'Kids clothing', 'Детская одежда'),
    S('kidstransport', 'Bikes & scooters', 'Велосипеды и самокаты'),
  ],
  hobbies: [
    S('bikes', 'Bicycles', 'Велосипеды'),
    S('music', 'Musical instruments', 'Музыкальные инструменты'),
    S('sport', 'Sports & fitness', 'Спорт и фитнес'),
  ],
  pets: [
    S('supplies', 'Pet supplies', 'Товары для животных'),
    S('cats', 'Cats', 'Кошки'),
    S('dogs', 'Dogs', 'Собаки'),
  ],
}

export const sellers: Seller[] = [
  { name: 'Anna K.', since: 2021, rating: 4.9, reviews: 32, phone: '+7 916 482-17-35' },
  { name: 'Maxim R.', since: 2019, rating: 4.7, reviews: 58, phone: '+7 903 115-40-22' },
  { name: 'Olga S.', since: 2023, rating: 5.0, reviews: 9, phone: '+7 925 760-08-91' },
  { name: 'DomStroy LLC', since: 2017, rating: 4.6, reviews: 214, phone: '+7 495 210-33-44' },
]

export function sellerFor(l: Listing): Seller | null {
  if (l.mine) return null
  return sellers[l.seller === 'business' ? 3 : l.id % 3] ?? null
}

export const seedMine: Listing[] = [
  {
    id: 101,
    mine: true,
    cat: 'electronics',
    sub: 'audio',
    en: 'AirPods Pro 2 with case',
    ru: 'AirPods Pro 2 с кейсом',
    price: 14500,
    city: 'msk',
    h: 20,
    cond: 'used',
    seller: 'private',
    photo: 'earbuds in case',
    den: 'Bought in March, full set with receipt.',
    dru: 'Куплены в марте, полный комплект и чек.',
    status: 'active',
    views: 312,
    favs: 8,
    chats: 3,
  },
  {
    id: 102,
    mine: true,
    cat: 'home',
    sub: 'furniture',
    en: 'Office chair, mesh back',
    ru: 'Офисное кресло, сетчатая спинка',
    price: 4800,
    city: 'msk',
    h: 50,
    cond: 'used',
    seller: 'private',
    photo: 'office chair',
    den: 'Adjustable height and armrests.',
    dru: 'Регулируется высота и подлокотники.',
    status: 'active',
    views: 41,
    favs: 1,
    chats: 0,
  },
  {
    id: 103,
    mine: true,
    cat: 'home',
    sub: 'decor',
    en: 'Desk lamp, brass',
    ru: 'Настольная лампа, латунь',
    price: 2200,
    city: 'msk',
    h: 0,
    cond: 'used',
    seller: 'private',
    photo: 'desk lamp',
    den: 'Warm light, E27 bulb included.',
    dru: 'Тёплый свет, лампочка E27 в комплекте.',
    status: 'review',
    views: 0,
    favs: 0,
    chats: 0,
  },
  {
    id: 104,
    mine: true,
    cat: 'clothing',
    sub: 'shoes',
    en: 'Sneakers, size 42',
    ru: 'Кроссовки, размер 42',
    price: 3900,
    city: 'msk',
    h: 30,
    cond: 'used',
    seller: 'private',
    photo: 'sneakers',
    den: 'Worn twice.',
    dru: 'Надевал два раза.',
    status: 'rejected',
    reason: {
      en: "Photos don't match the item in the title. Add photos of the actual pair.",
      ru: 'Фото не соответствуют товару в заголовке. Добавьте фото этой пары.',
    },
    views: 0,
    favs: 0,
    chats: 0,
  },
  {
    id: 105,
    mine: true,
    cat: 'kids',
    sub: 'kidstransport',
    en: 'Kids scooter',
    ru: 'Детский самокат',
    price: 1500,
    city: 'msk',
    h: 400,
    cond: 'used',
    seller: 'private',
    photo: 'kids scooter',
    den: 'Sold.',
    dru: 'Продан.',
    status: 'archived',
    views: 96,
    favs: 4,
    chats: 5,
  },
]

export const seedThreads: Thread[] = [
  {
    id: 1,
    lid: 2,
    who: 'Maxim R.',
    role: 'buying',
    unread: 1,
    msgs: [
      {
        me: true,
        text: {
          en: 'Hi! Is the bike still available?',
          ru: 'Здравствуйте! Велосипед ещё продаётся?',
        },
        at: '14:02',
      },
      {
        me: false,
        text: {
          en: 'Yes, you can come and test-ride it tonight after 7.',
          ru: 'Да, можно приехать и прокатиться сегодня после 19:00.',
        },
        at: '14:10',
      },
    ],
  },
  {
    id: 2,
    lid: 101,
    who: 'Olga S.',
    role: 'selling',
    unread: 1,
    msgs: [
      {
        me: false,
        text: { en: 'Would you take 13 000 ₽?', ru: 'Отдадите за 13 000 ₽?' },
        at: '11:47',
      },
    ],
  },
  {
    id: 3,
    lid: 6,
    who: 'Anna K.',
    role: 'buying',
    unread: 0,
    msgs: [
      {
        me: true,
        text: { en: 'How many battery cycles?', ru: 'Сколько циклов у аккумулятора?' },
        at: 'Mon',
      },
      { me: false, text: { en: "212, it's in the photos.", ru: '212, есть на фото.' }, at: 'Mon' },
    ],
  },
]

export function fmtPrice(n: number): string {
  return n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽'
}

export function fmtCount(n: number, lang: Lang): string {
  return n >= 1000
    ? Math.round(n / 1000)
        .toLocaleString('ru-RU')
        .replace(/ /g, ' ') + (lang === 'ru' ? ' тыс.' : 'K')
    : String(n)
}

export function fmtAgo(h: number, t: Record<string, string>): string {
  return h < 24 ? `${h} ${t.hAgo}` : `${Math.floor(h / 24)} ${t.dAgo}`
}

export function listingsWord(n: number, lang: Lang): string {
  if (lang !== 'ru') return n === 1 ? 'listing' : 'listings'
  const m10 = n % 10,
    m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'объявление'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'объявления'
  return 'объявлений'
}

export function subName(cat: string, sub: string, lang: Lang): string {
  const x = (subcategories[cat] || []).find((s) => s.id === sub)
  return x ? x[lang] : ''
}

export function subCount(cat: string, sub: string): number {
  return listings.filter((l) => l.cat === cat && (!sub || l.sub === sub)).length
}

export interface FilterOpts {
  q?: string
  cat?: string
  sub?: string
  min?: string
  max?: string
  conds?: string[]
  seller?: string
  city?: string
  sort?: string
}

export function filterListings(opts: FilterOpts, _lang: Lang): Listing[] {
  const {
    q = '',
    cat = '',
    sub = '',
    min = '',
    max = '',
    conds = [],
    seller = '',
    city = '',
    sort = 'new',
  } = opts
  const ql = q.trim().toLowerCase()
  let r = listings.filter(
    (l) =>
      (!ql || l.en.toLowerCase().includes(ql) || l.ru.toLowerCase().includes(ql)) &&
      (!cat || l.cat === cat) &&
      (!sub || l.sub === sub) &&
      (min === '' || l.price >= +min) &&
      (max === '' || l.price <= +max) &&
      (!conds.length || conds.includes(l.cond)) &&
      (!seller || l.seller === seller) &&
      (!city || l.city === city),
  )
  if (sort === 'cheap') r = [...r].sort((a, b) => a.price - b.price)
  else if (sort === 'exp') r = [...r].sort((a, b) => b.price - a.price)
  else r = [...r].sort((a, b) => a.h - b.h)
  return r
}

export const CAT_ICONS: Record<string, string> = {
  transport: 'ph ph-car',
  realty: 'ph ph-buildings',
  jobs: 'ph ph-briefcase',
  services: 'ph ph-wrench',
  electronics: 'ph ph-device-mobile',
  home: 'ph ph-armchair',
  clothing: 'ph ph-t-shirt',
  kids: 'ph ph-baby',
  hobbies: 'ph ph-bicycle',
  pets: 'ph ph-paw-print',
}

export const i18n: Record<Lang, { [key: string]: string }> = {
  en: {
    categories: 'Categories',
    allCategories: 'All categories',
    searchPh: 'Search listings',
    find: 'Find',
    post: 'Post an ad',
    login: 'Log in',
    favorites: 'Favorites',
    messages: 'Messages',
    recommended: 'Recommended for you',
    showMore: 'Show more',
    listings: 'listings',
    home: 'Home',
    filters: 'Filters',
    category: 'Category',
    price: 'Price, ₽',
    from: 'from',
    to: 'to',
    condition: 'Condition',
    new: 'New',
    used: 'Used',
    seller: 'Seller',
    anySeller: 'Any',
    private: 'Private',
    business: 'Business',
    reset: 'Reset filters',
    show: 'Show',
    sortNew: 'Newest first',
    sortCheap: 'Cheapest first',
    sortExp: 'Most expensive first',
    saveSearch: 'Save search',
    searchSaved: 'Search saved',
    allListings: 'All listings',
    nothing: 'Nothing found',
    nothingHint: 'Try removing some filters or changing the query.',
    signup: 'Sign up',
    logIn: 'Log in',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    pwHint: 'At least 8 characters',
    accept: 'I accept the Terms of use and Privacy policy',
    create: 'Create account',
    forgot: 'Forgot password?',
    or: 'or continue with',
    smsNote: 'We confirm your phone by SMS before your first listing is published.',
    posterTitle: "Buy and sell what's next door.",
    posterBody:
      'Over 3 million listings from people in your city. Every ad is checked by a moderator before it goes live.',
    back: 'Back to MarketHub',
    loginToFav: 'Log in to save favorites',
    loginToPost: 'Log in to post an ad',
    loginToMsg: 'Log in to see your messages',
    welcome: 'Welcome',
    addedFav: 'Added to favorites',
    removedFav: 'Removed from favorites',
    logout: 'Log out',
    hAgo: 'h ago',
    dAgo: 'd ago',
    mo: '/mo',
    m2: '/m²',
    fromPrice: 'from ',
    allCats: 'All categories',
    characteristics: 'Characteristics',
    description: 'Description',
    location: 'Location',
    writeSeller: 'Write to seller',
    showPhone: 'Show phone',
    inFav: 'In favorites',
    addFav: 'Add to favorites',
    since: 'On MarketHub since',
    replies: 'Usually replies within an hour',
    verified: 'Phone verified',
    reviews: 'reviews',
    safety: 'Never send prepayment. Meet in a public place and check the item before paying.',
    report: 'Report listing',
    views: 'views',
    similar: 'Similar listings',
    posted: 'Posted',
    listingNo: 'Listing',
    yourListing: 'This is your listing',
    editListing: 'Edit listing',
    newListing: 'New listing',
    photos: 'Photos',
    photosHint: 'Up to 10 photos. The first one is the cover.',
    addPhoto: 'Add photo',
    title: 'Title',
    titlePh: 'e.g. iPhone 13, 128 GB',
    descPh: "Condition, what's included, reason for selling…",
    descMin: 'at least 30 characters',
    contactWay: 'How buyers can contact you',
    viaMsg: 'Messages',
    viaPhone: 'Phone calls',
    saveDraft: 'Save draft',
    submit: 'Submit for review',
    preview: 'Preview',
    checklist: 'Before you submit',
    modNote:
      'Every listing is checked by a moderator before it goes live — usually within 30 minutes.',
    chooseCat: 'Choose a category',
    justNow: 'just now',
    draftSaved: 'Draft saved',
    ckCat: 'Category chosen',
    ckTitle: 'Title, 5+ characters',
    ckPhoto: 'At least one photo',
    ckDesc: 'Description, 30+ characters',
    ckPrice: 'Price set',
    myListings: 'My listings',
    active: 'Active',
    inReview: 'In review',
    rejected: 'Rejected',
    archived: 'Archived',
    settings: 'Settings',
    edit: 'Edit',
    markSold: 'Mark as sold',
    fix: 'Fix and resubmit',
    reasonL: "Moderator's comment",
    reviewEta: 'Usually reviewed within 30 minutes',
    sentToMod: 'Sent for review',
    movedArchive: 'Moved to archive',
    nothingHere: 'Nothing here yet',
    favEmpty: 'Tap the heart on any listing to save it here.',
    all: 'All',
    buying: 'Buying',
    selling: 'Selling',
    typeMsg: 'Write a message…',
    send: 'Send',
    online: 'online',
    q1: 'Still available?',
    q2: "What's the final price?",
    q3: 'Can I see it today?',
    pickChat: 'Choose a chat on the left',
    you: 'You',
    autoReply: "Yes, it's still available. When would you like to come?",
    soonSettings: 'Settings — coming in the next batch',
    modLabel: 'moderation time',
    subcategory: 'Subcategory',
    allSubs: 'All',
    account: 'My account',
  },
  ru: {
    categories: 'Категории',
    allCategories: 'Все категории',
    searchPh: 'Поиск по объявлениям',
    find: 'Найти',
    post: 'Разместить объявление',
    login: 'Войти',
    favorites: 'Избранное',
    messages: 'Сообщения',
    recommended: 'Рекомендации для вас',
    showMore: 'Показать ещё',
    listings: 'объявлений',
    home: 'Главная',
    filters: 'Фильтры',
    category: 'Категория',
    price: 'Цена, ₽',
    from: 'от',
    to: 'до',
    condition: 'Состояние',
    new: 'Новое',
    used: 'Б/у',
    seller: 'Продавец',
    anySeller: 'Любой',
    private: 'Частное лицо',
    business: 'Компания',
    reset: 'Сбросить фильтры',
    show: 'Показать',
    sortNew: 'Сначала новые',
    sortCheap: 'Сначала дешевле',
    sortExp: 'Сначала дороже',
    saveSearch: 'Сохранить поиск',
    searchSaved: 'Поиск сохранён',
    allListings: 'Все объявления',
    nothing: 'Ничего не найдено',
    nothingHint: 'Попробуйте убрать часть фильтров или изменить запрос.',
    signup: 'Регистрация',
    logIn: 'Вход',
    name: 'Имя',
    email: 'Эл. почта',
    phone: 'Телефон',
    password: 'Пароль',
    pwHint: 'Не менее 8 символов',
    accept: 'Я принимаю Условия использования и Политику конфиденциальности',
    create: 'Создать аккаунт',
    forgot: 'Забыли пароль?',
    or: 'или продолжить через',
    smsNote: 'Перед публикацией первого объявления мы подтвердим телефон по SMS.',
    posterTitle: 'Покупайте и продавайте по соседству.',
    posterBody:
      'Более 3 миллионов объявлений от людей в вашем городе. Каждое проверяет модератор перед публикацией.',
    back: 'Вернуться на MarketHub',
    loginToFav: 'Войдите, чтобы сохранять избранное',
    loginToPost: 'Войдите, чтобы разместить объявление',
    loginToMsg: 'Войдите, чтобы читать сообщения',
    welcome: 'Добро пожаловать',
    addedFav: 'Добавлено в избранное',
    removedFav: 'Удалено из избранного',
    logout: 'Выйти',
    hAgo: 'ч назад',
    dAgo: 'дн. назад',
    mo: '/мес',
    m2: '/м²',
    fromPrice: 'от ',
    allCats: 'Все категории',
    characteristics: 'Характеристики',
    description: 'Описание',
    location: 'Расположение',
    writeSeller: 'Написать продавцу',
    showPhone: 'Показать телефон',
    inFav: 'В избранном',
    addFav: 'В избранное',
    since: 'На MarketHub с',
    replies: 'Обычно отвечает в течение часа',
    verified: 'Телефон подтверждён',
    reviews: 'отзывов',
    safety: 'Не вносите предоплату. Встречайтесь в людном месте и проверяйте товар до оплаты.',
    report: 'Пожаловаться',
    views: 'просмотров',
    similar: 'Похожие объявления',
    posted: 'Размещено',
    listingNo: 'Объявление',
    yourListing: 'Это ваше объявление',
    editListing: 'Редактировать',
    newListing: 'Новое объявление',
    photos: 'Фотографии',
    photosHint: 'До 10 фото. Первое станет обложкой.',
    addPhoto: 'Добавить фото',
    title: 'Название',
    titlePh: 'Например, iPhone 13, 128 ГБ',
    descPh: 'Состояние, комплектация, причина продажи…',
    descMin: 'не менее 30 символов',
    contactWay: 'Как с вами связаться',
    viaMsg: 'Сообщения',
    viaPhone: 'Звонки',
    saveDraft: 'Сохранить черновик',
    submit: 'Отправить на проверку',
    preview: 'Предпросмотр',
    checklist: 'Перед отправкой',
    modNote: 'Каждое объявление проверяет модератор перед публикацией — обычно в течение 30 минут.',
    chooseCat: 'Выберите категорию',
    justNow: 'только что',
    draftSaved: 'Черновик сохранён',
    ckCat: 'Выбрана категория',
    ckTitle: 'Название, от 5 символов',
    ckPhoto: 'Хотя бы одно фото',
    ckDesc: 'Описание, от 30 символов',
    ckPrice: 'Указана цена',
    myListings: 'Мои объявления',
    active: 'Активные',
    inReview: 'На проверке',
    rejected: 'Отклонённые',
    archived: 'Архив',
    settings: 'Настройки',
    edit: 'Изменить',
    markSold: 'Продано',
    fix: 'Исправить и отправить',
    reasonL: 'Комментарий модератора',
    reviewEta: 'Обычно проверка занимает до 30 минут',
    sentToMod: 'Отправлено на проверку',
    movedArchive: 'Перенесено в архив',
    nothingHere: 'Здесь пока пусто',
    favEmpty: 'Нажмите на сердечко у объявления, чтобы сохранить его здесь.',
    all: 'Все',
    buying: 'Покупаю',
    selling: 'Продаю',
    typeMsg: 'Напишите сообщение…',
    send: 'Отправить',
    online: 'в сети',
    q1: 'Ещё продаётся?',
    q2: 'Какая окончательная цена?',
    q3: 'Можно посмотреть сегодня?',
    pickChat: 'Выберите чат слева',
    you: 'Вы',
    autoReply: 'Да, ещё продаётся. Когда вам удобно подъехать?',
    soonSettings: 'Настройки — в следующей итерации',
    modLabel: 'на модерацию',
    subcategory: 'Подкатегория',
    allSubs: 'Все',
    account: 'Мой профиль',
  },
}

export function blankForm(): PostForm {
  return {
    cat: '',
    sub: '',
    title: '',
    desc: '',
    price: '',
    city: 'msk',
    cond: 'used',
    photos: 0,
    viaMsg: true,
    viaPhone: false,
    editId: null,
  }
}
