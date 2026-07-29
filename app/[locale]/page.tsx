'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AboutSection } from '../../components/site/about-section'
import { ArticlesSection } from '../../components/site/articles-section'
import {
  BookingSection,
  type BookingFormData
} from '../../components/site/booking-section'
import { HeroSection } from '../../components/site/hero-section'
import { ServicesCarousel } from '../../components/site/services-carousel'
import { SiteFooter } from '../../components/site/site-footer'
import { SiteHeader } from '../../components/site/site-header'
import { TestimonialsSection } from '../../components/site/testimonials-section'
import {
  createAppointment,
  getBookedSlots,
  getPosts,
  type Post
} from '../../lib/api'

const EMPTY_FORM: BookingFormData = {
  name: '',
  email: '',
  contactPlatform: 'Line ID',
  contactDetail: '',
  notes: ''
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function formatDateForApi(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function Home() {
  const t = useTranslations()
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [formData, setFormData] = useState<BookingFormData>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    void fetchPosts()
  }, [])

  useEffect(() => {
    void fetchBookedSlots(selectedDate)
  }, [selectedDate])

  async function fetchPosts() {
    try {
      setLoadingPosts(true)
      setPosts(await getPosts())
    } catch (error: unknown) {
      console.error('failed to fetch posts:', getErrorMessage(error))
    } finally {
      setLoadingPosts(false)
    }
  }

  async function fetchBookedSlots(date: Date) {
    try {
      setBookedSlots(await getBookedSlots(formatDateForApi(date)))
    } catch (error: unknown) {
      setBookedSlots([])
      console.error('failed to fetch booked slots:', getErrorMessage(error))
    }
  }

  async function handleSubmitAppointment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    if (!selectedSlot) {
      setSubmitMessage(t('booking.msgPickSlotFirst'))
      setIsSubmitting(false)
      return
    }

    try {
      await createAppointment({
        name: formData.name,
        email: formData.email,
        contactPlatform: formData.contactPlatform,
        contactDetail: formData.contactDetail,
        notes: formData.notes,
        appointmentDate: formatDateForApi(selectedDate),
        slot: selectedSlot
      })

      setSubmitMessage(t('booking.msgSuccess'))
      setFormData(EMPTY_FORM)
      setSelectedSlot('')
      void fetchBookedSlots(selectedDate)
    } catch (error: unknown) {
      const message = getErrorMessage(error)

      if (message === 'slot already booked') {
        setSubmitMessage(t('booking.msgSlotTaken'))
        void fetchBookedSlots(selectedDate)
      } else {
        setSubmitMessage(t('booking.msgFailure', { message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDateChange(
    value: Date | null | [Date | null, Date | null]
  ) {
    if (value instanceof Date) {
      setSelectedDate(value)
      setSelectedSlot('')
      setSubmitMessage('')
    }
  }

  return (
    <main className="min-h-screen bg-brand-white text-brand-navy">
      <SiteHeader />
      <HeroSection />
      <TestimonialsSection />
      <ServicesCarousel />
      <ArticlesSection posts={posts} loading={loadingPosts} />
      <BookingSection
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        bookedSlots={bookedSlots}
        formData={formData}
        isSubmitting={isSubmitting}
        submitMessage={submitMessage}
        onDateChange={handleDateChange}
        onSlotChange={(slot) => {
          setSelectedSlot(slot)
          setSubmitMessage('')
        }}
        onFormDataChange={setFormData}
        onSubmit={handleSubmitAppointment}
      />
      <AboutSection />
      <SiteFooter />
    </main>
  )
}
