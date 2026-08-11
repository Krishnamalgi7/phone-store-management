type PhoneCardProps = {
  brand: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isNew?: boolean;
};

function PhoneCard({
  brand,
  name,
  description,
  price,
  image,
  isNew,
}: PhoneCardProps) {
  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">

      {/* Show New badge only when isNew is true */}
      {isNew && (
        <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
          New
        </span>
      )}

      {/* Phone image */}
      <div className="flex h-64 items-center justify-center rounded-xl bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full rounded-xl object-contain"
        />
      </div>

      {/* Phone brand */}
      <p className="mt-5 text-sm font-medium text-gray-500">
        {brand}
      </p>

      {/* Phone name */}
      <h3 className="mt-1 text-xl font-bold">
        {name}
      </h3>

      {/* Phone description */}
      <p className="mt-2 text-gray-600">
        {description}
      </p>

      {/* Phone price */}
      <p className="mt-4 text-lg font-semibold">
        {price}
      </p>

      {/* View button */}
      <button className="mt-auto cursor-pointer rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-yellow-500">
        View Phone
      </button>

    </div>
  );
}

export default PhoneCard;