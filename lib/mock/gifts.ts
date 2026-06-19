import type { Gift } from '@/types'

export const mockGifts: Gift[] = [
  {
    id: 'gift-1',
    capsule_id: 'cap-3',
    sender_id: 'user-2',
    recipient_email: 'aanya2106007@gmail.com',
    recipient_name: 'Aanya',
    recipient_note:
      "this one is for you. the feeling when summer ends and you don't want it to.",
    reveal_mode: 'instant',
    unlocked_at: '2024-09-23T08:00:00Z',
    token: 'gift-token-1',
    created_at: '2024-09-23T08:00:00Z',
  },
  {
    id: 'gift-2',
    capsule_id: 'cap-1',
    sender_id: 'user-3',
    recipient_email: 'aanya2106007@gmail.com',
    recipient_name: 'Aanya',
    recipient_note: "thought of you at 3am. this one's yours.",
    reveal_mode: 'timed',
    reveal_at: '2024-12-31T00:00:00Z',
    token: 'gift-token-2',
    created_at: '2024-11-20T00:00:00Z',
  },
]

export const mockGiftSenders: Record<string, { name: string }> = {
  'user-2': { name: 'Maya' },
  'user-3': { name: 'Raf' },
}
