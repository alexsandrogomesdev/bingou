import { useState, useEffect } from "react";

// STYLES
import styles from "./Profile.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS

const Profile = () => {
  const mainContext = useMainContext();
  const { request } = useFetch();

  interface User {
    name: string;
    document: string;
    phone: string;
    email: string;
  }
  const [profile, setProfile] = useState<User>({
    name: "",
    document: "",
    phone: "",
    email: "",
  });

  interface Response {
    message: string;
    result: User;
  }
  useEffect(() => {
    const getProfile = async () => {
      const response = await request<Response>("/user", "GET", {}, {}, true);

      setProfile(response.result);
    };
    getProfile();
  }, []);

  return (
    <>
      <p>Nome: {profile.name}</p>
      <p>Documento: {profile.document}</p>
      <p>Telefone: {profile.phone}</p>
      <p>Email: {profile.email}</p>
    </>
  );
};

export default Profile;
