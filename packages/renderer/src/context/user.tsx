import { createContext, useContext, useState } from 'react'
import { GET_LIST_USER_LOGIN } from '/@/graphql/query'
import { useQuery } from '@apollo/client';
import client from '/@/apollo-client'

export interface InitialUser {
  uid?: string | undefined;
  email?: string | null;
  displayName?: string;
  photoURL?: string | null;
  companyId?: string;
  emailVerified: boolean;
  SetUser?: (value: InitialUser) => void;
  ResetUser?: () => void;
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

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = (props: any) => {
  const [userState, setUserState] = useState<InitialUser>(InitialUserState)
  
  useQuery(GET_LIST_USER_LOGIN, {
    client: client,
    skip: !userState.uid,
    fetchPolicy: 'cache-and-network',
    variables: {uid: userState.uid},
    onCompleted: ({users}) => {
      setUserState((prev) => ({
        ...prev,
        displayName: users?.[0].name,
        companyId: users?.[0].companyId
      }))
    }
  })
  
  const SetUser = (userCredential: InitialUser) => {
    setUserState({ ...userCredential })
  }

  const ResetUser = () => {
    setUserState(InitialUserState)
  }

  const value = { ...userState, SetUser, ResetUser }
  return <UserContext.Provider value={value} {...props} />
}