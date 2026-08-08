import styles from "./Footer.module.css";

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
            href="https://www.linkedin.com/in/alexsandrogomesdev"
            target="_blank"
          >
            @alexsandrogomesdev
          </a>
        </p>
      </div>
    </section>
  );
};

export default Footer;
