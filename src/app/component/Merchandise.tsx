// pages/merchandise.tsx

import React from "react";
import SlideShow from "./SlideShow"; // Ensure the path is correct

const merchandiseItems = [
  {
    id: 1,
    title: "T-shirt",
    slides: [
      { src: "/merchandise/tshirt/1.jpg", alt: "T-shirt Image 1", legend: "" },
      { src: "/merchandise/tshirt/3.jpg", alt: "T-shirt Image 2", legend: "" },
      { src: "/merchandise/tshirt/2.jpg", alt: "T-shirt Image 3", legend: "" },
    ],
    price: 500,
  },
  {
    id: 2,
    title: "Mug",
    slides: [
      { src: "/merchandise/mug/1.jpg", alt: "Mug Image 1", legend: "" },
    ],
    price: 200,
  },
  {
    id: 3,
    title: "Cap",
    slides: [
      { src: '/merchandise/cap/1.jpg', alt: 'Cap Image 1', legend: '' },
      { src: '/merchandise/cap/1.jpg', alt: 'Cap Image 2', legend: '' },
    ],
    price: 200,
  },
 
  {
    id: 5,
    title: "Bag",
    slides: [
      { src: '/merchandise/bag/1.jpg', alt: 'Bag Image 1', legend: '' },
      { src: '/merchandise/bag/1.jpg', alt: 'Bag Image 2', legend: '' },
    ],
    price: 400,
  },
];

const Merchandise = () => {
  return (
    <div className="p-4 m-auto md:p-8 sm:w-3/5">
      <h1 className="text-3xl font-bold mb-8 text-center">Merchandise</h1>
      {merchandiseItems.map((item) => (
        <section key={item.id} className={`mb-8`}>
          <h2 className="text-2xl font-semibold mb-4 text-left">{item.title}</h2>
          <div className=" mx-auto">
            <SlideShow slides={item.slides} />
          </div>

          <p className="text-lg font-semibold mb-4 text-left">
            <span className="font-bold text-primary text-xl">Price:</span> &#8377;{item.price} plus delivery charges
          </p>
          <div className="text-center">
            <a href="/commingsoon" className="inline-block">
              <button className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark">
                Buy Now
              </button>
            </a>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Merchandise;
