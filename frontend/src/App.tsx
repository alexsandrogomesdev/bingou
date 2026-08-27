import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

import "./App.css";

// CONTEXT

// HOOKS
import { useMainContext } from "./hooks/useMainContext.tsx";

// COMPONENT
import Alert from "./components/Alert.tsx";
import MainMenu from "./components/MainMenu.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

import { sleep } from "./utils/functions.ts";

// PAGES
const Randomizer = lazy(() => import("./pages/Randomizer.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse.tsx"));
const Plans = lazy(() => import("./pages/Plans.tsx"));
const SignUp = lazy(() => import("./pages/SignUp.tsx"));
const SignIn = lazy(() => import("./pages/SignIn.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Pack = lazy(() => import("./pages/Pack.tsx"));
const Packs = lazy(() => import("./pages/Packs.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const initApp = async () => {
      if (localStorage.getItem("userId") !== null) navigate("/packs");
      await sleep(1500);
      await SplashScreen.hide();
    };

    initApp();
  }, []);

  const mainContext = useMainContext();
  const hideOnRoutes: Array<string> = [];

  const location = useLocation();
  const showComponent = !hideOnRoutes.includes(location.pathname);

  useEffect(() => {
    const listenerPromise = CapacitorApp.addListener("backButton", () => {
      const rootRoutes = ["/", "/home", "/login"];

      if (rootRoutes.includes(location.pathname) && Capacitor.isNativePlatform()) {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      listenerPromise.then((handler) => handler.remove());
    };
  }, [location.pathname, navigate]);

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
            <Route path="/reset-password" element={<ResetPassword />}></Route>
            <Route path="/plans" element={<Plans />}></Route>
            <Route path="/shuffle" element={<Randomizer />}></Route>
            <Route path="/terms-of-use" element={<TermsOfUse />}></Route>
            <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
          </Routes>
        </Suspense>
      </main>

      {location.pathname === "/" && <Footer />}
    </>
  );
}

export default App;
