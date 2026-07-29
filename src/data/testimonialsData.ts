import { Localized } from '../types';

export interface TestimonialItem {
  id: string;
  quote: Localized;
  author: string;
  authorTitle: Localized;
  originalRole: Localized;
  tag: Localized;
  imageUrl: string;
  featured?: boolean;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'shawn',
    quote: {
      zh: '如果我沒有跟你聊過，我現在應該還在看不到前方的教職體系裡掙扎；真的很感謝你讓我成為工程師！',
      en: 'If I hadn\'t talked to you, I\'d probably still be stuck in the teaching system with no way forward. I\'m so grateful you helped me become an engineer!',
    },
    author: 'Shawn',
    authorTitle: {
      zh: '現為上市櫃公司伺服器 RD 工程師',
      en: 'Now a server R&D engineer at a listed company',
    },
    originalRole: {
      zh: '原高中/國中數學老師',
      en: 'Former high school / middle school math teacher',
    },
    tag: {
      zh: '教職轉職工程師',
      en: 'Teacher to engineer',
    },
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    featured: true,
  },
  {
    id: 'wu',
    quote: {
      zh: '你有一種想讓人問問題的魔力！謝謝這場工作坊，讓原本在十字路口猶豫不決的我，有滿滿的勇氣踏出這一步！',
      en: 'You have this magic that makes people want to ask questions! Thanks to this workshop, I finally had the courage to take the step I\'d been hesitating on at my crossroads.',
    },
    author: 'Wu',
    authorTitle: {
      zh: '目前正在念頂大理工研究所',
      en: 'Now a graduate student in engineering at a top university',
    },
    originalRole: {
      zh: '原花蓮文組公務員',
      en: 'Former civil servant (humanities track) in Hualien',
    },
    tag: {
      zh: '公務員考取理工頂大碩士',
      en: 'Civil servant to top-university grad school',
    },
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'lin',
    quote: {
      zh: '透過生命設計的框架重新梳理價值觀，我才發現自己不是不努力，而是走錯了賽道。現在每天上班都有明確的目標與熱情！',
      en: 'Rethinking my values through the life-design framework, I realized I wasn\'t lacking effort — I was just on the wrong track. Now I go to work every day with real purpose and energy.',
    },
    author: 'Lin',
    authorTitle: {
      zh: '現為知名外商科技公司 Product Manager',
      en: 'Now a Product Manager at a global tech company',
    },
    originalRole: {
      zh: '原傳統製造業行銷專員',
      en: 'Former marketing specialist in traditional manufacturing',
    },
    tag: {
      zh: '傳產跨國轉戰外商 PM',
      en: 'Manufacturing to global-firm PM',
    },
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'chen',
    quote: {
      zh: '這是我聽過最接地氣的生命設計分享！原本被業績指標壓得喘不過氣，現在終於打造出符合自己步調的奧德賽原型方案。',
      en: 'This is the most down-to-earth take on life design I\'ve ever heard. I used to be crushed by sales targets — now I\'ve finally built an Odyssey Plan that fits my own pace.',
    },
    author: 'Chen',
    authorTitle: {
      zh: '現為獨立設計思考教練與自由職業者',
      en: 'Now an independent design-thinking coach and freelancer',
    },
    originalRole: {
      zh: '原銀行理財專員',
      en: 'Former bank wealth management specialist',
    },
    tag: {
      zh: '體制內解放成為自由工作者',
      en: 'Corporate life to freelance freedom',
    },
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  },
];
