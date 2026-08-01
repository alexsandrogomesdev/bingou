import { useState } from "react";

// STYLES
import styles from "./Home.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

// COMPONENTS

const Home = () => {
  const mainContext = useMainContext();

  return (
    <section className={styles.section_home}>
      <h2>Home</h2>
      <p>{mainContext.contextStatus}</p>
    </section>
  );
};

export default Home;
