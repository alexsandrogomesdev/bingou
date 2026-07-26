import { createContext, useState, useMemo } from 'react'

export const MainContext = createContext();

export const MainContextProvider = ({children}) => {
  const [contextStatus, setContextStatus] = useState<string>('Main Context...');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const contextVariables = useMemo(() => ({
    contextStatus, setContextStatus,
    menuOpen, setMenuOpen
  }), [contextStatus, menuOpen]);
  
  return (
    <MainContext.Provider value={contextVariables}>
      {children}
    </MainContext.Provider>
  )
}
