import { useState } from 'react'

// STYLES
import styles from './Pack.module.css'

// HOOKS
import { useMainContext } from '../hooks/useMainContext.tsx'

// COMPONENTS

const Pack = () => {
  const mainContext = useMainContext();

  return (
    <>
      <h2>Pack</h2>
      <p>{mainContext.contextStatus}</p>
    </>
  )
}

export default Pack
