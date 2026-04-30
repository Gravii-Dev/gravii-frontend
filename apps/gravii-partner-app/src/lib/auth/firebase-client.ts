'use client'

import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp
} from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type Auth
} from 'firebase/auth'

interface FirebaseConfig {
  apiKey: string
  appId: string
  authDomain: string
  measurementId?: string
  messagingSenderId: string
  projectId: string
  storageBucket?: string
}

const defaultPartnerFirebaseConfig: FirebaseConfig = {
  apiKey: 'AIzaSyCPIJZc24l1oAW6t9QBdddnU2iIH8OfLAM',
  appId: '1:1077809741476:web:229984fa9d20fda8cab031',
  authDomain: 'gravii.firebaseapp.com',
  measurementId: 'G-LRGDKK308K',
  messagingSenderId: '1077809741476',
  projectId: 'gravii',
  storageBucket: 'gravii.firebasestorage.app'
}

function readFirebaseConfig(): FirebaseConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim()
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim()
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim()
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim()

  if (!apiKey || !authDomain || !projectId || !appId || !messagingSenderId) {
    return defaultPartnerFirebaseConfig
  }

  return {
    apiKey,
    appId,
    authDomain,
    messagingSenderId,
    projectId
  }
}

function getPartnerFirebaseApp(): FirebaseApp | null {
  const config = readFirebaseConfig()

  if (!config) {
    return null
  }

  return getApps().length > 0 ? getApp() : initializeApp(config)
}

export function getPartnerFirebaseAuth(): Auth | null {
  const app = getPartnerFirebaseApp()
  return app ? getAuth(app) : null
}

export function hasPartnerFirebaseConfig(): boolean {
  return getPartnerFirebaseAuth() !== null
}

export async function signInPartnerWithGoogle() {
  const auth = getPartnerFirebaseAuth()

  if (!auth) {
    return null
  }

  return signInWithPopup(auth, new GoogleAuthProvider())
}
