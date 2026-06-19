'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Capsule, CapsuleItem, Gift } from '@/types'
import { mockCapsules, mockPublicCapsules } from './mock/capsules'
import { mockItems } from './mock/content-items'
import { mockGifts, mockGiftSenders } from './mock/gifts'

interface StoreState {
  capsules: Capsule[]
  items: Record<string, CapsuleItem[]>
  gifts: Gift[]
  publicCapsules: Capsule[]
  currentUserId: string
}

type Action =
  | { type: 'CREATE_CAPSULE'; payload: Capsule }
  | { type: 'UPDATE_CAPSULE'; payload: Partial<Capsule> & { id: string } }
  | { type: 'ADD_ITEM'; payload: CapsuleItem }
  | { type: 'REMOVE_ITEM'; payload: { capsule_id: string; item_id: string } }
  | { type: 'UPDATE_ITEM'; payload: Partial<CapsuleItem> & { id: string; capsule_id: string } }
  | { type: 'CREATE_GIFT'; payload: Gift }

const initialState: StoreState = {
  capsules: mockCapsules,
  items: mockItems,
  gifts: mockGifts,
  publicCapsules: mockPublicCapsules,
  currentUserId: 'user-1',
}

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'CREATE_CAPSULE':
      return {
        ...state,
        capsules: [action.payload, ...state.capsules],
        items: { ...state.items, [action.payload.id]: [] },
      }
    case 'UPDATE_CAPSULE':
      return {
        ...state,
        capsules: state.capsules.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      }
    case 'ADD_ITEM': {
      const existing = state.items[action.payload.capsule_id] ?? []
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.capsule_id]: [...existing, action.payload],
        },
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.capsule_id]: (state.items[action.payload.capsule_id] ?? []).filter(
            i => i.id !== action.payload.item_id
          ),
        },
      }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.capsule_id]: (state.items[action.payload.capsule_id] ?? []).map(i =>
            i.id === action.payload.id ? { ...i, ...action.payload } : i
          ),
        },
      }
    case 'CREATE_GIFT':
      return { ...state, gifts: [action.payload, ...state.gifts] }
    default:
      return state
  }
}

interface StoreContextValue extends StoreState {
  dispatch: React.Dispatch<Action>
  getCapsule: (id: string) => Capsule | undefined
  getItems: (capsule_id: string) => CapsuleItem[]
  getGiftSender: (sender_id: string) => { name: string } | undefined
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value: StoreContextValue = {
    ...state,
    dispatch,
    getCapsule: id =>
      state.capsules.find(c => c.id === id) ??
      state.publicCapsules.find(c => c.id === id),
    getItems: capsule_id => state.items[capsule_id] ?? [],
    getGiftSender: sender_id => mockGiftSenders[sender_id],
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
