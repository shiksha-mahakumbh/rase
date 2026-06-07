"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SlideShow from "./SlideShow";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import AdSlotRegion from "@/components/showcase/AdSlotRegion";

const merchandiseItems = [
  {
    id: 1,
    title: "Shiksha Mahakumbh T-shirt",
    category: "apparel",
    slides: [
      { src: "/merchandise/tshirt/1.jpg", alt: "T-shirt Image 1", legend: "" },
      { src: "/merchandise/tshirt/2.jpg", alt: "T-shirt Image 2", legend: "" },
      { src: "/merchandise/tshirt/3.jpg", alt: "T-shirt Image 3", legend: "" },
    ],
    price: 500,
  },
  {
    id: 2,
    title: "Official Mug",
    category: "drinkware",
    slides: [{ src: "/merchandise/mug/1.jpg", alt: "Mug Image 1", legend: "" }],
    price: 200,
  },
  {
    id: 3,
    title: "Cap",
    category: "apparel",
    slides: [
      { src: "/merchandise/cap/1.jpg", alt: "Cap Image 1", legend: "" },
      { src: "/merchandise/cap/2.jpg", alt: "Cap Image 2", legend: "" },
    ],
    price: 200,
  },
  {
    id: 4,
    title: "Conference Bag",
    category: "accessories",
    slides: [
      { src: "/merchandise/bag/1.jpg", alt: "Bag Image 1", legend: "" },
      { src: "/merchandise/bag/2.jpg", alt: "Bag Image 2", legend: "" },
    ],
    price: 400,
  },
] as const;

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "apparel", label: "Apparel" },
  { id: "drinkware", label: "Drinkware" },
  { id: "accessories", label: "Accessories" },
] as const;

const Merchandise = () => {
  const [category, setCategory] = useState<string>("all");

  const filtered =
    category === "all"
      ? merchandiseItems
      : merchandiseItems.filter((item) => item.category === category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-surface via-white to-brand-surface-warm">
      <ShowcaseHero
        eyebrow="Official Store"
        title="Shiksha Mahakumbh Official Merchandise"
        subtitle={
          <p>
            Be part of the <strong>Shiksha Mahakumbh Abhiyan</strong> by owning
            exclusive event merchandise that represents unity, knowledge, and the
            spirit of <strong>Indian Education for Global Development</strong>.
          </p>
        }
        accent="saffron"
      />

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Merchandise" },
          ]}
          className="mb-8"
        />

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Product categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`min-h-[40px] rounded-full px-4 py-2 text-sm font-semibold ${
                category === cat.id
                  ? "bg-brand-navy text-white"
                  : "bg-white text-brand-navy ring-1 ring-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {filtered.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition hover:shadow-xl"
            >
              <div className="p-4 md:p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-saffron-dark">
                  {item.category}
                </span>
                <h2 className="mt-1 text-xl font-bold text-brand-navy md:text-2xl">
                  {item.title}
                </h2>
                <div className="mt-4">
                  <SlideShow slides={[...item.slides]} />
                </div>
                <p className="mt-4 text-center">
                  <span className="text-2xl font-bold text-brand-navy">₹{item.price}</span>{" "}
                  <span className="text-sm text-gray-500">+ delivery charges</span>
                </p>
                <div className="mt-4 text-center">
                  <Link
                    href="/coming-soon"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-saffron px-8 py-3 font-bold text-brand-navy transition hover:bg-brand-saffron-dark"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <AdSlotRegion />

        <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy to-brand-navy-light px-6 py-10 text-center text-white md:px-10">
          <h3 className="text-2xl font-bold md:text-3xl">
            Join the Movement of Educational Renaissance
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-white/90">
            Support the mission of <strong>Shiksha Mahakumbh Abhiyan</strong> by
            purchasing official merchandise and spreading the message of holistic
            education across Bharat and the world.
          </p>
          <Link
            href="/introduction"
            className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-white px-8 py-3 font-semibold text-brand-navy hover:bg-brand-surface-warm"
          >
            Learn More
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Merchandise;
