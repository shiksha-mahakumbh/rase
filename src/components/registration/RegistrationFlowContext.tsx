"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

type BeforePaymentFn = () => Promise<boolean>;

type RegistrationFlowContextValue = {
  registerBeforePayment: (fn: BeforePaymentFn) => () => void;
  requestPaymentStep: () => Promise<boolean>;
};

const RegistrationFlowContext = createContext<RegistrationFlowContextValue | null>(
  null
);

export function RegistrationFlowProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<BeforePaymentFn | null>(null);

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
      value={{ registerBeforePayment, requestPaymentStep }}
    >
      {children}
    </RegistrationFlowContext.Provider>
  );
}

export function useRegistrationFlow() {
  return useContext(RegistrationFlowContext);
}
