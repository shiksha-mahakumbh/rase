-- Orphan payment protection: store client-verified Razorpay payments before registration submit
CREATE TABLE "razorpay_verified_payments" (
    "id" UUID NOT NULL,
    "razorpay_payment_id" TEXT NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_signature" TEXT NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "verified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumed_at" TIMESTAMPTZ(6),
    "registration_uuid" UUID,
    "registration_public_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "razorpay_verified_payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "razorpay_verified_payments_razorpay_payment_id_key" ON "razorpay_verified_payments"("razorpay_payment_id");
CREATE INDEX "razorpay_verified_payments_razorpay_order_id_idx" ON "razorpay_verified_payments"("razorpay_order_id");
CREATE INDEX "razorpay_verified_payments_consumed_at_idx" ON "razorpay_verified_payments"("consumed_at");
