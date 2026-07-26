import { useContext } from 'react'
import { MainContext } from '../context/MainContext.tsx'

export const useMainContext = () => {
  const context = useContext(MainContext);
  
  if(!context) {
    throw new Error("Failed to use Hook")
  }
  
  return context;
}