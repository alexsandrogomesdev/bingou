import { useEffect, memo } from "react";

// STYLES
import styles from "./Plans.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

// COMPONENTS

const Plans = () => {
  const mainContext = useMainContext();

  useEffect(() => {
    mainContext.setHeaderTitle("Planos");
    mainContext.setHeaderSubTitle("");
  }, []);

  return (
    <section className={styles.section_plans}>
      <div className={styles.div_plans}>
        <h1>Planos de assinatura</h1>
        <ul className={styles.ul_plans}>
          <li>
            <h2>Inicial</h2>
            <p>Limite de 50 cartelas por maço.</p>
            <span>Grátis</span>
          </li>
          <li>
            <h2>Básico</h2>
            <p>Limite de 500 cartelas por maço.</p>
            <span>R$ 19,90/mês</span>
            <a
              href="https://wa.me/5511995452626"
              target="_blank"
              rel="noopener noreferrer"
            >
              Assinar Básico
            </a>
          </li>
          <li>
            <h2>Completo</h2>
            <p>Limite de 10.000 cartelas por maço.</p>
            <span>R$ 29,90/mês</span>
            <a
              href="https://wa.me/5511995452626"
              target="_blank"
              rel="noopener noreferrer"
            >
              Assinar Avançado
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default memo(Plans);
