import React, { useEffect } from 'react'

import { InitialUserState, useUser } from './user'
import { Authentication } from '/@/authentication/index'

const AuthStateChangeProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser()
  const { SetUser }: any = user

  const InitiateAuthStateChange = () => {
    Authentication().onAuthStateChanged((user) => {
      if (user) {
        // console.log('User is authenticated')
        SetUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Admin",
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        })
      } else {
        // console.log('User is not authenticated')
        SetUser(InitialUserState)
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
      }
    })
  }

  useEffect(() => {
    InitiateAuthStateChange()
  }, [])

  return <>{children}</>
}

export default AuthStateChangeProvider