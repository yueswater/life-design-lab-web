import { ModuleItem } from '../types';

export const modulesData: ModuleItem[] = [
  {
    id: 'one-on-one',
    iconKey: 'one-on-one',
    title: {
      zh: '一對一諮詢 | 生命設計實驗室',
      en: '1-on-1 Coaching | Life Design Lab',
    },
    subtitle: {
      zh: '專屬一對一陪伴與深度對談',
      en: 'Dedicated one-on-one, in-depth conversations',
    },
    target: {
      zh: '喜歡專屬對談且願意投入較多心力的人！（線上、實體皆可）',
      en: 'For people who want focused, dedicated conversations and are ready to invest deeply. (Online or in person)',
    },
    description: {
      zh: '專屬一對一深度引導，透過設計思考架構拆解個人職涯卡關與轉職迷惘，陪伴你梳理價值觀排序與打造專屬的奧德賽人生原型。',
      en: 'Deep, dedicated guidance that uses a design-thinking framework to unpack your career sticking points and job-change uncertainty — helping you rank your values and build your own Odyssey Life Plan.',
    },
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
    badge: '1-on-1 Coaching',
    format: {
      zh: '線上視訊 / 實體一對一對談',
      en: 'Video call or in-person, one-on-one',
    },
    duration: {
      zh: '60 - 90 分鐘 / 次',
      en: '60–90 minutes per session',
    },
    features: {
      zh: [
        '100% 個人化職涯與人生瓶頸梳理',
        '奧德賽之旅 (Odyssey Plans) 原型設計',
        '專屬價值觀與影響力指引盤點',
        '隱密安全的對談氛圍與後續追蹤',
      ],
      en: [
        '100% personalized career and life-bottleneck mapping',
        'Odyssey Plans prototyping',
        'A dedicated audit of your values and influences',
        'A private, safe space with follow-up support',
      ],
    },
  },
  {
    id: 'workshop',
    iconKey: 'workshop',
    title: {
      zh: '工作坊 Workshop | 生命設計實驗室',
      en: 'Workshop | Life Design Lab',
    },
    subtitle: {
      zh: '實體互動與腦力激盪實作',
      en: 'Hands-on, in-person brainstorming',
    },
    target: {
      zh: '喜歡與人接觸分享、享受 Brainstorming 的人 (實體為主)',
      en: 'For people who enjoy connecting with others and love brainstorming. (Mostly in person)',
    },
    description: {
      zh: '親動手實作生命手札、好時光能量日誌分析，與跨領域夥伴一起進行小組腦力激盪 (Brainstorming) 與實體原型測試！',
      en: 'Get hands-on with life journaling and Good Time Journal analysis, then brainstorm and prototype together with cross-disciplinary peers.',
    },
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    badge: 'Interactive Workshop',
    format: {
      zh: '實體工作坊 (台北/台中)',
      en: 'In-person workshop (Taipei / Taichung)',
    },
    duration: {
      zh: '半天 3 小時 / 全天 6 小時',
      en: 'Half-day (3 hrs) or full-day (6 hrs)',
    },
    features: {
      zh: [
        '跨領域夥伴激盪多元創意視野',
        '好時光能量日誌分析與診斷',
        '現場教練即時反饋與原型修正',
      ],
      en: [
        'Cross-disciplinary peers spark diverse ideas',
        'Good Time Journal analysis and diagnosis',
        'Live coach feedback and prototype iteration',
      ],
    },
  },
  {
    id: 'small-class',
    iconKey: 'small-class',
    title: {
      zh: '小班制諮詢 | 生命設計實驗室',
      en: 'Small Group Class | Life Design Lab',
    },
    subtitle: {
      zh: '精緻 4-6 人線上深度陪伴',
      en: 'An intimate, 4–6 person online cohort',
    },
    target: {
      zh: '喜歡默默輸入知識、享受個人思考空間的人 (線上為主)',
      en: 'For people who like to absorb quietly and value personal thinking space. (Mostly online)',
    },
    description: {
      zh: '系統化 4 堂線上精緻小班課程，在溫馨且保有適度個人思考空間的環境中，逐步完成個人生命設計藍圖與同儕作業互動。',
      en: 'A structured 4-session online course in a warm, small-group setting that still leaves room to think — you\'ll build your own life-design blueprint alongside peer feedback.',
    },
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    badge: 'Small Group Class',
    format: {
      zh: '線上直播會議 (4-6人小班)',
      en: 'Live online sessions (groups of 4–6)',
    },
    duration: {
      zh: '共 4 堂課 (每堂 2 小時)',
      en: '4 sessions total (2 hrs each)',
    },
    features: {
      zh: [
        '精緻小班制確保每位學員被充分聆聽',
        '每週作業講評與個別實作指導',
        '系統化設計思考學習講義與模組',
        '專屬學員社群持續相互支持',
      ],
      en: [
        'A small cohort so every voice is genuinely heard',
        'Weekly assignment review and individual guidance',
        'Structured design-thinking course materials',
        'An ongoing peer community for support',
      ],
    },
  },
  {
    id: 'keynote',
    iconKey: 'keynote',
    title: {
      zh: '講座分享 | 生命設計實驗室',
      en: 'Keynote & Talk | Life Design Lab',
    },
    subtitle: {
      zh: '60-90分鐘觀念啟發與案例解密',
      en: 'A 60–90 minute talk with real case studies',
    },
    target: {
      zh: '想了解生命設計、短期內抽不出時間的人 (線上、實體皆可)',
      en: 'For people curious about life design but short on time right now. (Online or in person)',
    },
    description: {
      zh: '擺脫罐頭人生！精華講座為你揭密設計思考應用於生命的關鍵心態，並透過真實轉職突破案例，為你點燃理想人生的第一步。',
      en: 'Break free from the cookie-cutter life. This talk unpacks the mindset shifts behind applying design thinking to your own life, backed by real career-change stories, to spark your first step forward.',
    },
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
    badge: 'Keynote & Talk',
    format: {
      zh: '線上主題直播 / 企業學校實體講座',
      en: 'Live online stream or on-site for companies/schools',
    },
    duration: {
      zh: '60 - 90 分鐘精華分享',
      en: '60–90 minute session',
    },
    features: {
      zh: [
        '生命設計核心五大關鍵心態拆解',
        '擺脫罐頭人生的思維轉變脈絡',
        '真實學員跨界轉職與勇敢突破案例',
        '現場 Q&A 問答互動與觀念指引',
      ],
      en: [
        'The 5 core mindsets behind life design, unpacked',
        'How to shift out of a "default" life',
        'Real stories of career pivots and breakthroughs',
        'Live Q&A and guided takeaways',
      ],
    },
  },
];
