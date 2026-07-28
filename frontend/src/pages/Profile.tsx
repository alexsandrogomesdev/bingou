import { useState } from 'react'

// STYLES
import styles from './Profile.module.css'

// HOOKS
import { useMainContext } from '../hooks/useMainContext.tsx'

// COMPONENTS

const Profile = () => {
  const mainContext = useMainContext();

  return (
    <>
      <h2>Profile</h2>
      <p>{mainContext.contextStatus}</p>
    </>
  )
}

export default Profile
