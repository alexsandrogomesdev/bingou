import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./App.css";

// CONTEXT

// HOOKS
import { useMainContext } from "./hooks/useMainContext.tsx";

// COMPONENT
import Alert from "./components/Alert.tsx";
import MainMenu from "./components/MainMenu.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

// PAGES
const SignUp = lazy(() => import("./pages/SignUp.tsx"));
const SignIn = lazy(() => import("./pages/SignIn.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Pack = lazy(() => import("./pages/Pack.tsx"));
const Packs = lazy(() => import("./pages/Packs.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));

function App() {
  const mainContext = useMainContext();
  const hideOnRoutes: Array<string> = [];
  const location = useLocation();
  const showComponent = !hideOnRoutes.includes(location.pathname);

  return (
    <>
      {mainContext.alert.type !== "" && <Alert />}

      {showComponent && <Header />}
      <MainMenu />

      <main>
        <Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/packs" element={<Packs />}></Route>
            <Route path="/pack/:id" element={<Pack />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>
        </Suspense>
      </main>

      {location.pathname === "/" && <Footer />}
    </>
  );
}

export default App;
