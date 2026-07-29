import { useLanguage } from './LanguageContext';

export interface Strings {
  nav: {
    modules: string;
    testimonials: string;
    about: string;
    tryFree: string;
    langToggle: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    cta: string;
  };
  testimonials: {
    eyebrow: string;
    titlePre: string;
    titleAccent: string;
    ratingBadge: string;
  };
  modules: {
    eyebrow: string;
    titlePre: string;
    titleAccent: string;
    bookCta: string;
    detailsCta: string;
    hint: string;
  };
  moduleModal: {
    target: string;
    format: string;
    duration: string;
    features: string;
    close: string;
    bookViaEmail: string;
    mailSubject: string;
    bookingTitle: string;
    bookingIntro: string;
    contactPlatform: string;
    contactDetailLabel: (platformLabel: string) => string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    dateLabel: string;
    slotLabel: string;
    slotsLoading: string;
    notesLabel: string;
    notesPlaceholder: string;
    cancel: string;
    submitting: string;
    submit: string;
    phoneError: string;
    lineError: string;
    emailError: string;
    missingFields: string;
    calendarLocale: string;
  };
  about: {
    eyebrow: string;
    role: string;
    cta: string;
    quoteLine1: string;
    quoteLine2: string;
  };
  footer: {
    brandName: string;
    copyright: (year: number) => string;
    privacy: string;
    terms: string;
  };
  legal: {
    backHome: string;
    tableOfContents: string;
    loading: string;
    loadError: string;
  };
  booking: {
    eyebrow: string;
    title: string;
    subtitle: string;
    selectModule: string;
    formIntro: (moduleTitle: string) => string;
    changeModule: string;
    submit: string;
  };
  toast: {
    bookingSuccess: (title: string) => string;
  };
  api: {
    slotsFetchFailed: string;
    slotTaken: string;
    submitFailed: string;
  };
}

const strings: Record<'zh' | 'en', Strings> = {
  zh: {
    nav: {
      modules: '核心模組',
      testimonials: '學員評價',
      about: '關於 Min',
      tryFree: '免費預約',
      langToggle: 'EN',
    },
    hero: {
      eyebrow: 'Life Design Lab',
      titleLine1: '設計專屬你的',
      titleLine2: '人生劇本',
      cta: '免費預約 30 分鐘',
    },
    testimonials: {
      eyebrow: '真實學員改變見證',
      titlePre: '他們已經改寫了',
      titleAccent: '自己的劇本',
      ratingBadge: '100% 真實轉職與人生蛻變',
    },
    modules: {
      eyebrow: '核心服務模組',
      titlePre: '選擇適合你的',
      titleAccent: '生命設計方案',
      bookCta: '立即預約諮詢',
      detailsCta: '詳細介紹',
      hint: '可使用滑鼠滾輪上下滑動，或以鍵盤 ← → 操作',
    },
    moduleModal: {
      target: '適合對象：',
      format: '進行方式：',
      duration: '預計時長：',
      features: '核心體驗與方案特色',
      close: '關閉',
      bookViaEmail: '立即預約專屬諮詢',
      mailSubject: '預約諮詢：',
      bookingTitle: '預約：',
      bookingIntro: '選擇方便的聯絡方式與時段，我們會依此與您確認諮詢細節。',
      contactPlatform: '慣用聯絡方式',
      contactDetailLabel: (platformLabel: string) => `${platformLabel}聯絡資訊`,
      nameLabel: '姓名 / 暱稱',
      namePlaceholder: '例如：Min / Alex',
      emailLabel: '常用 Email',
      emailPlaceholder: 'yourname@example.com',
      dateLabel: '選擇日期',
      slotLabel: '選擇時段',
      slotsLoading: '載入可預約時段中...',
      notesLabel: '目前的職涯或人生卡關 (選填)',
      notesPlaceholder: '簡單敘述您目前面臨的挑戰或期待改善的部分...',
      cancel: '取消',
      submitting: '送出中...',
      submit: '確認送出預約',
      phoneError: '請輸入正確的手機號碼格式（09xx-xxx-xxx）',
      lineError: '僅能輸入英文字母與數字',
      emailError: '請輸入正確的 Email 格式',
      missingFields: '請完整填寫必填欄位再送出',
      calendarLocale: 'zh-TW',
    },
    about: {
      eyebrow: 'About Min',
      role: '生命設計教練 ・ 設計思考引導者',
      cta: '免費預約 30 分鐘',
      quoteLine1: '生命不是拿來被決定的，',
      quoteLine2: '而是拿來設計的。',
    },
    footer: {
      brandName: '生命設計實驗室 Life Design Lab',
      copyright: (year: number) => `© ${year} Life Design Lab. All rights reserved.`,
      privacy: '隱私權政策',
      terms: '服務條款',
    },
    legal: {
      backHome: '返回首頁',
      tableOfContents: '目錄',
      loading: '文件載入中...',
      loadError: '文件載入失敗，請稍後再試。',
    },
    booking: {
      eyebrow: '免費預約諮詢',
      title: '選擇適合你的方案，開始預約',
      subtitle: '先選擇想預約的服務項目，再填寫聯絡方式與時段，我們會盡快與您確認細節。',
      selectModule: '選擇服務項目',
      formIntro: (moduleTitle: string) => `正在預約：${moduleTitle}`,
      changeModule: '重新選擇',
      submit: '確認送出預約',
    },
    toast: {
      bookingSuccess: (title: string) => `已收到您對「${title}」的預約，我們將盡快與您聯繫！`,
    },
    api: {
      slotsFetchFailed: '無法取得該日期的可預約時段，請稍後再試。',
      slotTaken: '這個時段剛被別人預約走了，換一個時段試試。',
      submitFailed: '預約送出失敗，請稍後再試。',
    },
  },
  en: {
    nav: {
      modules: 'Modules',
      testimonials: 'Testimonials',
      about: 'About Min',
      tryFree: 'Book Free Call',
      langToggle: '中',
    },
    hero: {
      eyebrow: 'Life Design Lab',
      titleLine1: 'Design the script',
      titleLine2: 'for your own life',
      cta: 'Book a Free 30-min Call',
    },
    testimonials: {
      eyebrow: 'Real stories from real students',
      titlePre: 'They\'ve already rewritten ',
      titleAccent: 'their own story',
      ratingBadge: '100% real career and life transformations',
    },
    modules: {
      eyebrow: 'Core Programs',
      titlePre: 'Find the ',
      titleAccent: 'life design plan for you',
      bookCta: 'Book a Consultation',
      detailsCta: 'Learn More',
      hint: 'Scroll to move, or use the ← → arrow keys',
    },
    moduleModal: {
      target: 'Best for:',
      format: 'Format:',
      duration: 'Duration:',
      features: 'What you get',
      close: 'Close',
      bookViaEmail: 'Book a Consultation',
      mailSubject: 'Consultation booking: ',
      bookingTitle: 'Book: ',
      bookingIntro: 'Pick a contact method and time slot, and we\'ll confirm the details with you.',
      contactPlatform: 'Preferred contact',
      contactDetailLabel: (platformLabel: string) => `${platformLabel} details`,
      nameLabel: 'Name / Nickname',
      namePlaceholder: 'e.g. Min / Alex',
      emailLabel: 'Email address',
      emailPlaceholder: 'yourname@example.com',
      dateLabel: 'Select a date',
      slotLabel: 'Select a time slot',
      slotsLoading: 'Loading available slots...',
      notesLabel: 'What are you working through right now? (optional)',
      notesPlaceholder: 'Briefly describe what you\'re facing or hoping to improve...',
      cancel: 'Cancel',
      submitting: 'Submitting...',
      submit: 'Confirm Booking',
      phoneError: 'Enter a valid mobile number (09xx-xxx-xxx)',
      lineError: 'Letters and numbers only',
      emailError: 'Enter a valid email address',
      missingFields: 'Please fill in all required fields before submitting',
      calendarLocale: 'en-US',
    },
    about: {
      eyebrow: 'About Min',
      role: 'Life Design Coach · Design Thinking Facilitator',
      cta: 'Book a Free 30-min Call',
      quoteLine1: 'Life isn\'t meant to be decided for you —',
      quoteLine2: 'it\'s meant to be designed by you.',
    },
    footer: {
      brandName: 'Life Design Lab',
      copyright: (year: number) => `© ${year} Life Design Lab. All rights reserved.`,
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    legal: {
      backHome: 'Back to home',
      tableOfContents: 'Contents',
      loading: 'Loading document...',
      loadError: 'Could not load this document. Please try again.',
    },
    booking: {
      eyebrow: 'Book a Free Consultation',
      title: 'Pick a plan and book your time',
      subtitle:
        'Choose the service you want first, then share your contact details and preferred time — we\'ll confirm the details with you soon.',
      selectModule: 'Select a Service',
      formIntro: (moduleTitle: string) => `Booking: ${moduleTitle}`,
      changeModule: 'Choose a different service',
      submit: 'Confirm Booking',
    },
    toast: {
      bookingSuccess: (title: string) =>
        `We've received your booking for "${title}" — we'll be in touch soon!`,
    },
    api: {
      slotsFetchFailed: 'Could not load available slots for that date. Please try again.',
      slotTaken: 'That slot was just booked by someone else — please pick another time.',
      submitFailed: 'Could not submit your booking. Please try again.',
    },
  },
};

export function useTranslation(): Strings {
  const { lang } = useLanguage();
  return strings[lang];
}

export function getStrings(lang: 'zh' | 'en'): Strings {
  return strings[lang];
}
