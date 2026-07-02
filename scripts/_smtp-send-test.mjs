import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const to = process.argv[2] ?? "shikshamahakumbh23@gmail.com";

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;
const port = Number(process.env.SMTP_PORT ?? 587);
const from = process.env.SMTP_FROM ?? user;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

const info = await transporter.sendMail({
  from,
  to,
  subject: "Shiksha Mahakumbh 6.0 — Email delivery test (SMK2026-000026)",
  html: `<p>This is a delivery test for registration <strong>SMK2026-000026</strong> (Ramendra Singh).</p>
<p>If you received this, SMTP delivery to your inbox is working. Also check Spam and Promotions tabs.</p>
<p>Time: ${new Date().toISOString()}</p>`,
});

console.log("sent:", { to, from, messageId: info.messageId, response: info.response });
await transporter.close();
