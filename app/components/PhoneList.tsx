import PhoneCard from "./PhoneCard";

const phones = [
  {
    brand: "NOVA",
    name: "NOVA 5G",
    description: "Powerful performance with a premium design.",
    price: "₹79,999",
    image:
      "https://cdn.moglix.com/p/ozhJ6RrWGkwJ9-xxlarge.png",
    isNew: true,
  },
  {
    brand: "NOVA",
    name: "NOVA 2 Ultra",
    description: "Advanced technology with an incredible camera.",
    price: "₹99,999",
    image:
      "https://cdn.beebom.com/mobile/ai-plus-nova-2-ultra-5g-front-back-3.png",
    isNew: false,
  },
  {
    brand: "NOVA",
    name: "NOVA 12 s",
    description: "Elegant design and reliable everyday performance.",
    price: "₹49,999",
    image:
      "https://cdn.beebom.com/mobile/huawei-nova-12s-front-back-2.png",
    isNew: false,
  },
  {
    brand: "NOVA",
    name: "NOVA 12 SE",
    description: "Upcoming model with cutting-edge features.",
    price: "₹89,999",
    image:
      "https://cdn.beebom.com/mobile/huawei-nova-12-se-front-back.png",
    isNew: false,
  },
];

export default function PhoneList() {
  return (
    <section
      id="phones"
      className="px-6 py-10 md:px-12 lg:px-24"
    >
      {/* Section container */}

      <div className="mx-auto max-w-7xl">

        {/* Section heading */}

        <h2 className="text-3xl font-bold">
          Explore Our Phones
        </h2>

        {/* Responsive phone grid */}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {phones.map((phone) => (
            <PhoneCard
              key={phone.name}
              brand={phone.brand}
              name={phone.name}
              description={phone.description}
              price={phone.price}
              image={phone.image}
              isNew={phone.isNew}
            />
          ))}

        </div>

      </div>
    </section>
  );
}