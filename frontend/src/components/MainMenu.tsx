import {
  Boxes,
  UserRound,
  Globe,
  UserKey,
  House,
  LogOut,
  HandCoins,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { memo } from "react";

// STYLES
import styles from "./MainMenu.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS

const MainMenu = () => {
  const mainContext = useMainContext();
  const { request } = useFetch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    mainContext.setMenuOpen(false);
    await request("/logout", "POST", {}, {});
    localStorage.clear();
    mainContext.setMenuOpen(false);
    navigate("/");
    return;
  };

  return (
    <section
      className={`${styles.menu_section} ${mainContext.menuOpen ? styles.menu_open : styles.menu_closed}`}
    >
      <div className={styles.menu_div}>
        <div className={styles.menu_header}>
          <Globe />
          <h2>Bingou</h2>
        </div>

        <ul className={styles.menu_ul}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => mainContext.setMenuOpen(false)}
            >
              <House />
              <span>Inicio</span>
            </NavLink>
          </li>
          <li
            className={
              localStorage.getItem("userId") === null ? styles.hide : ""
            }
          >
            <NavLink
              to="/packs"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => mainContext.setMenuOpen(false)}
            >
              <Boxes />
              <span>Maços</span>
            </NavLink>
          </li>
          <li
            className={
              localStorage.getItem("userId") === null ? styles.hide : ""
            }
          >
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => mainContext.setMenuOpen(false)}
            >
              <UserRound />
              <span>Perfil</span>
            </NavLink>
          </li>

          <li
            className={
              localStorage.getItem("userId") !== null ? styles.hide : ""
            }
          >
            <NavLink
              to="/signin"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => mainContext.setMenuOpen(false)}
            >
              <UserKey />
              <span>Acessar</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/plans"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => mainContext.setMenuOpen(false)}
            >
              <HandCoins />
              <span>Planos</span>
            </NavLink>
          </li>

          <li
            className={
              localStorage.getItem("userId") === null ? styles.hide : ""
            }
          >
            <NavLink to="/" onClick={handleLogOut}>
              <LogOut />
              <span>Sair</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div
        className={styles.menu_div_close}
        onClick={() =>
          mainContext.setMenuOpen(mainContext.menuOpen ? false : true)
        }
      ></div>
    </section>
  );
};

export default memo(MainMenu);
