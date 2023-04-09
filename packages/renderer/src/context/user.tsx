import { createContext, useContext, useState, useEffect } from 'react'
import { GET_LIST_USER_LOGIN } from '/@/graphql/query'
import client from '/@/apollo-client'

export interface InitialUser {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  companyId?: string;
  emailVerified: boolean;
}
export const InitialUserState: InitialUser = {
  uid: undefined,
  email: undefined,
  displayName: undefined,
  photoURL: undefined,
  companyId: undefined,
  emailVerified: false
}

const UserContext = createContext(InitialUserState)

const getDataUser = async (uid: string) => {
  const { data } = await client.query({
    query: GET_LIST_USER_LOGIN,
    variables: {
      uid
    }
  })

  return data
}

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = (props: any) => {
  const [userState, setUserState] = useState<InitialUser>(InitialUserState)

  useEffect(() => {
    if (userState.uid) {
      getDataUser(userState.uid).then(({ users }) => {
        setUserState((prev) => ({
          ...prev,
          displayName: users?.[0].name,
          companyId: users?.[0].companyId
        }))
      })
    }
  }, [userState.uid])


  const SetUser = (userCredential: InitialUser) => {
    setUserState({ ...userCredential })
  }

  const ResetUser = () => {
    setUserState(InitialUserState)
  }

  const value = { ...userState, SetUser, ResetUser }
  return <UserContext.Provider value={value} {...props} />
}