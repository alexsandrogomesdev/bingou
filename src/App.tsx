import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// CONTEXT

// HOOKS
import { useMainContext } from "./hooks/useMainContext.tsx";

// COMPONENTS
import Alert from "./components/Alert.tsx";
import Menu from "./components/Menu.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

// PAGES
import Profile from "./pages/Profile.tsx";
import Pack from "./pages/Pack.tsx";
import Packs from "./pages/Packs.tsx";
import Home from "./pages/Home.tsx";

function App() {
  const mainContext = useMainContext();

  return (
    <>
      <Header />
      <Menu />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/packs" element={<Packs />}></Route>
          <Route path="/pack/:id" element={<Pack />}></Route>
        </Routes>
      </main>
      =={mainContext.alert.type !== "" && <Alert />}==
      <span>---{mainContext.alert.type}---</span>
      <button
        onClick={() =>
          mainContext.setAlert({
            id: Math.floor(Math.random() * 1001),
            type: "errors",
            message: "",
          })
        }
      >
        Teste
      </button>
      <button
        onClick={() =>
          mainContext.setAlert({
            id: Math.floor(Math.random() * 1001),
            type: "error",
            message: "",
          })
        }
      >
        Teste
      </button>
      <Footer />
    </>
  );
}

export default App;
