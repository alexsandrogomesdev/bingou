import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import Access from "./pages/Access.tsx";
import Profile from "./pages/Profile.tsx";
import Pack from "./pages/Pack.tsx";
import Packs from "./pages/Packs.tsx";
import Home from "./pages/Home.tsx";

function App() {
  const mainContext = useMainContext();
  const location = useLocation();
  const hideOnRoutes = ["/access"];
  const showComponent = !hideOnRoutes.includes(location.pathname);

  return (
    <>
      {mainContext.alert.type !== "" && <Alert />}

      {showComponent && <Header />}
      {showComponent && <Menu />}

      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/packs" element={<Packs />}></Route>
          <Route path="/pack/:id" element={<Pack />}></Route>
          <Route path="/access" element={<Access />}></Route>
        </Routes>
      </main>

      {showComponent && <Footer />}
    </>
  );
}

export default App;
