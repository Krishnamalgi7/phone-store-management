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
    <div
  className="relative rounded-3xl border p-6 shadow-sm"
  style={{
    backgroundColor: "var(--bg-secondary)",
    borderColor: "var(--border-color)",
    color: "var(--text-primary)",
  }}
>

      {/* New badge */}

      {isNew && (
        <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
          New
        </span>
      )}

      {/* Phone image */}

      <div
  className="flex h-64 items-center justify-center rounded-xl"
  style={{
    backgroundColor: "var(--bg-primary)",
  }}
>
        <img
          src={image}
          alt={name}
          className="h-full w-full rounded-xl object-contain"
        />
      </div>

      {/* Brand */}

      <p
  className="mt-5 text-sm font-medium"
  style={{
    color: "var(--text-secondary)",
  }}
>
  {brand}
</p>

      {/* Name */}

      <h3
  className="text-xl font-bold"
  style={{
    color: "var(--text-primary)",
  }}
>
        {name}
      </h3>

      {/* Description */}

      <p
  style={{
    color: "var(--text-secondary)",
  }}
>
        {description}
      </p>

      {/* Price */}

      <p className="mt-4 text-lg font-semibold">
        {price}
      </p>

      {/* View button */}

      <button className="theme-accent-hover mt-8 inline-block cursor-pointer rounded-full px-6 py-1 font-semibold transition"
        style={{
  backgroundColor: "var(--text-primary)",
  color: "var(--bg-primary)",
}}
>
        View Phone
      </button>

    </div>
  );
}

export default PhoneCard;