import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// CONTEXT

// HOOKS
import { useMainContext } from "./hooks/useMainContext.tsx";

// COMPONENTS
import SignUp from "./components/SignUp.tsx";
import SignIn from "./components/SignIn.tsx";
import Alert from "./components/Alert.tsx";
import MainMenu from "./components/MainMenu.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

// PAGES
import Profile from "./pages/Profile.tsx";
import Pack from "./pages/Pack.tsx";
import Packs from "./pages/Packs.tsx";
import Home from "./pages/Home.tsx";

function App() {
  const mainContext = useMainContext();
  // const location = useLocation();
  // const hideOnRoutes = ["/access"];
  // const showComponent = !hideOnRoutes.includes(location.pathname);

  return (
    <>
      {mainContext.alert.type !== "" && <Alert />}

      <Header />
      <MainMenu />

      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/packs" element={<Packs />}></Route>
          <Route path="/pack/:id" element={<Pack />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
