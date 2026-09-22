import { createContext, useState, useMemo, type ReactNode, type Dispatch, type SetStateAction } from "react";

export type AlertObject = {
  id: number;
  type: string;
  message: string;
};
export type MainContextData = {
  contextStatus: string;
  setContextStatus: Dispatch<SetStateAction<string>>;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  showAds: boolean;
  setShowAds: Dispatch<SetStateAction<boolean>>;
  getCards: boolean;
  setGetCards: Dispatch<SetStateAction<boolean>>;
  alert: AlertObject;
  setAlert: Dispatch<SetStateAction<AlertObject>>;
  userId: number | null;
  setUserId: Dispatch<SetStateAction<number | null>>;
  headerTitle: string;
  setHeaderTitle: Dispatch<SetStateAction<string>>;
  headerSubTitle: string;
  setHeaderSubTitle: Dispatch<SetStateAction<string>>;
};

export const MainContext = createContext<MainContextData>({} as MainContextData);

export const MainContextProvider = ({ children }: { children: ReactNode }) => {
  const [contextStatus, setContextStatus] = useState<string>("Main Context...");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showAds, setShowAds] = useState<boolean>(true);
  const [getCards, setGetCards] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);
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
      menuOpen,
      setMenuOpen,
      showAds,
      setShowAds,
      getCards,
      setGetCards,
      alert,
      setAlert,
      userId,
      setUserId,
      headerTitle,
      setHeaderTitle,
      headerSubTitle,
      setHeaderSubTitle,
    }),
    [contextStatus, menuOpen, showAds, getCards, alert, userId, headerTitle, headerSubTitle],
  );

  return <MainContext.Provider value={contextVariables}>{children}</MainContext.Provider>;
};
