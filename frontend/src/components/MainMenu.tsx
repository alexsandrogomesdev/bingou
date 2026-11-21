import { Boxes, UserRound, UserKey, House, LogOut, HandCoins, Dices } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { memo } from "react";

// STYLES
import styles from "./MainMenu.module.css";

// HOOKS
import { useFetch } from "../hooks/useFetch.tsx";
import { useGeneralContext } from "../contexts/GeneralContext.ts";

// COMPONENTS

const MainMenu = () => {
  const { userId, menuOpen, setMenuOpen, logOut } = useGeneralContext();

  const { request } = useFetch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    setMenuOpen(false);
    logOut();
    await request("/logout", "POST", {}, {});
    navigate("/signin");
    return;
  };

  return (
    <section className={`${styles.menu_section} ${menuOpen ? styles.menu_open : styles.menu_closed}`}>
      <div className={styles.menu_div}>
        <div className={styles.menu_header}>
          <img src="/logo192.png" width={32} height={32} className={styles.logo} />
          <h2>Bingou</h2>
        </div>

        <ul className={styles.menu_ul}>
          <li className={userId ? styles.hide : ""}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setMenuOpen(false)}
            >
              <House />
              <span>Inicio</span>
            </NavLink>
          </li>
          <li className={!userId ? styles.hide : ""}>
            <NavLink
              to="/packs"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setMenuOpen(false)}
            >
              <Boxes />
              <span>Maços</span>
            </NavLink>
          </li>
          <li className={!userId ? styles.hide : ""}>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setMenuOpen(false)}
            >
              <UserRound />
              <span>Perfil</span>
            </NavLink>
          </li>

          <li className={userId ? styles.hide : ""}>
            <NavLink
              to="/signin"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setMenuOpen(false)}
            >
              <UserKey />
              <span>Acessar</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/plans"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setMenuOpen(false)}
            >
              <HandCoins />
              <span>Planos</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/shuffle"
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={() => setMenuOpen(false)}
            >
              <Dices />
              <span>Sorteador</span>
            </NavLink>
          </li>

          <li className={!userId ? styles.hide : ""}>
            <NavLink to="/signin" onClick={handleLogOut}>
              <LogOut />
              <span>Sair</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.menu_div_close} onClick={() => setMenuOpen(menuOpen ? false : true)}></div>
    </section>
  );
};

export default memo(MainMenu);
