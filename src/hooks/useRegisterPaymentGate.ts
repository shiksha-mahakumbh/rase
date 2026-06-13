"use client";

import { useEffect } from "react";
import { useRegistrationFlow } from "@/components/registration/RegistrationFlowContext";

/** Register react-hook-form validation before advancing to the payment step. */
export function useRegisterPaymentGate(
  validate: () => Promise<boolean> | boolean
) {
  const flow = useRegistrationFlow();

  useEffect(() => {
    if (!flow) return;
    return flow.registerBeforePayment(async () => Boolean(await validate()));
  }, [flow, validate]);
}
