import { useState, memo, useEffect } from "react";

// STYLES
import styles from "./ResetPassword.module.css";
import { Eye, EyeClosed } from "lucide-react";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";

// COMPONENTS

const ResetPassword = () => {
  const mainContext = useMainContext();

  useEffect(() => {
    mainContext.setHeaderTitle("Redefinir senha");
    mainContext.setHeaderSubTitle("");
  }, []);

  const [typePasswordA, setTypePasswordA] = useState<string>("password");
  const [typePasswordB, setTypePasswordB] = useState<string>("password");
  const [passwordA, setPasswordA] = useState<string>("");
  const [passwordB, setPasswordB] = useState<string>("");
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const checkPasswords = () => {
      if (passwordA.length < 6) {
        setError("A senha precisa ter pelo menos 6 digitos!");
      } else if (passwordA !== passwordB) {
        setError("As senhas não coincidem!");
      } else {
        setError("");
      }
    };
    checkPasswords();
  }, [passwordA, passwordB]);

  const { request } = useFetch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleChangePassword = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const token = searchParams.get("token");
    const changePassword: { message: string } = await request(
      "/change-password",
      "PATCH",
      {},
      {
        token: token,
        password: passwordA,
      },
    );
    if (changePassword.message === "ok") {
      mainContext.setAlert({
        id: Date.now(),
        type: "success",
        message: "Senha alterada com sucesso.",
      });
      navigate("/signin");
    } else {
      mainContext.setAlert({
        id: Date.now(),
        type: "error",
        message: "Falha ao alterar senha.",
      });
    }
  };

  return (
    <section className={styles.section_reset}>
      <div className={styles.div_reset}>
        <nav>
          <h1>Redefinir senha</h1>
        </nav>
        <form
          className={styles.form_reset}
          onSubmit={(e) => handleChangePassword(e)}
        >
          <div>
            <label htmlFor={"passwordA"}>Nova senha</label>
            <input
              id="passwordA"
              type={typePasswordA}
              value={passwordA}
              onChange={(e) => setPasswordA(e.target.value)}
              required
            />
            {typePasswordA === "password" ? (
              <Eye onClick={() => setTypePasswordA("text")} />
            ) : (
              <EyeClosed onClick={() => setTypePasswordA("password")} />
            )}
          </div>

          <div>
            <label htmlFor={"passwordB"}>Confirme a nova senha</label>
            <input
              id="passwordB"
              type={typePasswordB}
              value={passwordB}
              onChange={(e) => setPasswordB(e.target.value)}
              required
            />
            {typePasswordB === "password" ? (
              <Eye onClick={() => setTypePasswordB("text")} />
            ) : (
              <EyeClosed onClick={() => setTypePasswordB("password")} />
            )}
          </div>

          <span>{error}</span>
          <button type="submit" disabled={error !== "" ? true : false}>
            Alterar senha
          </button>
        </form>
      </div>
    </section>
  );
};

export default memo(ResetPassword);
