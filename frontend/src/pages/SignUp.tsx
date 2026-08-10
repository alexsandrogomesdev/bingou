import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// STYLES
import styles from "./SignUp.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS

const SignUp = () => {
  const mainContext = useMainContext();
  const { request } = useFetch();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [document, setDocument] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signuping, setSignuping] = useState<boolean>(false);

  const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setSignuping(true);

    interface SignUp {
      message: string;
    }
    const signUp: SignUp = await request(
      "/user/signup",
      "POST",
      {},
      {
        name: name,
        document: document,
        phone: phone,
        email: email,
        password: password,
      },
    );

    if (signUp.message === "ok") {
      navigate("/signin");
      setSignuping(false);
    } else {
      mainContext.setAlert({
        id: Date.now(),
        type: "error",
        message: signUp.message,
      });
    }
  };

  return (
    <section className={styles.section_signup}>
      <form className={styles.form} onSubmit={handleSignUp}>
        <h2>Fazer Cadastro</h2>

        <div>
          <label htmlFor="name">Nome completo</label>
          <input
            type="text"
            id="name"
            autoComplete="username"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Maria da Silva"
            required
          />
        </div>
        <div>
          <label htmlFor="document">CPF</label>
          <input
            type="text"
            id="document"
            onChange={(e) => setDocument(e.target.value)}
            value={document}
            inputMode="numeric"
            placeholder="123.456.789-10"
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Telefone/WhatsApp</label>
          <input
            type="text"
            id="phone"
            autoComplete="phone"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            inputMode="numeric"
            placeholder="11 9 9999-9999"
            required
          />
        </div>
        <div>
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="mariadasilva@gmail.com"
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
            value={password}
            required
          />
        </div>
        <button type="submit" disabled={signuping}>
          {signuping ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className={styles.sign_in}>
        Já tenho cadastro, <Link to="/signin">Acessar</Link>
      </p>
    </section>
  );
};

export default SignUp;
