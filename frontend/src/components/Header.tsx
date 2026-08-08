import styles from "./Header.module.css";
import { Menu, Globe } from "lucide-react";
import { useLocation } from "react-router-dom";

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
        <p>B</p>
        <h2 className={styles.header_title}>{mainContext.headerTitle}</h2>
        {showComponent && (
          <Menu
            className={styles.menu_icon}
            onClick={() =>
              mainContext.setMenuOpen(mainContext.menuOpen ? false : true)
            }
          />
        )}
      </div>
    </header>
  );
};

export default Header;
