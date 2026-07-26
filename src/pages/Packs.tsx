import { useState } from 'react'

// STYLES
import styles from './Packs.module.css'

// HOOKS
import { useMainContext } from '../hooks/useMainContext.tsx'

// COMPONENTS

const Packs = () => {
  const mainContext = useMainContext();

  return (
    <>
      <h2>Packs</h2>
      <p>{mainContext.contextStatus}</p>
    </>
  )
}

export default Packs
