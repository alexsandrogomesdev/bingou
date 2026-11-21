import { createContext, useState, useMemo, type ReactNode, type Dispatch, type SetStateAction } from "react";

export type AlertObject = {
  id: number;
  type: string;
  message: string;
};
export type MainContextData = {
  contextStatus: string;
  setContextStatus: Dispatch<SetStateAction<string>>;
  getCards: boolean;
  setGetCards: Dispatch<SetStateAction<boolean>>;
  alert: AlertObject;
  setAlert: Dispatch<SetStateAction<AlertObject>>;
  headerTitle: string;
  setHeaderTitle: Dispatch<SetStateAction<string>>;
  headerSubTitle: string;
  setHeaderSubTitle: Dispatch<SetStateAction<string>>;
};

export const MainContext = createContext<MainContextData>({} as MainContextData);

export const MainContextProvider = ({ children }: { children: ReactNode }) => {
  const [contextStatus, setContextStatus] = useState<string>("Main Context...");
  const [getCards, setGetCards] = useState<boolean>(true);
  const [headerTitle, setHeaderTitle] = useState<string>("Bingou");
  const [headerSubTitle, setHeaderSubTitle] = useState<string>("");
  const [alert, setAlert] = useState<AlertObject>({
    id: 0,
    type: "",
    message: "",
  });

  const contextVariables = useMemo<MainContextData>(
    () => ({
      contextStatus,
      setContextStatus,
      getCards,
      setGetCards,
      alert,
      setAlert,
      headerTitle,
      setHeaderTitle,
      headerSubTitle,
      setHeaderSubTitle,
    }),
    [contextStatus, getCards, alert, headerTitle, headerSubTitle],
  );

  return <MainContext.Provider value={contextVariables}>{children}</MainContext.Provider>;
};
