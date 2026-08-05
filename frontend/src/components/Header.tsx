import styles from "./Header.module.css";
import { Menu, Globe } from "lucide-react";

import { useMainContext } from "../hooks/useMainContext.tsx";

const Header = () => {
  const mainContext = useMainContext();

  return (
    <header className={styles.header}>
      <Menu
        className={styles.menu_icon}
        onClick={() =>
          mainContext.setMenuOpen(mainContext.menuOpen ? false : true)
        }
      />
      <div>
        <h2 className={styles.header_title}>{mainContext.headerTitle}</h2>
      </div>
    </header>
  );
};

export default Header;
