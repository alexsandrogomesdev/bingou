import styles from "./Footer.module.css";
import { memo } from "react";

// HOOKS
import { useMainContext } from "../hooks/useMainContext";

const Footer = () => {
  const mainContext = useMainContext();

  return (
    <section className={styles.section_footer}>
      <div className={styles.div_footer}>
        <p>{mainContext.headerTitle} gerador e marcador de cartelas.</p>
        <p>
          Desenvolvido por&nbsp;
          <a
            href="https://wa.me/5511995452626"
            target="_blank"
            rel="noopener noreferrer"
          >
            @alexsandrogomesdev
          </a>
        </p>
      </div>
    </section>
  );
};

export default memo(Footer);
