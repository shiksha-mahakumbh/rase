import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

function getSmtpConfig() {
  const brevoHost = process.env.BREVO_SMTP_HOST?.trim();
  const brevoUser = process.env.BREVO_SMTP_USER?.trim();
  const brevoPass = process.env.BREVO_SMTP_PASS?.trim();
  if (brevoHost && brevoUser && brevoPass) {
    return {
      host: brevoHost,
      user: brevoUser,
      pass: brevoPass,
      port: Number(process.env.BREVO_SMTP_PORT ?? 587),
      from: process.env.BREVO_SMTP_FROM ?? process.env.SMTP_FROM,
    };
  }
  return {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD,
    port: Number(process.env.SMTP_PORT ?? 587),
    from: process.env.SMTP_FROM,
  };
}

const { host, user, pass, port, from } = getSmtpConfig();

if (!host || !user || !pass) {
  console.log("SMTP incomplete — set BREVO_SMTP_* or SMTP_* in .env.local");
  process.exit(1);
}

console.log("Verifying:", { host, port, user: user.replace(/(.{3}).+(@.*)/, "$1***$2"), from });

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

try {
  const ok = await transporter.verify();
  console.log("SMTP verify:", ok ? "PASS" : "FAIL");
} catch (e) {
  console.log("SMTP verify FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
}

await transporter.close();
