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
  messagingSenderId: string
  projectId: string
}

function readFirebaseConfig(): FirebaseConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim()
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim()
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim()
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim()

  if (!apiKey || !authDomain || !projectId || !appId || !messagingSenderId) {
    return null
  }

  return {
    apiKey,
    appId,
    authDomain,
    messagingSenderId,
    projectId
  }
}

function getAdminFirebaseApp(): FirebaseApp | null {
  const config = readFirebaseConfig()

  if (!config) {
    return null
  }

  return getApps().length > 0 ? getApp() : initializeApp(config)
}

export function getAdminFirebaseAuth(): Auth | null {
  const app = getAdminFirebaseApp()
  return app ? getAuth(app) : null
}

export function hasAdminFirebaseConfig(): boolean {
  return getAdminFirebaseAuth() !== null
}

export async function signInAdminWithGoogle() {
  const auth = getAdminFirebaseAuth()

  if (!auth) {
    return null
  }

  return signInWithPopup(auth, new GoogleAuthProvider())
}
