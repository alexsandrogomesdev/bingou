import styles from "./Header.module.css";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import { useMainContext } from "../hooks/useMainContext.tsx";

const Header = () => {
  const mainContext = useMainContext();

  const hideOnRoutes = ["/"];
  const location = useLocation();
  const showComponent = !hideOnRoutes.includes(location.pathname);

  return (
    <header
      className={`${styles.header} ${showComponent && styles.header_fixed}`}
    >
      <div className={styles.div_header}>
        <Link to="/">
          <p>B</p>
        </Link>

        <h2 className={styles.header_title}>{mainContext.headerTitle}</h2>
        {showComponent &&
          (!mainContext.menuOpen ? (
            <Menu
              className={styles.menu_icon}
              onClick={() =>
                mainContext.setMenuOpen(mainContext.menuOpen ? false : true)
              }
            />
          ) : (
            <X
              className={styles.menu_icon}
              onClick={() =>
                mainContext.setMenuOpen(mainContext.menuOpen ? false : true)
              }
            />
          ))}
      </div>
    </header>
  );
};

export default Header;
