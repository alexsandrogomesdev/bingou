import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// CONTEXT

// HOOKS
import { useMainContext } from "./hooks/useMainContext.tsx";

// COMPONENTS
import Alert from "./components/Alert.tsx";
import MainMenu from "./components/MainMenu.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

// PAGES
import SignUp from "./pages/SignUp.tsx";
import SignIn from "./pages/SignIn.tsx";
import Profile from "./pages/Profile.tsx";
import Pack from "./pages/Pack.tsx";
import Packs from "./pages/Packs.tsx";
import Home from "./pages/Home.tsx";

function App() {
  const mainContext = useMainContext();
  const hideOnRoutes: Array<string> = [];
  const location = useLocation();
  const showComponent = !hideOnRoutes.includes(location.pathname);
  // here...
  return (
    <>
      {mainContext.alert.type !== "" && <Alert />}

      {showComponent && <Header />}
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

      {location.pathname === "/" && <Footer />}
    </>
  );
}

export default App;
