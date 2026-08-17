import { useRef, useEffect } from "react";
import { Sparkles, Play, Grid3x3, Check, Printer } from "lucide-react";
import { Link } from "react-router-dom";

// STYLES
import styles from "./Home.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

// COMPONENTS

const Home = () => {
  const { setHeaderTitle, setHeaderSubTitle } = useMainContext();

  useEffect(() => {
    setHeaderTitle("Bingou");
    setHeaderSubTitle("");
  }, [setHeaderTitle]);

  const sectionHowItWorks = useRef<HTMLDivElement>(null);
  const scrollToHowItWorks = () => {
    sectionHowItWorks.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className={styles.section_home}>
      <div className={styles.div_home}>
        <div className={styles.div_1}>
          <div className={styles.initial_presentation}>
            <span>
              <Sparkles /> Bingo
            </span>
            <h1>Cartelas de bingo</h1>
            <h2>em segundos</h2>

            <p>
              Um gerador e marcador de cartelas. Você cria, imprime ou joga pelo
              celular marcando os numeros conforme eles são sorteados.
            </p>

            <ul>
              <li>
                <Link to="/packs">
                  <Play />
                  {localStorage.getItem("userId") !== null
                    ? "Meus maços"
                    : "Gerar cartelas"}
                </Link>
              </li>
              <li>
                <a onClick={scrollToHowItWorks}>Como funciona</a>
              </li>
            </ul>
          </div>
          <div className={styles.template_card}>
            <ul>
              <li>B</li>
              <li>I</li>
              <li>N</li>
              <li>G</li>
              <li>O</li>
            </ul>
            <div>
              <ul>
                <li>7</li>
                <li>12</li>
                <li className={styles.number_selected}>3</li>
                <li>15</li>
                <li>9</li>
              </ul>
              <ul>
                <li className={styles.number_selected}>22</li>
                <li className={styles.number_selected}>28</li>
                <li className={styles.number_selected}>19</li>
                <li className={styles.number_selected}>24</li>
                <li className={styles.number_selected}>30</li>
              </ul>
              <ul>
                <li>35</li>
                <li>41</li>
                <li className={styles.joker}>
                  <Sparkles />
                </li>
                <li className={styles.number_selected}>39</li>
                <li>44</li>
              </ul>
              <ul>
                <li>48</li>
                <li>55</li>
                <li>52</li>
                <li>58</li>
                <li className={styles.number_selected}>50</li>
              </ul>
              <ul>
                <li className={styles.number_selected}>71</li>
                <li>70</li>
                <li>66</li>
                <li>62</li>
                <li>68</li>
              </ul>
            </div>
          </div>
        </div>
        <div ref={sectionHowItWorks} className={styles.div_2}>
          <ul>
            <li>
              <i>
                <Grid3x3 />
              </i>
              <p>Cartelas únicas</p>
              <span>
                Gere quantas cartelas quiser, todas diferentes entre si, em um
                toque.
              </span>
            </li>

            <li>
              <i>
                <Check />
              </i>
              <p>Marcação pelo celular</p>
              <span>
                Toque nos números para marcar e acompanhe as linhas completas na
                hora.
              </span>
            </li>

            <li>
              <i>
                <Printer />
              </i>
              <p>Pronto para imprimir</p>
              <span>
                Layout limpo para imprimir ou enviar o arquivo em PDF.
              </span>
            </li>
          </ul>
        </div>
        <div className={styles.div_3}>
          <h3>Pronto para a próxima rodada?</h3>
          <p>Gere suas cartelas agora e comece a marcar em poucos segundos.</p>
          <Link to="/packs">Criar cartelas</Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
