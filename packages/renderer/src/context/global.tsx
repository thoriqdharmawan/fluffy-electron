import React, {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction
} from "react";


export type Global = {
  selectedCompany: string | undefined,
}

interface GlobalContextInterface {
  value: Global,
  setValue: Dispatch<SetStateAction<Global>>
}

const GlobalContext = createContext<GlobalContextInterface | any>({
  value: undefined,
  setValue: undefined
})

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [global, setGlobal] = useState<Global>({
    // selectedCompany: undefined,
    selectedCompany: '90417dfc-06fc-47ca-92be-9603be775301', // makanan
    // selectedCompany: '33e0fc77-d64b-413b-995e-c5ca917f349b', // retail
    // selectedCompany: '40b0a565-40d5-49d7-8fd6-30e0adc1a684', // arion mart
    // selectedCompany: 'fed9ca5d-4bdb-4db4-b13b-9f7867dda1c9', // arion cafe
  })

  return (
    <GlobalContext.Provider value={{ value: global, setValue: setGlobal }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => {
  return useContext(GlobalContext)
}
