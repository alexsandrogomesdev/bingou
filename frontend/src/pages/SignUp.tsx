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

  const maskDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    const newValue = [];
    for (let c = 0; c < value.length; c++) {
      if (c === 3 || c === 6) {
        newValue.push(".");
        newValue.push(value[c]);
      } else if (c === 9) {
        newValue.push("-");
        newValue.push(value[c]);
      } else if (c <= 10) {
        newValue.push(value[c]);
      }
    }
    setDocument(newValue.join(""));
    return;
  };
  const maskPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    const newValue = [];
    for (let c = 0; c < value.length; c++) {
      if (c === 2 || c === 3) {
        newValue.push(" ");
        newValue.push(value[c]);
      } else if (c === 7) {
        newValue.push("-");
        newValue.push(value[c]);
      } else if (c <= 10) {
        newValue.push(value[c]);
      }
    }
    setPhone(newValue.join(""));
    return;
  };
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
            onChange={(e) => maskDocument(e)}
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
            onChange={(e) => maskPhone(e)}
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
          {signuping ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <p className={styles.sign_in}>
        Já tenho cadastro, <Link to="/signin">Acessar</Link>
      </p>
    </section>
  );
};

export default SignUp;
