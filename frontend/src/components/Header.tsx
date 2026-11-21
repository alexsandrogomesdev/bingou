import styles from "./Header.module.css";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { memo } from "react";

import { useMainContext } from "../hooks/useMainContext.tsx";
import { useGeneralContext } from "../contexts/GeneralContext.ts";

const Header = () => {
  const mainContext = useMainContext();
  const { menuOpen, setMenuOpen } = useGeneralContext();

  const hideHeader = ["/terms-of-use", "/privacy-policy"];
  const hideMenu = ["/"];
  const location = useLocation();
  const hideHeader_ = !hideHeader.includes(location.pathname);
  const hideMenu_ = !hideMenu.includes(location.pathname);

  return (
    <>
      {hideHeader_ && (
        <>
          <header className={`${styles.header} ${hideMenu_ ? styles.header_fixed : ""}`}>
            <div className={styles.div_header}>
              <Link to="/">
                <img src="/logo192.png" width={32} height={32} className={styles.logo} />
              </Link>

              <div>
                <h2 className={styles.header_title}>{mainContext.headerTitle}</h2>
                <span className={styles.header_sub_title}>{mainContext.headerSubTitle}</span>
              </div>
              {hideMenu_ &&
                (!menuOpen ? (
                  <Menu className={styles.menu_icon} onClick={() => setMenuOpen(menuOpen ? false : true)} />
                ) : (
                  <X className={styles.menu_icon} onClick={() => setMenuOpen(menuOpen ? false : true)} />
                ))}
            </div>
          </header>
        </>
      )}
    </>
  );
};

export default memo(Header);
