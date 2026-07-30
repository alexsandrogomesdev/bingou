import { useState } from 'react'

// STYLES
import styles from './Access.module.css'

// HOOKS
import { useMainContext } from '../hooks/useMainContext.tsx'

// COMPONENTS

const Access = () => {
  const mainContext = useMainContext();

  return (
    <>
      <h2>Access</h2>
      <p>{mainContext.contextStatus}</p>
    </>
  )
}

export default Access
