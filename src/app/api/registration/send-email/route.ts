import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { EVENT_NAME } from "@/types/registration";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REG_ID_RE = /^SMK2026-\d{6}$/;

export async function POST(request: NextRequest) {
  let masterDocId: string | undefined;

  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `email:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  const emailSecret = process.env.REGISTRATION_EMAIL_SECRET;
  if (emailSecret) {
    const provided =
      request.headers.get("x-registration-secret") ??
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const requireSecret =
      process.env.REGISTRATION_EMAIL_REQUIRE_SECRET === "true";
    if (provided && provided !== emailSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (requireSecret && provided !== emailSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const { registrationId, registrationType, fullName, email } = body;
    masterDocId = body.masterDocId;

    if (!registrationId || !email || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!REG_ID_RE.test(registrationId)) {
      return NextResponse.json(
        { error: "Invalid registration ID" },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email) || String(fullName).length < 2) {
      return NextResponse.json(
        { error: "Invalid email or name" },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom =
      process.env.SMTP_FROM ?? "noreply@shikshamahakumbh.org";

    let emailStatus: "sent" | "failed" | "skipped" = "skipped";

    if (smtpHost && smtpUser && smtpPass) {
      const port = Number(process.env.SMTP_PORT ?? 587);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,
        requireTLS: port === 587,
        auth: {
          user: smtpUser,
          pass: smtpPass.replace(/\s+/g, ""),
        },
      });

      const html = `
        <p>Dear ${fullName},</p>
        <p>Your registration has been successfully submitted.</p>
        <p><strong>Registration ID:</strong><br/>${registrationId}</p>
        <p><strong>Registration Type:</strong><br/>${registrationType}</p>
        <p>Please keep this Registration ID for future communication.</p>
        <p>Regards,<br/>${EVENT_NAME} Organizing Team</p>
      `;

      await transporter.verify();
      await transporter.sendMail({
        from: `"${EVENT_NAME}" <${smtpFrom}>`,
        to: email,
        subject: `${EVENT_NAME} Registration Confirmation`,
        html,
      });

      emailStatus = "sent";
    }

    if (masterDocId) {
      await getAdminFirestore()
        .collection("registrations")
        .doc(masterDocId)
        .update({
          emailDeliveryStatus: emailStatus,
          updatedAt: FieldValue.serverTimestamp(),
        });
    }

    return NextResponse.json({ success: true, emailStatus });
  } catch (error) {
    console.error("Email send error:", error);

    if (masterDocId) {
      try {
        await getAdminFirestore()
          .collection("registrations")
          .doc(masterDocId)
          .update({
            emailDeliveryStatus: "failed",
            updatedAt: FieldValue.serverTimestamp(),
          });
      } catch (updateError) {
        console.error("email status update failed:", updateError);
      }
    }

    return NextResponse.json({
      success: false,
      emailStatus: "failed",
      error: "Failed to send email",
    });
  }
}
