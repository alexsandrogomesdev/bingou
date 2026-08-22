import { useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";

// STYLES
import styles from "./SignIn.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS
import ForgotPassword from "../components/ForgotPassword.tsx";
import { Eye, EyeClosed } from "lucide-react";

const SignIn = () => {
  const mainContext = useMainContext();
  const { request } = useFetch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [typePassword, setTypePassword] = useState<string>("password");
  const [signing, setSigning] = useState<boolean>(false);

  const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSigning(true);

    interface Request {
      message: string;
      userId: string;
      plan: string;
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
      localStorage.setItem("userId", signIn.userId);
      localStorage.setItem("plan", signIn.plan);
      navigate("/packs");
    } else {
      mainContext.setAlert({
        id: Date.now(),
        type: "error",
        message: signIn.message,
      });
    }
  };

  const [showForgotPass, setShowForgotPass] = useState<boolean>(false);

  return (
    <>
      {showForgotPass && (
        <ForgotPassword setShowForgotPass={setShowForgotPass} />
      )}

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
              type={typePassword}
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.forgot_pass}
              onClick={() => setShowForgotPass(true)}
            >
              esqueci minha senha
            </span>
            {typePassword === "password" ? (
              <Eye onClick={() => setTypePassword("text")} />
            ) : (
              <EyeClosed onClick={() => setTypePassword("password")} />
            )}
          </div>
          <button type="submit" disabled={signing}>
            {signing ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className={styles.sign_up}>
          Não tenho cadastro, <Link to="/signup">Cadastrar-me</Link>
        </p>
      </section>
    </>
  );
};

export default memo(SignIn);
