export type AdminRegistrationDocument = {
  label: string;
  url: string;
  fieldName: string;
};

export type AdminRegistrationView = {
  id: string;
  registrationId: string;
  registrationType: string;
  registrationStatus: string;
  paymentStatus: string;
  accommodationStatus: string;
  emailDeliveryStatus: string | null;
  personal: {
    fullName: string;
    gender: string;
    designation: string;
    institution: string;
    address: string;
    country: string;
    email: string;
    contactNumber: string;
    whatsappNumber: string | null;
    vidyaBharti: string;
  };
  accommodation: {
    required: string;
    date: string | null;
    type: string | null;
    category: string | null;
    status: string;
  } | null;
  payment: {
    status: string;
    utrNumber: string | null;
    transactionId: string | null;
    chequeNumber: string | null;
    panNumber: string | null;
    registrationFee: number | null;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    latestRecord: {
      amount: number;
      status: string;
      currency: string;
      razorpayPaymentId: string | null;
      createdAt: string;
    } | null;
  };
  lifecycle: {
    checkInStatus: string;
    checkedInAt: string | null;
    checkInLocation: string | null;
    kitDistributed: boolean;
    kitDistributedAt: string | null;
    certificateEligible: boolean;
    certificateLifecycleStatus: string;
    receiptGeneratedAt: string | null;
    receiptSentAt: string | null;
    qrGeneratedAt: string | null;
  };
  typeDetails: Record<string, string>;
  extraMetadata: Record<string, string>;
  documents: AdminRegistrationDocument[];
  emailLogs: Array<{
    subject: string;
    status: string;
    sentAt: string | null;
    createdAt: string;
  }>;
  statusHistory: Array<{
    fromStatus: string | null;
    toStatus: string;
    createdAt: string;
  }>;
  statusOptions: {
    registration: string[];
    payment: string[];
    accommodation: string[];
  };
  links: {
    receiptsAdmin: string;
    paymentAudit: string;
    checkIn: string;
  };
  createdAt: string;
  updatedAt: string;
};
