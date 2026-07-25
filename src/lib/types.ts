export type Room = {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  price_per_night: number
  capacity: number
  features: string[]
  images: string[]
  is_active: boolean
  sort_order: number
  created_at: string
}

export type Booking = {
  id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  room_id: string
  room?: Room
  check_in: string
  check_out: string
  guests_count: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in'
  whatsapp_sent: boolean
  notes: string | null
  created_at: string
}

export type CheckIn = {
  id: string
  booking_id: string | null
  booking?: Booking
  full_name: string
  email: string
  phone: string
  nationality: string
  id_type: string
  id_number: string
  emergency_contact: string
  special_requests: string | null
  google_sheet_synced: boolean
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  author: string
  category: string
  is_published: boolean
  published_at: string | null
  created_at: string
}

export type Experience = {
  id: string
  title: string
  slug: string
  category: string
  description: string
  long_description: string | null
  image: string
  price: number | null
  duration: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export type GalleryImage = {
  id: string
  src: string
  alt: string
  category: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export type Testimonial = {
  id: string
  quote: string
  guest_name: string
  origin: string
  rating: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export type SiteSetting = {
  id: string
  key: string
  value: Record<string, unknown>
}
