import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// STYLES
import styles from "./SignIn.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS

const SignIn = () => {
  const mainContext = useMainContext();
  const { request } = useFetch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();
  const [signing, setSigning] = useState<boolean>(false);

  const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSigning(true);

    interface Request {
      message: string;
      userId: number;
    }
    const signIn: Request = await request(
      "/user/signin",
      "POST",
      {},
      {
        email: email,
        password: password,
      },
    );

    setSigning(false);

    if (signIn.message === "ok") {
      navigate("/packs");
    } else {
      console.log(signIn.message);
      mainContext.setAlert({
        id: Date.now(),
        type: "error",
        message: signIn.message,
      });
    }
  };

  return (
    <section className={styles.section_signin}>
      <form className={styles.form} onSubmit={handleSignIn}>
        <h2>Acessar</h2>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className={styles.error_message}>Verifique seu email e senha.</p>
        )}

        <button type="submit" disabled={signing}>
          {signing ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className={styles.sign_up}>
        Não tenho cadastro, <Link to="/signup">Cadastrar-me</Link>
      </p>
    </section>
  );
};

export default SignIn;
