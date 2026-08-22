import { useState, useEffect, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleStar, Plus, Trash2 } from "lucide-react";

// FUNCTIONS
import * as fts from "../utils/functions.ts";

// STYLES
import styles from "./Packs.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS
import NewPack from "../components/NewPack.tsx";

const Packs = () => {
  const { setHeaderTitle, setHeaderSubTitle, setAlert } = useMainContext();
  const { request } = useFetch();
  const navigate = useNavigate();

  // STATE VARIABLES
  type Pack = {
    id: number;
    name: string;
    cards: number;
    starts_at: number;
    created_at: number;
  };
  const [packs, setPacks] = useState<Pack[]>([]);
  const [sectionNewPack, setSectionNewPack] = useState<boolean>(false);
  useEffect(() => {
    const getPacks = async () => {
      interface Packs {
        message: string;
        result: [];
      }
      const packs = await request<Packs>("/packs", "GET");
      if (packs.message === "Unauthorized" || !packs.result) {
        navigate("/signin");
      } else {
        setPacks(packs.result);
      }
    };
    getPacks();
  }, []);

  useEffect(() => {
    setHeaderSubTitle(`${packs.length} maços`);
  }, [setHeaderSubTitle, packs]);
  useEffect(() => {
    setHeaderTitle("Maços");
  }, [setHeaderTitle]);

  const handleRemovePack = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      id: number,
      name: string,
    ): Promise<boolean> => {
      e.stopPropagation();

      if (!confirm(`O maço: ${name} será removido`)) return false;

      const removePack: { message: string } = await request(
        `/packs/${id}`,
        "DELETE",
        {},
        {},
      );
      if (removePack.message === "ok") {
        setAlert({
          id: Date.now(),
          type: "success",
          message: "Maço removido com sucesso!",
        });
        setPacks((prevPacks) => {
          return prevPacks.filter((pack) => pack.id !== id);
        });
        return true;
      } else {
        setAlert({
          id: Date.now(),
          type: "error",
          message: "Falha ao remover maço!",
        });
        return false;
      }
    },
    [request, setAlert],
  );
  return (
    <>
      <NewPack
        sectionNewPack={sectionNewPack}
        setSectionNewPack={setSectionNewPack}
      />

      <section className={styles.section_packs}>
        <div className={styles.div_packs}>
          <h2 className={styles.packs_title}>Meus Maços</h2>
          {packs.length === 0 && (
            <p className={styles.none_packs}>
              Nenhum maço criado, crie um no botão abaixo!
            </p>
          )}
          <ul className={styles.packs}>
            {packs.map((pack) => (
              <li
                key={pack.id}
                className={styles.pack}
                onClick={() => navigate(`/pack/${pack.id}`)}
              >
                <div>
                  <b>{pack.name}</b>
                  <span>{fts.dateFromUnix(pack.created_at)}</span>
                  <p>{pack.cards} Cartelas</p>
                </div>
                <nav>
                  <button
                    onClick={(e) => handleRemovePack(e, pack.id, pack.name)}
                  >
                    <Trash2 />
                  </button>
                </nav>
              </li>
            ))}
          </ul>
          <section className={styles.section_fixed}>
            <button
              className={styles.button_new_pack}
              onClick={() => setSectionNewPack(true)}
            >
              <Plus />
              Novo
            </button>
            <article
              className={`${styles.article_buy_plan} ${localStorage.getItem("userId") !== null && localStorage.getItem("plan") === "0" ? styles.show : styles.hide}`}
            >
              <p>
                Seu plano gratuito permite gerar até 50 cartelas por maço. Para
                gerar mais obtenha um plano.
              </p>

              <Link to="/plans">
                <CircleStar />
                Obter Plano
              </Link>
            </article>
          </section>
        </div>
      </section>
    </>
  );
};

export default memo(Packs);
