type Phone = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  isNewPhone: boolean;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PhoneDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const response = await fetch(
    `http://localhost:3000/api/phones/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">
          Phone not found
        </h1>
      </main>
    );
  }

  const phone: Phone = await response.json();

  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-5xl">
        <div
          className="grid gap-10 rounded-3xl border p-8 md:grid-cols-2"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center justify-center rounded-2xl">
            <img
              src={phone.image}
              alt={phone.name}
              className="max-h-[500px] w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            {phone.isNewPhone && (
              <span className="mb-4 w-fit rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                New
              </span>
            )}

            <p
              className="text-sm font-medium"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {phone.brand}
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {phone.name}
            </h1>

            <p
              className="mt-5 leading-7"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {phone.description}
            </p>

            <p className="mt-6 text-2xl font-bold">
              ₹{phone.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}