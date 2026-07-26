import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

// CONTEXT

// HOOKS
import { useMainContext } from './hooks/useMainContext.tsx'

// COMPONENTS
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'

// PAGES

function App() {
  const mainContext = useMainContext();

  return (
    <>
      <Header />
      
      <main>
        
      </main>
      
      <Footer />    
    </>
  )
}

export default App
