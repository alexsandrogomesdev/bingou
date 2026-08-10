import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, ExternalLink } from "lucide-react";

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
  const { setHeaderTitle } = useMainContext();
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
      if (packs.message === "Unauthorized") {
        navigate("/signin");
      } else {
        setPacks(packs.result);
      }
    };
    getPacks();
  }, []);

  useEffect(() => {
    setHeaderTitle("Packs");
  }, [setHeaderTitle]);

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
              <li key={pack.id} className={styles.pack}>
                <div>
                  <b>{pack.name}</b>
                  <span>{fts.dateFromUnix(pack.created_at)}</span>
                  <p>{pack.cards} Cartelas</p>
                </div>
                <Link to={`/pack/${pack.id}`}>
                  <ExternalLink />
                </Link>
              </li>
            ))}
          </ul>
          <button
            className={styles.button_new_pack}
            onClick={() => setSectionNewPack(true)}
          >
            <Plus />
            Novo
          </button>
        </div>
      </section>
    </>
  );
};

export default Packs;
