import styles from "./Footer.module.css";
import { memo } from "react";

// HOOKS
import { useMainContext } from "../hooks/useMainContext";

const Footer = () => {
  const mainContext = useMainContext();

  return (
    <section className={styles.section_footer}>
      <div className={styles.div_footer}>
        <p className={styles.terms_and_privacy}>
          <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">
            Termos de uso
          </a>{" "}
          e{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Política de Privacidade
          </a>
        </p>
        <p>{mainContext.headerTitle} gerador e marcador de cartelas.</p>
        <p>
          Desenvolvido por&nbsp;
          <a
            href="https://wa.me/5511995452626"
            target="_blank"
            rel="noopener noreferrer"
          >
            @alexsandrogomes.dev
          </a>
        </p>
      </div>
    </section>
  );
};

export default memo(Footer);
