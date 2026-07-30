import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, ExternalLink } from "lucide-react";

// FUNCTIONS
import * as fts from "../utils/functions.ts";

// STYLES
import styles from "./Packs.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

// COMPONENTS
import NewPack from "../components/NewPack.tsx";

const Packs = () => {
  const mainContext = useMainContext();

  // TEMPORARY, AFTER I WILL CREATE A NODE JS SERVER WITH POSTGRESQL, AND GET PACKS WITH A REQ HTTP
  const mockPacks = [
    {
      id: 1,
      name: "Bingo de hoje",
      cards: 48,
      starts_at: 1785095123,
      created_at: 1785094123,
    },
    {
      id: 2,
      name: "Bingo de amanha",
      cards: 125,
      starts_at: 1785095123,
      created_at: 1785094123,
    },
    {
      id: 3,
      name: "Bingo de depois de amanha",
      cards: 450,
      starts_at: 1785095123,
      created_at: 1785094123,
    },
  ];

  // STATE VARIABLES
  type Pack = {
    id: number;
    name: string;
    cards: number;
    starts_at: number;
    created_at: number;
  };
  const [packs, setPacks] = useState<Pack[]>(mockPacks);
  const [sectionNewPack, setSectionNewPack] = useState<boolean>(false);

  return (
    <>
      <NewPack
        sectionNewPack={sectionNewPack}
        setSectionNewPack={setSectionNewPack}
      />

      <section className={styles.section_main}>
        <h2 className={styles.packs_title}>Meus Maços</h2>
        <ul className={styles.packs}>
          {packs.map((pack) => (
            <li key={pack.id} className={styles.pack}>
              <div>
                <b>{pack.name}</b>
                <span>{fts.dateFromUnix(pack.starts_at)}</span>
                <p>{pack.cards} Cartelas</p>
              </div>
              <NavLink to={`/pack/${pack.id}`}>
                <ExternalLink />
              </NavLink>
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
      </section>
    </>
  );
};

export default Packs;
