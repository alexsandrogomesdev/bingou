import styles from "./Header.module.css";
import { Menu } from "lucide-react";

import { useMainContext } from "../hooks/useMainContext.tsx";

const Header = () => {
  const mainContext = useMainContext();

  return (
    <section className={styles.header_section}>
      <Menu
        className={styles.menu_icon}
        onClick={() =>
          mainContext.setMenuOpen(mainContext.menuOpen ? false : true)
        }
      />
      <h2 className={styles.header_title}>WMS Cartelas</h2>
    </section>
  );
};

export default Header;
