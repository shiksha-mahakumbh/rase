import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EVENT_NAME } from "@/types/registration";

export async function POST(request: NextRequest) {
  let masterDocId: string | undefined;

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
      await updateDoc(doc(db, "registrations", masterDocId), {
        emailDeliveryStatus: emailStatus,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, emailStatus });
  } catch (error) {
    console.error("Email send error:", error);

    if (masterDocId) {
      try {
        await updateDoc(doc(db, "registrations", masterDocId), {
          emailDeliveryStatus: "failed",
          updatedAt: new Date(),
        });
      } catch {
        // ignore secondary update errors
      }
    }

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
