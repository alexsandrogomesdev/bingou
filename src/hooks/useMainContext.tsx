import { useContext } from 'react'
import { MainContext } from '../context/MainContext.tsx'

export const useMainContext = () => {
  const context = useContext(MainContext);
  
  if(!context) console.log('context not found');
  
  return context;
}
