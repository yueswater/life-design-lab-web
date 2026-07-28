'use client'

import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

// 預設可供選擇的諮詢時段
const TIME_SLOTS = [
  '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
]

// 服務模組資料（包含明確的 id 與 url 供 Link 標籤跳轉）
const SERVICES = [
  {
    id: 'one-on-one',
    url: '/services/one-on-one',
    title: '一對一諮詢',
    subtitle: '生命設計實驗室',
    desc: '適合喜歡專屬對話、希望能針對個人現狀深入探討與拆解的人。（線上 / 面談）',
    tag: '一對一深度溝通',
    headerBg: 'bg-amber-400',
    headerText: 'text-amber-950',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-900'
  },
  {
    id: 'workshop',
    url: '/services/workshop',
    title: '工作坊 Workshop',
    subtitle: '生命設計實驗室',
    desc: '適合喜歡與人接觸分享、享受 Brainstorming 腦力激盪與團體動能的人。',
    tag: '互動體驗與實作',
    headerBg: 'bg-amber-400',
    headerText: 'text-amber-950',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-900'
  },
  {
    id: 'small-group',
    url: '/services/small-group',
    title: '小班制諮詢',
    subtitle: '生命設計實驗室',
    desc: '適合喜歡默默吸收知識、享受個人思考空間但又能獲得方向指引的人。',
    tag: '精緻小組交流',
    headerBg: 'bg-amber-400',
    headerText: 'text-amber-950',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-900'
  },
  {
    id: 'lecture',
    url: '/services/lecture',
    title: '講座分享',
    subtitle: '生命設計實驗室',
    desc: '想快速了解生命設計概念、短期內抽不出時間參與完整課程與諮詢的人。',
    tag: '觀念建立與啟發',
    headerBg: 'bg-amber-400',
    headerText: 'text-amber-950',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-900'
  }
]

export default function Home() {
  // 文章狀態
  const [posts, setPosts] = useState<any[]>([])
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true)

  // 預約與日曆狀態
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([]) // 存放已預約時段

  // 表單狀態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPlatform: 'Line ID', // 預設 Line ID
    contactDetail: '',         // 對應帳號或連結
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitMessage, setSubmitMessage] = useState<string>('')

  // 1. 頁面載入時：從 Supabase 抓取部落格文章
  useEffect(() => {
    fetchPosts()
  }, [])

  // 2. 當選擇的日期變更時，自動查詢該日期的已預約時段
  useEffect(() => {
    fetchBookedSlots(selectedDate)
    setSelectedSlot('') // 切換日期時，重置選取的時段
  }, [selectedDate])

  async function fetchPosts() {
    try {
      setLoadingPosts(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err: any) {
      console.error('抓取文章失敗:', err.message)
    } finally {
      setLoadingPosts(false)
    }
  }

  // 查詢當日已預約的時段
  async function fetchBookedSlots(date: Date) {
    try {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      // 搜尋符合當天日期的預約紀錄
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date')
        .gte('appointment_date', `${dateStr}T00:00:00`)
        .lte('appointment_date', `${dateStr}T23:59:59`)
        .neq('status', 'cancelled')

      if (error) throw error

      if (data) {
        const slots = data.map((item) => {
          const bookedDate = new Date(item.appointment_date)
          const hours = String(bookedDate.getHours()).padStart(2, '0')
          const minutes = String(bookedDate.getMinutes()).padStart(2, '0')
          return `${hours}:${minutes}`
        })
        setBookedSlots(slots)
      }
    } catch (err: any) {
      console.error('撈取預約時段失敗:', err.message)
    }
  }

  // 3. 處理預約表單送出
  async function handleSubmitAppointment(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    if (!selectedSlot) {
      setSubmitMessage('❌ 請先點選預約時間！')
      setIsSubmitting(false)
      return
    }

    try {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')

      const localIsoString = `${year}-${month}-${day}T${selectedSlot}:00`
      const appointmentIsoDate = new Date(localIsoString).toISOString()

      // 防重複預約檢查
      const { data: existingBookings, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', appointmentIsoDate)
        .neq('status', 'cancelled')

      if (checkError) throw checkError

      if (existingBookings && existingBookings.length > 0) {
        setSubmitMessage('⚠️ 該時段剛好已被他人預約，請選擇其他時段！')
        fetchBookedSlots(selectedDate)
        setIsSubmitting(false)
        return
      }

      const contactInfo = `[${formData.contactPlatform}] ${formData.contactDetail}`

      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            client_name: formData.name,
            client_email: formData.email,
            appointment_date: appointmentIsoDate,
            contact: contactInfo,
            message: formData.notes,
            status: 'pending'
          }
        ])

      if (error) throw error

      setSubmitMessage('🎉 預約成功！我們將會透過您提供的聯絡方式與您確認時間。')

      setFormData({
        name: '',
        email: '',
        contactPlatform: 'Line ID',
        contactDetail: '',
        notes: ''
      })
      setSelectedSlot('')
      fetchBookedSlots(selectedDate)
    } catch (err: any) {
      setSubmitMessage(`❌ 預約失敗: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPlaceholder = () => {
    switch (formData.contactPlatform) {
      case 'Line ID':
        return '例如：jasmine_line_id'
      case 'IG 帳號':
        return '例如：@jasmine_life'
      case 'FB 連結':
        return '例如：https://facebook.com/your.profile'
      default:
        return '請輸入聯絡帳號或連結'
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-16">
      <div className="max-w-5xl mx-auto space-y-20">

        {/* 頁首 Header */}
        <header className="flex justify-between items-center border-b pb-4 border-slate-200 sticky top-0 bg-slate-50/90 backdrop-blur z-50">
          <h1 className="text-2xl font-bold tracking-wide text-slate-900">
            Life Design Lab
          </h1>
          <nav className="space-x-4 md:space-x-6 text-sm font-medium text-slate-600">
            <a href="#intro" className="hover:text-amber-600 transition">什麼是生命設計</a>
            <a href="#services" className="hover:text-amber-600 transition">服務內容</a>
            <a href="#blog" className="hover:text-amber-600 transition">文章專欄</a>
            <a href="#booking" className="bg-amber-300 hover:bg-amber-500 text-amber-950 font-bold px-3.5 py-1.5 rounded-lg transition shadow-sm">
              免費 30mins 諮詢
            </a>
            <a href="#about" className="hover:text-amber-600 transition">關於我</a>
          </nav>
        </header>

        {/* 1. 什麼是生命設計 Introduction 區塊 */}
        <section id="intro" className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 space-y-8">
          <div className="space-y-4">
            <span className="text-amber-900 font-bold text-sm uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">
              Introduction
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-relaxed">
              生命設計實驗室 <span className="text-slate-900 underline decoration-amber-400 decoration-4">Life Design Lab</span>
            </h2>
            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
              生命設計（Life Design），是把自己的生命當作一個待解決的<b className="text-slate-900">「設計問題」</b>，透過<b className="text-slate-900">設計思考 (Design Thinking)</b> 的方法拆解適合自己的生活方式。
            </p>

            <div className="bg-amber-100/80 border-l-4 border-amber-400 p-5 rounded-r-xl text-slate-900 text-sm md:text-base leading-relaxed">
              如果不設計自己的人生，<b className="text-slate-900 bg-amber-200 px-1">我們只能接受這個社會標準化的各種生命模型</b>，只能過著在社會架上的罐頭人生。但是，每個人都是獨立又特別的個體，將標準化的方式直接套用總是會感覺不舒適、不順暢。因此，我結合了多本書籍，統整了各種方法論，建立了一套<b className="text-slate-900 bg-amber-200 px-1">專屬的生命設計流程</b>，這套架構也已經幫助了許多人找到生命方向，開始掌舵並啟動自己喜歡的人生！
            </div>
          </div>

          {/* 學員真實評價與見證 Testimonials */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">學員體驗分享</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-2">
                <p className="text-xs text-slate-500 font-medium">一對一諮詢後，原為數學老師的 Shawn 說：</p>
                <blockquote className="text-sm text-slate-800 font-semibold italic border-l-2 border-amber-400 pl-3 my-2">
                  「如果我沒有跟你聊過，我現在應該還在看不到前方的教職體系裡掙扎；真的很感謝你讓我成為工程師！」
                </blockquote>
                <p className="text-xs text-slate-900 font-bold text-right">— 現為上市櫃公司的伺服器 RD 工程師 Shawn</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-2">
                <p className="text-xs text-slate-500 font-medium">生命設計工作坊後，原本在花蓮當文組公務員的 Wu：</p>
                <blockquote className="text-sm text-slate-800 font-semibold italic border-l-2 border-amber-400 pl-3 my-2">
                  「你有一種想讓人問問題的魔力！謝謝這場工作坊，讓原本在十字路口猶豫不決的我，有滿滿的勇氣踏出這一步！」
                </blockquote>
                <p className="text-xs text-slate-900 font-bold text-right">— 目前正在念頂大理工研究所的 Wu</p>
              </div>
            </div>

            <p className="text-center text-slate-700 text-sm pt-2 font-medium">
              如果你也在迷惘、或只是有一點點的不確定，都歡迎來找我聊聊！<br className="hidden md:inline" />
              <span className="text-slate-900 font-bold bg-amber-100 px-2.5 py-1 rounded mt-1 inline-block">
                我們一起找出最適合你的生活方式、設計出你的最佳人生藍圖！
              </span>
            </p>
          </div>
        </section>

        {/* 2. 服務內容 Module 區塊 */}
        <section id="services" className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-amber-900 font-bold text-sm uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                Services
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 border-l-4 border-amber-400 pl-3">
                服務內容介紹
              </h3>
            </div>
            <p className="text-slate-500 text-sm hidden md:block">
              點擊卡片查看詳細內容介紹
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* 點擊標頭直接跳轉 */}
                  <Link href={item.url} className="block group">
                    <div className="h-24 bg-amber-200 p-4 flex flex-col justify-end text-amber-950 group-hover:bg-amber-500 transition cursor-pointer">
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                        {item.subtitle}
                      </span>
                      <h4 className="text-lg font-bold">
                        {item.title} →
                      </h4>
                    </div>
                  </Link>

                  <div className="p-5 space-y-3">
                    <span className={`inline-block text-xs font-bold ${item.tagBg} ${item.tagText} px-2.5 py-1 rounded-md`}>
                      {item.tag}
                    </span>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  {/* 按鈕 1：查看詳細介紹 (跳轉至專屬頁面) */}
                  <Link
                    href={item.url}
                    className="block text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-lg transition cursor-pointer"
                  >
                    查看詳細介紹
                  </Link>

                  {/* 按鈕 2：免費預約 (移動至本頁預約表單) */}
                  <a
                    href="#booking"
                    className="block text-center text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 py-2 rounded-lg transition shadow-sm"
                  >
                    免費預約了解
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 最新文章區塊 */}
        <section id="blog" className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 border-l-4 border-amber-400 pl-3">
            最新文章
          </h3>

          {loadingPosts ? (
            <p className="text-slate-400">文章載入中...</p>
          ) : posts.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-500">
              目前還沒有發佈的文章。
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-3 hover:border-sky-300 transition">
                  <h4 className="text-xl font-bold text-slate-900">{post.title}</h4>
                  <p className="text-slate-600 text-sm line-clamp-3">{post.content}</p>
                  <span className="text-xs text-slate-400 block">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 4. 免費預約區塊 */}
        <section id="booking" className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border-2 border-amber-300 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-amber-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                FREE 30 MINS
              </span>
              <span className="text-slate-900 font-bold text-sm bg-amber-100 px-2 py-0.5 rounded">先聊聊，再決定</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              免費預約 30 分鐘服務體驗與諮詢
            </h3>

            <p className="text-slate-600 text-sm md:text-base">
              不確定哪種方案適合你？先預約 30 分鐘線上聊聊，快速釐清現狀與需求，再決定是否繼續！
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600 font-semibold">
              <div className="flex items-center space-x-1.5">
                <span className="text-sky-500 font-bold">✓</span>
                <span>100% 免費不收取任何費用</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sky-500 font-bold">✓</span>
                <span>零壓力聊天，無強迫推銷</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sky-500 font-bold">✓</span>
                <span>一對一線上交流，完全保密</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">

            {/* 左側：日曆與時段選擇 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">1. 選擇日期</label>
                <div className="flex justify-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <Calendar
                    onChange={(val) => setSelectedDate(val as Date)}
                    value={selectedDate}
                    minDate={new Date()}
                    locale="zh-TW"
                    className="rounded-lg border-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  2. 選擇時間（{selectedDate.toLocaleDateString('zh-TW')}）
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot)
                    const isSelected = selectedSlot === slot

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${isBooked
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-sky-500 text-white shadow-md font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                          }`}
                      >
                        {slot} {isBooked ? '(滿)' : ''}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 右側：個人資料與聯絡管道 */}
            <form onSubmit={handleSubmitAppointment} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900">3. 填寫預約資料</label>

                <div className="p-3 bg-amber-100/80 border border-amber-200 rounded-lg text-slate-900 text-sm">
                  預約時間：<span className="font-bold">{selectedDate.toLocaleDateString('zh-TW')}</span>
                  {selectedSlot ? (
                    <span className="font-bold text-amber-950 bg-amber-300 px-2 py-0.5 rounded ml-2">{selectedSlot} (30 mins)</span>
                  ) : (
                    <span className="text-slate-400 ml-2">(請先於左側點選時段)</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">姓名 / 稱呼</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    placeholder="例如：Jasmine"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email 信箱</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">聯絡管道</label>
                    <select
                      value={formData.contactPlatform}
                      onChange={(e) => setFormData({ ...formData, contactPlatform: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm bg-white"
                    >
                      <option value="Line ID">Line ID</option>
                      <option value="IG 帳號">IG 帳號</option>
                      <option value="FB 連結">FB 連結</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {formData.contactPlatform}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactDetail}
                      onChange={(e) => setFormData({ ...formData, contactDetail: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                      placeholder={getPlaceholder()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">你想討論或了解的主題（選填）</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    placeholder="例如：想了解一對一諮詢流程、目前遇到職涯瓶頸...（方便我提前準備）"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSlot}
                  className="w-full bg-amber-400 text-amber-950 font-bold py-3.5 rounded-lg hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-base"
                >
                  {isSubmitting ? '送出預約中...' : '🎉 免費預約 30 分鐘聊聊'}
                </button>

                {submitMessage && (
                  <p className={`text-sm text-center font-bold mt-3 ${submitMessage.includes('🎉') ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {submitMessage}
                  </p>
                )}
              </div>
            </form>

          </div>
        </section>

        {/* 5. 關於我 About Me 區塊 */}
        <section id="about" className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 space-y-10">

          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 text-center md:text-left space-y-4">
              <div className="w-56 h-56 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-amber-300 shadow-md bg-amber-50 relative">
                <Image
                  src="/mindsay-avatar.png"
                  alt="Min YANG"
                  fill
                  sizes="224px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  生命設計師 / 作家 / 公開演講者 / 英語教師 / 畫家
                </p>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-wide border-l-4 border-amber-400 pl-3">
                Min YANG
              </h3>

              <ul className="space-y-3 text-slate-700 text-sm md:text-base leading-relaxed list-disc list-inside">
                <li>曾舉辦多場生命設計工作坊，協助多位學員開啟專屬人生</li>
                <li>曾任台灣 AI 伺服器供應鏈巨頭業務，深諳前沿科技與工程思維</li>
                <li>曾任本土大型金控交易室交易員，掌握數據分析與資產配置邏輯</li>
                <li>畢業於國立清華大學 & 國立政治大學商學院</li>
                <li>足跡遍及英國、法國、德國、義大利、西班牙、比利時、荷蘭、奧地利、匈牙利、捷克、挪威等國</li>
              </ul>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-6">
            <blockquote className="bg-amber-100/80 border-l-4 border-amber-400 text-slate-900 font-bold text-base md:text-lg p-4 rounded-r-lg">
              「如果不設計自己的人生，我們只能接受這個社會標準化的各種生命模型，過著罐頭人生。」
            </blockquote>

            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                哈囉，我是 Min。曾經我也在社會給予的標準答案上感到迷惘與內耗。直到我開始將系統工程的邏輯與實驗思維導入生活，重新拆解解決設計人生，才發現我可以活出很多不同樣子。
              </p>
              <p>
                生命設計實驗室 Life Design Lab 不只將我自己脫出泥沼，也在這兩年協助了多位學員展開新人生的腳本，因此我希望可以把這樣的好東西，分享給大家，一起活出專屬自己的人生劇本！
              </p>
              <div className="pt-2 flex items-center space-x-2 text-sm">
                <span>🌐 看更多日常隨筆或最新活動，我的 Instagram：</span>
                <a
                  href="https://www.instagram.com/mindsayseverything"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-200 hover:bg-sky-500 text-slate-900 px-3 py-1 rounded font-mono text-xs font-bold transition shadow-sm inline-block"
                >
                  @mindsayseverything
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 頁尾 */}
        <footer className="text-center text-xs text-slate-400 pt-8 pb-12 border-t border-slate-200">
          © {new Date().getFullYear()} Life Design Lab 生命設計實驗室. All rights reserved.
        </footer>
      </div>
    </main>
  )
}