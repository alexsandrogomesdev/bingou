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
import Pack from './pages/Pack.tsx'
import Packs from './pages/Packs.tsx'
import Home from './pages/Home.tsx'

function App() {
  const mainContext = useMainContext();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/packs" element={<Packs />}></Route>
        <Route path="/pack/:id" element={<Pack />}></Route>
      </Routes>

      <Header />
      
      <main>
        
      </main>
      
      <Footer />    
    </>
  )
}

export default App
