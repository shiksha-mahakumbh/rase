import Link from "next/link";
import dynamic from "next/dynamic";
import { DHE_ORGANIZATION } from "@/config/organization";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";

const ContactUsForm = dynamic(() => import("@/components/contact/ContactUsForm"));
const ContactMap = dynamic(() => import("@/components/contact/ContactMap"));

const contactCards = [
  {
    id: "address",
    icon: "📍",
    title: "Office Address",
    content: (
      <address className="not-italic leading-relaxed text-gray-700">
        {DHE_ORGANIZATION.name}
        <br />
        {DHE_ORGANIZATION.address.line1}
        <br />
        {DHE_ORGANIZATION.address.line2},
        <br />
        {DHE_ORGANIZATION.address.line3},
        <br />
        {DHE_ORGANIZATION.address.state} {DHE_ORGANIZATION.address.pincode}
      </address>
    ),
  },
  {
    id: "email",
    icon: "📧",
    title: "Email",
    content: (
      <ul className="space-y-1">
        {DHE_ORGANIZATION.emails.map((email) => (
          <li key={email}>
            <a
              href={`mailto:${email}`}
              className="font-medium text-brand-navy hover:text-brand-saffron-dark hover:underline"
            >
              {email}
            </a>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "phone",
    icon: "📞",
    title: "Phone / WhatsApp",
    content: (
      <ul className="space-y-1">
        {DHE_ORGANIZATION.phones.map((phone) => (
          <li key={phone}>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="font-medium text-brand-navy hover:text-brand-saffron-dark hover:underline"
            >
              {phone}
            </a>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "website",
    icon: "🌐",
    title: "Website",
    content: (
      <ul className="space-y-1">
        {DHE_ORGANIZATION.websites.map((site) => (
          <li key={site.href}>
            <a
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-navy hover:text-brand-saffron-dark hover:underline"
            >
              {site.label}
            </a>
          </li>
        ))}
      </ul>
    ),
  },
] as const;

export default function ContactUs() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Contact Us" },
          ]}
          className="mb-8"
        />

        <section aria-labelledby="contact-cards-heading" className="mb-12">
          <h2 id="contact-cards-heading" className="sr-only">
            Contact information
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_32px_rgba(11,31,59,0.06)] transition hover:-translate-y-0.5 hover:border-brand-saffron/30 hover:shadow-lg"
              >
                <span className="text-2xl" aria-hidden>
                  {card.icon}
                </span>
                <h3 className="mt-3 text-sm font-bold uppercase tracking-wider text-brand-navy">
                  {card.title}
                </h3>
                <div className="mt-2 text-sm">{card.content}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          <ContactUsForm />
          <ContactMap />
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          For registration support, visit{" "}
          <Link href="/registration" className="font-semibold text-brand-navy hover:text-brand-saffron-dark">
            Registration
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
