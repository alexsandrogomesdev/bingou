import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";

// STYLES
import styles from "./Profile.module.css";

// HOOKS
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS

import { dateFromUnix } from "../utils/functions.ts";
import { useMainContext } from "../hooks/useMainContext.tsx";
import Waiting from "../components/Waiting.tsx";

const Profile = () => {
  const { setHeaderTitle, setHeaderSubTitle } = useMainContext();
  const { request } = useFetch();
  const navigate = useNavigate();

  interface User {
    name: string;
    document: string;
    phone: string;
    email: string;
    plan: number;
    due_at: number;
  }
  const [profile, setProfile] = useState<User>({
    name: "",
    document: "",
    phone: "",
    email: "",
    plan: 0,
    due_at: 0,
  });
  const [requestIsDone, setRequestIsDone] = useState<boolean>(false);

  interface Response {
    message: string;
    result: User;
  }
  useEffect(() => {
    const getProfile = async () => {
      const response = await request<Response>("/user", "GET", {}, {});
      if (response.message === "Unauthorized") {
        navigate("/signin");
        return;
      }
      setProfile(response.result);
      setRequestIsDone(true);
      localStorage.setItem("plan", String(response.result.plan));
      localStorage.setItem("due_at", String(response.result.due_at));
    };
    getProfile();
  }, [request, setProfile, navigate]);

  useEffect(() => {
    setHeaderTitle("Perfil");
    setHeaderSubTitle("");
  }, [setHeaderTitle, setHeaderSubTitle]);

  const plans: Array<string> = ["Gratuito", "Básico", "Completo"];

  return (
    <section className={styles.section_profile}>
      <div className={styles.div_profile}>
        {!requestIsDone ? (
          <Waiting text={"Buscando perfil..."} />
        ) : (
          <>
            <h2>Meu Perfil</h2>
            <ul>
              <li>
                <p>Nome:</p> <span>{profile.name}</span>
              </li>
              <li>
                <p>Documento:</p> <span>{profile.document}</span>
              </li>
              <li>
                <p>Telefone:</p> <span>{profile.phone}</span>
              </li>
              <li>
                <p>Email:</p> <span>{profile.email}</span>
              </li>
              <li>
                <p>Plano:</p> <span>{plans[profile.plan]}</span>
              </li>
              <li>
                <p>Vencimento:</p> <span>{dateFromUnix(profile.due_at)}</span>
              </li>
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default memo(Profile);
