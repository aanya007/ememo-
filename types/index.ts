export type ContentType = 'music' | 'image' | 'place' | 'article' | 'journal' | 'link'
export type RevealMode = 'instant' | 'timed' | 'on_request'

export interface Capsule {
  id: string
  user_id: string
  name: string
  mood_tags: string[]
  cover_image_url?: string
  cover_colour?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface CapsuleItem {
  id: string
  capsule_id: string
  type: ContentType
  position: number
  title: string
  subtitle?: string
  thumbnail_url?: string
  external_url?: string
  metadata: Record<string, unknown>
  user_note?: string
  created_at: string
}

export interface Gift {
  id: string
  capsule_id: string
  sender_id: string
  recipient_email: string
  recipient_name?: string
  recipient_note?: string
  reveal_mode: RevealMode
  reveal_at?: string
  unlocked_at?: string
  token: string
  created_at: string
}

export interface MockUser {
  id: string
  email: string
  name: string
}
