import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// STYLES
import styles from "./Profile.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS

const Profile = () => {
  const mainContext = useMainContext();
  const { request } = useFetch();
  const navigate = useNavigate();

  interface User {
    name: string;
    document: string;
    phone: string;
    email: string;
    plan: number;
  }
  const [profile, setProfile] = useState<User>({
    name: "",
    document: "",
    phone: "",
    email: "",
    plan: 0,
  });

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
    };
    getProfile();
  }, []);
  const plans: Array<string> = ["Gratuito", "Básico", "Completo"];

  return (
    <section className={styles.section_profile}>
      <div className={styles.div_profile}>
        <div>
          <p>Nome:</p> <span>{profile.name}</span>
        </div>
        <div>
          <p>Documento:</p> <span>{profile.document}</span>
        </div>
        <div>
          <p>Telefone:</p> <span>{profile.phone}</span>
        </div>
        <div>
          <p>Email:</p> <span>{profile.email}</span>
        </div>
        <div>
          <p>Plano:</p> <span>{plans[profile.plan]}</span>
        </div>
      </div>
    </section>
  );
};

export default Profile;
