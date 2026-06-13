"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BeforePaymentFn = () => Promise<boolean>;

type RegistrationFlowContextValue = {
  registerBeforePayment: (fn: BeforePaymentFn) => () => void;
  requestPaymentStep: () => Promise<boolean>;
  currentFee: number;
  setCurrentFee: (fee: number) => void;
};

const RegistrationFlowContext = createContext<RegistrationFlowContextValue | null>(
  null
);

export function RegistrationFlowProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<BeforePaymentFn | null>(null);
  const [currentFee, setCurrentFee] = useState(0);

  const registerBeforePayment = useCallback((fn: BeforePaymentFn) => {
    handlerRef.current = fn;
    return () => {
      if (handlerRef.current === fn) handlerRef.current = null;
    };
  }, []);

  const requestPaymentStep = useCallback(async () => {
    if (!handlerRef.current) return true;
    return handlerRef.current();
  }, []);

  return (
    <RegistrationFlowContext.Provider
      value={{
        registerBeforePayment,
        requestPaymentStep,
        currentFee,
        setCurrentFee,
      }}
    >
      {children}
    </RegistrationFlowContext.Provider>
  );
}

export function useRegistrationFlow() {
  return useContext(RegistrationFlowContext);
}
