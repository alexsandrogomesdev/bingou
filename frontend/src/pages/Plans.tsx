import { useEffect, memo, useState } from "react";

// STYLES
import styles from "./Plans.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";
import PixOrder from "../components/PixOrder.tsx";
import { Loader } from "lucide-react";

// COMPONENTS

interface Props {
  plan: number;
  setShowGetPlan: React.Dispatch<React.SetStateAction<boolean>>;
  generateOrder: () => void;
  loading: boolean;
}
const GetPlan = ({ plan, setShowGetPlan, generateOrder, loading }: Props) => {
  const plans = ["Básico", "Completo"];
  return (
    <section className={styles.section_get_plan}>
      <div className={styles.div_get_plan}>
        <p>
          Deseja comprar o plano <span>{plans[plan - 1]}</span> ?
        </p>
        <div>
          <button disabled={loading} onClick={generateOrder}>
            {loading ? <Loader className={styles.loading} /> : "Sim"}
          </button>
          <button disabled={loading} onClick={() => setShowGetPlan(false)}>
            Não
          </button>
        </div>
      </div>
    </section>
  );
};
const Plans = () => {
  const mainContext = useMainContext();

  useEffect(() => {
    mainContext.setHeaderTitle("Planos");
    mainContext.setHeaderSubTitle("");
  }, []);

  const { request } = useFetch();
  const [pixCode, setPixCode] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [amount, setAmount] = useState<string>("0,00");
  const [showPixOrder, setShowPixOrder] = useState<boolean>(false);
  const [plan, setPlan] = useState<number>(0);
  const [showGetPlan, setShowGetPlan] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetPlan = (plan: number) => {
    setPlan(plan);
    setShowGetPlan(true);
  };
  const generateOrder = async () => {
    setLoading(true);
    interface RequestType {
      message: string;
      pixCode: string;
      orderId: string;
      amount: string;
    }
    const response: RequestType = await request(
      "/orders/new",
      "POST",
      {},
      { plan: plan },
    );
    setLoading(false);
    setShowGetPlan(false);
    if (response.message !== "ok") {
      mainContext.setAlert({
        id: Date.now(),
        type: "error",
        message:
          "Falha ao gerar o pedido, tente novamente ou contate o suporte!",
      });
    } else {
      setShowPixOrder(true);
      setOrderId(response.orderId);
      setPixCode(response.pixCode);
      setAmount(response.amount);
    }
  };

  return (
    <section className={styles.section_plans}>
      {showPixOrder && (
        <PixOrder orderId={orderId} pixCode={pixCode} amount={amount} />
      )}
      {showGetPlan && (
        <GetPlan
          plan={plan}
          setShowGetPlan={setShowGetPlan}
          generateOrder={generateOrder}
          loading={loading}
        />
      )}
      <div
        className={`${styles.div_plans} ${showPixOrder ? styles.hide : styles.show}`}
      >
        <h1>Planos de assinatura</h1>
        <ul className={styles.ul_plans}>
          <li>
            <h2>Inicial</h2>
            <p>Limite de 50 cartelas por maço.</p>
            <span>Grátis</span>
          </li>
          <li>
            <h2>Básico</h2>
            <p>Limite de 2.000 cartelas por maço.</p>
            <span>R$ 19,90/mês no Pix</span>
            <a
              // href="https://wa.me/5511995452626"
              onClick={() => handleGetPlan(1)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Comprar
            </a>
          </li>
          <li>
            <h2>Completo</h2>
            <p>Limite de 10.000 cartelas por maço.</p>
            <span>R$ 29,90/mês no Pix</span>
            <a
              // href="https://wa.me/5511995452626"
              onClick={() => handleGetPlan(2)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Comprar
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default memo(Plans);
