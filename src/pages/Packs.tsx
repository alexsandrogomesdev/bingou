import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, ExternalLink } from "lucide-react";

// FUNCTIONS
import * as fts from "../utils/functions.tsx";

// STYLES
import styles from "./Packs.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

// COMPONENTS

const Packs = () => {
  // FUNCTIONS
  const date_from_unix = (unix_time, format = 1) => {
    let date = new Date(unix_time * 1000);
    console.log(date.getDate());
    return;
  };

  interface Pack {
    id: number;
    name: string;
    cards: number;
    starts_at: number;
    created_at: number;
  }

  const mainContext = useMainContext();
  const [packs, setPacks] = useState<Pack[]>([]);

  // TEMPORARY, AFTER I WILL CREATE A NODE JS SERVER WITH POSTGRESQL, AND GET PACKS WITH A REQ HTTP
  useEffect(() => {
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

    setPacks(mockPacks);
  }, []);

  return (
    <section className={styles.section_main}>
      <h2 className={styles.packs_title}>Meus Maços</h2>
      <ul className={styles.packs}>
        {packs.map((pack) => (
          <li key={pack.id} className={styles.pack}>
            <div>
              <b>{pack.name}</b>
              <span>{fts.date_from_unix(pack.starts_at)}</span>
              <p>{pack.cards} Cartelas</p>
            </div>
            <NavLink to={`/pack/${pack.id}`}>
              <ExternalLink />
            </NavLink>
          </li>
        ))}
      </ul>
      <button className={styles.button_new_pack}>
        <Plus />
        Novo
      </button>
    </section>
  );
};

export default Packs;
