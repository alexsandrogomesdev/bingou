import { createContext, useState } from 'react'

export const MainContext = createContext();

export const MainContextProvider = ({children}) => {
  const [contextStatus, setContextStatus] = useState('Main Context...');
  const contextVariables = useMemo(() => ({
    contextStatus, setContextStatus
  }), [contextStatus]);
  
  return (
    <MainContext.Provider value={{contextStatus, setContextStatus}}>
      {children}
    </MainContext.Provider>
  )
}
