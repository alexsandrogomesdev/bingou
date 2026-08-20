import { useState } from "react";

// STYLES
import styles from "./ForgotPassword.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";
import { X } from "lucide-react";

// COMPONENTS
interface Props {
  setShowForgotPass: React.Dispatch<React.SetStateAction<boolean>>;
}
const Recover = ({ setShowForgotPass }: Props) => {
  const mainContext = useMainContext();
  const { request } = useFetch();

  const [email, setEmail] = useState<string>("");
  const handleRecover = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const recover: { message: string } = await request(
      "/recover-password",
      "POST",
      {},
      {
        email: email,
      },
    );
    if (recover.message === "ok") {
      mainContext.setAlert({
        id: Date.now(),
        type: "success",
        message:
          "Se o e-mail estiver correto, você receberá um email para recuperação de senha.",
      });
      setShowForgotPass(false);
    } else {
      mainContext.setAlert({
        id: Date.now(),
        type: "error",
        message:
          "Falha ao recuperar senha, tente novamente ou contate o suporte.",
      });
    }
    return;
  };

  return (
    <section className={styles.section_recover}>
      <div className={styles.div_recover}>
        <nav>
          <h1>Recuperação de conta</h1>
          <X onClick={() => setShowForgotPass(false)} />
        </nav>
        <form
          className={styles.form_recover}
          onSubmit={(e) => handleRecover(e)}
        >
          <label htmlFor={"email"}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={"email@exemplo.com"}
            required
          />
          <span>
            Se o e-mail estiver correto e existir no sistema, você receberá um
            e-mail com um link seguro para alterar sua senha.
          </span>
          <button type="submit">Recuperar</button>
        </form>
      </div>
    </section>
  );
};

export default Recover;
