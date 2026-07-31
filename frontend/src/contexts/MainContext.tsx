import { createContext, useState, useMemo, type ReactNode } from "react";

export type AlertObject = {
  id: number;
  type: string;
  message: string;
};
export type MainContextData = {
  contextStatus: string;
  setContextStatus: React.Dispatch<React.SetStateAction<string>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  alert: AlertObject;
  setAlert: React.Dispatch<React.SetStateAction<AlertObject>>;
  userId: number;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
};

export const MainContext = createContext<MainContextData>(
  {} as MainContextData,
);

export const MainContextProvider = ({ children }: { children: ReactNode }) => {
  const [contextStatus, setContextStatus] = useState<string>("Main Context...");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertObject>({
    id: 0,
    type: "",
    message: "",
  });

  const contextVariables = useMemo(
    () => ({
      contextStatus,
      setContextStatus,
      menuOpen,
      setMenuOpen,
      alert,
      setAlert,
      userId,
      setUserId,
    }),
    [contextStatus, menuOpen, alert, userId],
  );

  return (
    <MainContext.Provider value={contextVariables}>
      {children}
    </MainContext.Provider>
  );
};
