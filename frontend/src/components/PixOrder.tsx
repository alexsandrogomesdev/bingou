import { useEffect, useState } from "react";

// STYLES
import styles from "./PixOrder.module.css";
import { useFetch } from "../hooks/useFetch.tsx";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMainContext } from "../hooks/useMainContext.tsx";

// HOOKS

// COMPONENTS
interface Props {
  orderId: string;
  pixCode: string;
  amount: string;
}
const PixOrder = ({ orderId, pixCode, amount }: Props) => {
  const mainContext = useMainContext();
  const handleCopyCode = () => {
    navigator.clipboard.writeText(pixCode);
    mainContext.setAlert({
      id: Date.now(),
      type: "success",
      message: "Código pix Copiado com sucesso.",
    });
  };

  const { request } = useFetch();
  const [status, setStatus] = useState<number>(0);
  useEffect(() => {
    if (status !== 0 || !orderId) return;

    const checkStatus = async () => {
      interface RequestResponse {
        message: string;
        status: number;
        plan: number;
      }
      const response: RequestResponse = await request(
        `/orders/${orderId}/status`,
        "GET",
        {},
        {},
      );
      if (response.message !== "ok") return;
      setStatus(response.status);
      if (response.status === 1) {
        localStorage.setItem("plan", String(response.plan));
      }
    };

    const intervalId = setInterval(checkStatus, 3000);
    return () => clearInterval(intervalId);
  }, [orderId, status, request]);

  return (
    <section className={styles.section_pix_order}>
      <div className={styles.div_pix_order}>
        <div
          className={`${styles.div_waiting_payment} ${status !== 1 ? styles.show : styles.hide}`}
        >
          <h3>Aguardando pagamento!</h3>
          <span>{amount}</span>
          <p>
            Faça o pagamento do código pix abaixo para completar sua assinatura.
          </p>
          <label htmlFor={"pixCode"}>Código Pix:</label>
          <input type="text" value={pixCode} disabled={true} />
          <button onClick={handleCopyCode}>Copiar código</button>
        </div>
        <div
          className={`${styles.div_payment_confirmed} ${status === 1 ? styles.show : styles.hide}`}
        >
          <h3>Pagamento confirmado!</h3>
          <CheckCircle2 />
          <Link to="/packs">Meus Maços</Link>
        </div>
      </div>
    </section>
  );
};

export default PixOrder;
