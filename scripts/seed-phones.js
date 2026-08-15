const phones = [
  {
    name: "iPhone 16 Pro",
    brand: "Apple",
    price: 109999,
    description: "Powerful smartphone with a premium design and advanced performance.",
    image:
      "https://images.unsplash.com/photo-1592286927505-2fd0b7b8f8c7",
    isNewPhone: true,
  },
  {
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    price: 129999,
    description: "Premium Samsung smartphone with flagship performance and features.",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
    isNewPhone: true,
  },
  {
    name: "OnePlus 13",
    brand: "OnePlus",
    price: 69999,
    description: "Fast and powerful smartphone designed for smooth everyday performance.",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
    isNewPhone: false,
  },
  {
    name: "Pixel 9 Pro",
    brand: "Google",
    price: 99999,
    description: "Google smartphone with a clean experience and advanced camera capabilities.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    isNewPhone: false,
  },
];

async function seedPhones() {
  for (const phone of phones) {
    try {
      const response = await fetch("http://localhost:3000/api/phones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(phone),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`Failed to add ${phone.name}:`, data);
        continue;
      }

      console.log(`Added: ${phone.name}`);
    } catch (error) {
      console.error(`Error adding ${phone.name}:`, error);
    }
  }

  console.log("Seeding completed.");
}

seedPhones();