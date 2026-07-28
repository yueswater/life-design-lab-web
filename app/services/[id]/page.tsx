'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

// 依據傳入的內容完全還原的詳細資料庫（包含各服務專屬圖片與配色設定）
export const SERVICES_DETAILS: Record<string, {
  id: string
  title: string
  subtitle: string
  imageSrc: string
  imageAlt: string
  introText: string
  extraNotice?: string
  structureTitle: string
  structureColumns: { col1: string; col2: string; col3?: string }
  structureData: { stage: string; content: string; duration?: string }[]
  deliverables: string[]
  pricingTitle: string
  pricingColumns: { col1: string; col2: string }
  pricingData: { label: string; detail: string }[]
}> = {
  'one-on-one': {
    id: 'one-on-one',
    title: '一對一諮詢',
    subtitle: '生命設計實驗室 • 深度專屬對話',
    imageSrc: '/services/one-on-one.jpg',
    imageAlt: '一對一生命設計諮詢情境',
    introText: '相較於其他兩種形式（工作坊或是講座），一對一的諮詢會需要學員更多心力投入，但絕對會有更值得的收穫。多數學員在一對一諮詢後，除了找到人生方向，還有開啟了整套行動計畫，改變了人生走向。',
    extraNotice: '整趟旅程需要學員主動利用工具進行觀察，並進行 3 ~ 4 次的訪談，保證旅程結束後會得到一份專屬的人生行動計畫，以及會再附贈 1 次的行動方針調整與回饋。',
    structureTitle: '諮詢架構流程',
    structureColumns: { col1: '諮詢階段', col2: '目的與核心議題', col3: '建議時長' },
    structureData: [
      { stage: '行前說明', content: '開始旅途前，先確認這套流程是否真為自己所需', duration: '10 ~ 30 分鐘' },
      { stage: '對焦', content: '充分認知目前的狀態，並且更認識自己的心之所向', duration: '1.5 - 2 小時' },
      { stage: '挖掘', content: '觀察自己，發覺自己可能的潛能與喜歡', duration: '1.5 - 2 小時' },
      { stage: '實踐', content: '考量實際狀況後（麵包與熱情），設定階段性目標與行動指南', duration: '1.5 - 2 小時' }
    ],
    deliverables: [
      '專屬人生藍圖的完整行動計畫',
      '可重複 Review 與自主維護的人生設計工具表',
      '免費 1 次的行動計畫調整回饋（諮詢後半年內有效！）'
    ],
    pricingTitle: '收費方式與方案',
    pricingColumns: { col1: '階段 / 項目', col2: '計價與包含內容' },
    pricingData: [
      { label: '行前說明', detail: '不收費\n僅收 NTD 500 元保證金，行前說明後會全額退還或折抵於之後的正式諮詢' },
      { label: '對焦 (NTD 1500元)', detail: '分次支付。內容包含：\n• 至少 5 - 6.5 小時的諮詢總時數\n• 永遠受用的生命設計工作表（基於諮詢的階段提供）\n• 免費 1 次的行動計畫調整回饋（僅限完整諮詢者）\n• 來自各領域的校友資源（僅限完整諮詢者）' },
      { label: '挖掘 (NTD 2000元)', detail: '（含於分次支付項目）' },
      { label: '實踐 (NTD 2500元)', detail: '（含於分次支付項目）' }
    ]
  },
  'workshop': {
    id: 'workshop',
    title: '工作坊 Workshop',
    subtitle: '生命設計實驗室 • 團體腦力激盪',
    imageSrc: '/services/workshop.jpg',
    imageAlt: '生命設計工作坊團體互動',
    introText: '工作坊 Workshop 大約為 3 ~ 6 人組成，可組團與朋友一起參加、也可隨機加入近期的工作坊梯次！對焦、釐清到行動計畫皆會在一天內完成，並且會在與其他學員的交流分享中得到截然不同的發展可能。整個工作坊約耗時 8 小時，保證工作坊後會得到一份專屬的人生行動計畫。',
    structureTitle: '工作坊架構',
    structureColumns: { col1: '工作坊階段', col2: '實作與交流內容' },
    structureData: [
      { stage: '課前作業', content: '工作坊前，先利用學習單觀察與釐清自己' },
      { stage: '自我介紹', content: '暖場破冰，與工作坊學員更加熟悉，有助於後續的交流深度' },
      { stage: '認識自己', content: '觀察自己，發掘自己嚮往的生活方式' },
      { stage: '潛能挖掘', content: '深挖自己的能力，列舉出所有可能的人生角色' },
      { stage: '快樂的成本', content: '考量實際狀況（麵包）結合熱愛愛好的行動方案' },
      { stage: '人生原型計畫', content: '規劃下一步的行動計劃，帶走新人生的啟動按鈕！' }
    ],
    deliverables: [
      '一起規劃人生並且相互督促的人生戰友',
      '專屬人生藍圖的完整行動計畫',
      '可重複 Review 的人生設計工具表'
    ],
    pricingTitle: '收費方式',
    pricingColumns: { col1: '工作坊人數', col2: '單人計價' },
    pricingData: [
      { label: '3 - 4 人', detail: 'NTD 2500 / 人' },
      { label: '5 - 6 人', detail: 'NTD 2000 / 人' },
      { label: '6 人以上', detail: 'NTD 1800 / 人' }
    ]
  },
  'small-group': {
    id: 'small-group',
    title: '小班制諮詢',
    subtitle: '生命設計實驗室 • 精緻小組思維衝擊',
    imageSrc: '/services/small-group.jpg',
    imageAlt: '小班制對話與反芻',
    introText: '小班制可理解為一對一諮詢與工作坊的結合，並且每個人課後會有免費的 1 小時諮詢機會。比起工作坊，小班制不需要與其他人面對面，雖然缺少了 Brainstorming 後的無限發展可能，但擁有更多的私人思考、反芻時間。也可以加上定期預約一對一的諮詢，以達到雙重效果。\n\n每班 5 ~ 10 人，可組團與朋友一起參加、也可隨機加入近期的小班級梯次！整個課程（不包含課後諮詢）約為 5 小時，保證於課後帶走永遠受用的生命設計工作表與一對一諮詢優惠！',
    structureTitle: '課程章節架構',
    structureColumns: { col1: '課程章節', col2: '核心內容', col3: '時長' },
    structureData: [
      { stage: '認識自己', content: '觀察自己，發掘自己嚮往的生活方式', duration: '1 hr' },
      { stage: '潛能挖掘', content: '深挖自己的能力，列舉出所有可能的人生角色', duration: '1.5 hr' },
      { stage: '理想與現實的權衡', content: '考量實際狀況（麵包）結合熱愛愛好的行動方案', duration: '1.5 hr' },
      { stage: '人生原型計畫', content: '規劃下一步的行動計劃，帶走新人生的啟動按鈕！', duration: '1 hr' }
    ],
    deliverables: [
      '一起規劃人生並且相互督促的人生戰友',
      '可重複 Review 的人生設計工具表',
      '每個人免費的 1 小時一對一諮詢機會',
      '課後的一對一諮詢，每小時 600 元（相當於六折優惠！）'
    ],
    pricingTitle: '收費方式',
    pricingColumns: { col1: '開班人數', col2: '單人計價' },
    pricingData: [
      { label: '5 - 6 人', detail: 'NTD 2000 / 人' },
      { label: '6 - 8 人', detail: 'NTD 1800 / 人' },
      { label: '8 人以上', detail: 'NTD 1500 / 人' }
    ]
  },
  'lecture': {
    id: 'lecture',
    title: '講座分享',
    subtitle: '生命設計實驗室 • 觀念建構與啟發',
    imageSrc: '/services/lecture.jpg',
    imageAlt: '生命設計講座現場分享',
    introText: '講座分享的參與人數不限、舉辦的時間未固定，可先報名有興趣的主題，當有相應的主題講座即將舉辦時，會寄信通知你～',
    structureTitle: '經典講座主題清單（主題陸續增加中）',
    structureColumns: { col1: '講座主題', col2: '主要內容與效益', col3: '預計時長' },
    structureData: [
      { stage: '認識生命設計', content: '生命設計如何幫助每個人重構選擇', duration: '1 hr' },
      { stage: '發掘自己的興趣', content: '如何發掘自己的熱情與潛在好奇心', duration: '1 hr' },
      { stage: '挖掘潛力', content: '如何挖掘自己不為人知的隱藏絕技！', duration: '1 hr' },
      { stage: '理想與現實的權衡', content: '不是烏托邦！如何在現實與理想中找到完美解方', duration: '1 hr' }
    ],
    deliverables: [
      '建構生命設計心法與設計思考思維',
      '獲得主題講座限定之啟發練習講義',
      '優先訂閱與通知最新講座活動資訊'
    ],
    pricingTitle: '收費方式',
    pricingColumns: { col1: '預計人數', col2: '單人票價' },
    pricingData: [
      { label: '10 人', detail: 'NTD 800 / 人' },
      { label: '11 ~ 20 人', detail: 'NTD 700 / 人' },
      { label: '21 ~ 30 人', detail: 'NTD 600 / 人' },
      { label: '30 人以上', detail: 'NTD 500 / 人' }
    ]
  }
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const data = SERVICES_DETAILS[id]

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">找不到該服務頁面</h2>
          <p className="text-slate-500">請確認網址是否正確。</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-amber-400 text-amber-950 font-bold px-5 py-2.5 rounded-lg hover:bg-amber-500 transition shadow-sm"
          >
            返回首頁
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* 1. 頂部導覽列 */}
        <div className="flex justify-between items-center">
          <Link 
            href="/#services" 
            className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-amber-600 transition tracking-wide group"
          >
            <span className="group-hover:-translate-x-1 transition-transform mr-1.5">←</span> 返回首頁服務總覽
          </Link>
          <span className="text-xs font-bold text-amber-950 bg-amber-200/80 px-3.5 py-1 rounded-full tracking-wider uppercase">
            {data.subtitle}
          </span>
        </div>

        {/* 2. 主視覺首圖 + 服務標題與簡介 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* 主視覺照片區域 */}
          <div className="relative w-full h-64 md:h-80 bg-gradient-to-r from-amber-200 to-sky-200 flex items-center justify-center">
            <Image
              src={data.imageSrc}
              alt={data.imageAlt}
              fill
              className="object-cover"
              onError={(e) => {
                // 若圖片載入失敗時自動隱藏，顯示優雅背景
                e.currentTarget.style.display = 'none'
              }}
              priority
            />
            {/* 圖片上方暗色漸層層，提升文字閱讀舒適度 */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 drop-shadow">
                Life Design Service
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">
                {data.title}
              </h1>
            </div>
          </div>

          {/* 簡介文字區塊 */}
          <div className="p-8 md:p-10 space-y-6">
            <p className="text-slate-700 text-base md:text-lg leading-relaxed font-normal tracking-wide whitespace-pre-line">
              {data.introText}
            </p>

            {data.extraNotice && (
              <div className="p-5 bg-amber-50/90 border-l-4 border-amber-400 rounded-r-xl text-slate-800 text-sm md:text-base leading-relaxed font-medium">
                💡 <span className="font-bold text-slate-900">課前提醒與專屬回饋：</span> {data.extraNotice}
              </div>
            )}
          </div>
        </section>

        {/* 3. 服務架構與內容流程 */}
        <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
              Structure
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight border-l-4 border-amber-400 pl-3">
              {data.structureTitle}
            </h2>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden text-sm md:text-base">
              <thead>
                <tr className="bg-amber-100/90 text-amber-950 font-bold tracking-wide">
                  <th className="p-4 border-b border-slate-200 w-1/4">{data.structureColumns.col1}</th>
                  <th className="p-4 border-b border-slate-200">{data.structureColumns.col2}</th>
                  {data.structureColumns.col3 && (
                    <th className="p-4 border-b border-slate-200 w-1/4">{data.structureColumns.col3}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.structureData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap">{row.stage}</td>
                    <td className="p-4 text-slate-700 leading-relaxed">{row.content}</td>
                    {row.duration && (
                      <td className="p-4 text-slate-600 font-medium whitespace-nowrap">{row.duration}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. 旅程結束後，你會得到 */}
        <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight border-l-4 border-amber-400 pl-3">
            旅程結束後，你會得到
          </h2>

          <ul className="space-y-3 pt-2">
            {data.deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-slate-700 text-base md:text-lg leading-relaxed font-normal">
                <span className="text-amber-500 font-bold text-lg select-none">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. 收費方式 */}
        <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
              Pricing
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight border-l-4 border-amber-400 pl-3">
              {data.pricingTitle}
            </h2>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden text-sm md:text-base">
              <thead>
                <tr className="bg-amber-100/90 text-amber-950 font-bold tracking-wide">
                  <th className="p-4 border-b border-slate-200 w-1/3">{data.pricingColumns.col1}</th>
                  <th className="p-4 border-b border-slate-200">{data.pricingColumns.col2}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.pricingData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap align-top">{row.label}</td>
                    <td className="p-4 text-slate-700 whitespace-pre-line leading-relaxed">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. 底部預約行動呼籲 CTA 區塊 */}
        <section className="bg-amber-100/90 border-l-4 border-amber-400 p-8 md:p-10 rounded-r-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              想知道哪一個方案最適合你嗎？
            </h3>
            <p className="text-slate-700 text-sm md:text-base font-medium">
              歡迎先預約 30 分鐘免費諮詢與聊聊，我們一起釐清方向！
            </p>
          </div>
          <Link 
            href="/#booking"
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-7 py-3.5 rounded-xl shadow-sm transition whitespace-nowrap text-base"
          >
            免費預約 30mins 諮詢 →
          </Link>
        </section>

      </div>
    </main>
  )
}