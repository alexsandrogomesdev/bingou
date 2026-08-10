import { Boxes, UserRound, Globe, UserKey, House } from "lucide-react";
import { NavLink } from "react-router-dom";
import Cookies from "../../node_modules/@types/js-cookie/index";

// STYLES
import styles from "./MainMenu.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

// COMPONENTS

const MainMenu = () => {
  const mainContext = useMainContext();

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
            className={Cookies.get("userId") === undefined ? styles.hide : ""}
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
            className={Cookies.get("userId") === undefined ? styles.hide : ""}
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
            className={Cookies.get("userId") !== undefined ? styles.hide : ""}
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

export default MainMenu;
