"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { RotateCcw } from "lucide-react";

import PhoneCard from "./PhoneCard";

type Phone = {
  _id: string;
  name: string;
  brand: string;
  variant: string;
  price: number;
  description: string;
  image: string;
  isNewPhone: boolean;
  ram: string;
  rom: string;
};

type PhoneFilters = {
  brands: string[];
  variants: string[];
  rams: string[];
  roms: string[];
  price: {
    min: number;
    max: number;
  };
};

export default function PhoneList() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [filters, setFilters] = useState<PhoneFilters>({
    brands: [],
    variants: [],
    rams: [],
    roms: [],
    price: {
      min: 0,
      max: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  //Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedRom, setSelectedRom] = useState("");

  // Price
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [priceChanged, setPriceChanged] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const priceFilterRef = useRef<HTMLDivElement>(null);
  

  // Find highest phone price
  const maxPrice = filters.price.max;

  // b
  const buildParams = () => {
    const params = new URLSearchParams();

    params.set("page", String(currentPage));
    params.set("limit", "6");

    if (debouncedSearch.trim()) {
  params.set("search", debouncedSearch.trim());
}

    if (selectedBrand) {
      params.set("brand", selectedBrand);
    }

    if (selectedVariant) {
      params.set("variant", selectedVariant);
    }

    if (selectedRam) {
      params.set("ram", selectedRam);
    }

    if (selectedRom) {
      params.set("rom", selectedRom);
    }

    if (priceChanged) {
  params.set("minPrice", String(priceRange[0]));
  params.set("maxPrice", String(priceRange[1]));
}

    return params;
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
  setSearchTerm("");
  setDebouncedSearch("");

  setSelectedBrand("");
  setSelectedVariant("");
  setSelectedRam("");
  setSelectedRom("");

  setPriceChanged(false);

  if (filters.price.max > 0) {
    setPriceRange([
      0,
      filters.price.max,
    ]);
  } else {
    setPriceRange([0, 0]);
  }

  setCurrentPage(1);
};

  // Fetch phones
  useEffect(() => {
    const fetchPhones = async () => {
      if (phones.length === 0) {
        setLoading(true);
      }

      try {
        setIsFetching(true);
        setError("");

        const params = buildParams();

        const response = await fetch(
          `http://localhost:5000/api/phones?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch phones");
        }

        const data = await response.json();

        setPhones(data.phones);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching phones:", error);
        setError("Unable to load phones.");
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchPhones();
  }, [
    currentPage,
    debouncedSearch,
    selectedBrand,
    selectedVariant,
    selectedRam,
    selectedRom,
    priceRange,
  ]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/phones/filters",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch phone filters");
        }

        const data: PhoneFilters = await response.json();

        setFilters(data);
      } catch (error) {
        console.error("Error fetching phone filters:", error);
      }
    };

    fetchFilters();
  }, []);

  // Set initial price range after phones are loaded
  useEffect(() => {
    if (filters.price.max > 0) {
      setPriceRange([0, filters.price.max]);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      priceFilterRef.current &&
      !priceFilterRef.current.contains(event.target as Node)
    ) {
      setShowPriceFilter(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleOutsideClick,
    );
  };
}, []);

  const hasActiveFilters =
  searchTerm.trim() !== "" ||
  selectedBrand !== "" ||
  selectedVariant !== "" ||
  selectedRam !== "" ||
  selectedRom !== "" ||
  priceChanged;

  return (
    <section
      id="phones"
      className="px-6 py-12 md:px-12 lg:px-24"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Section container */}
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <h2
          className="text-3xl font-bold"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Explore Our Phones
        </h2>

        {/* Filter row */}
        <div className="mt-6 flex flex-nowrap items-center gap-2 overflow-visible pb-2">
          {/* Search */}
          <div
            className="flex w-56 shrink-0 items-center gap-3 rounded-xl border px-4 py-3"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <Search
              size={20}
              style={{
                color: "var(--text-secondary)",
              }}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                resetToFirstPage();
              }}
              placeholder="Search phones..."
              className="w-full bg-transparent outline-none"
              style={{
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Brand */}
          <select
            value={selectedBrand}
            onChange={(event) => {
              setSelectedBrand(event.target.value);
              resetToFirstPage();
            }}
            className="w-24 shrink-0 cursor-pointer rounded-xl border px-3 py-3 outline-none"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="">Brand</option>

            {filters.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {/* Variant */}
          <select
            value={selectedVariant}
            onChange={(event) => {
              setSelectedVariant(event.target.value);
              resetToFirstPage();
            }}
            className="w-24 shrink-0 cursor-pointer rounded-xl border px-3 py-3 outline-none"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="">Variant</option>

            {filters.variants.map((variant) => (
              <option key={variant} value={variant}>
                {variant}
              </option>
            ))}
          </select>

          {/* RAM */}
          <select
            value={selectedRam}
            onChange={(event) => {
              setSelectedRam(event.target.value);
              resetToFirstPage();
            }}
            className="w-24 shrink-0 cursor-pointer rounded-xl border px-3 py-3 outline-none"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="">RAM</option>

            {filters.rams.map((ram) => (
              <option key={ram} value={ram}>
                {ram}
              </option>
            ))}
          </select>

          {/* ROM */}
          <select
            value={selectedRom}
            onChange={(event) => {
              setSelectedRom(event.target.value);
              resetToFirstPage();
            }}
            className="w-24 shrink-0 cursor-pointer rounded-xl border px-3 py-3 outline-none"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="">ROM</option>

            {filters.roms.map((rom) => (
              <option key={rom} value={rom}>
                {rom}
              </option>
            ))}
          </select>

          {/* Price */}
          <div 
           ref={priceFilterRef}
          className="relative shrink-0">
            {/* Price button */}
            <button
              type="button"
              onClick={() => setShowPriceFilter((current) => !current)}
              className="flex w-24 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-xl border px-3 py-3 outline-none transition"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <span>Price</span>

              <ChevronDown
                size={16}
                style={{
                  color: "var(--text-primary)",
                }}
              />
            </button>

            {/* Price popup */}
            {showPriceFilter && (
              <div
                className="absolute left-0 top-full z-30 mt-2 w-80 rounded-2xl border p-5 shadow-xl"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {/* Title */}
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  PRICE
                </p>

                {/* Two-handle price slider */}
                <div className="relative mt-6 h-6">
                  {/* Background track */}
                  <div
                    className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                    style={{
                      backgroundColor: "var(--border-color)",
                    }}
                  />

                  {/* Selected range */}
                  <div
                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                    style={{
                      left: `${
                        maxPrice > 0 ? (priceRange[0] / maxPrice) * 100 : 0
                      }%`,
                      right: `${
                        maxPrice > 0
                          ? 100 - (priceRange[1] / maxPrice) * 100
                          : 0
                      }%`,
                      backgroundColor: "var(--accent-color)",
                    }}
                  />

                  {/* Minimum handle */}
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(event) => {
                      const minimum = Number(event.target.value);

                      setPriceRange([
                        Math.min(minimum, priceRange[1]),
                        priceRange[1],
                      ]);

                      resetToFirstPage();
                      setPriceChanged(true);
                    }}
                    className="price-slider absolute inset-0 w-full"
                    style={{
                      zIndex: 3,
                    }}
                  />

                  {/* Maximum handle */}
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(event) => {
                      const maximum = Number(event.target.value);

                      setPriceRange([
                        priceRange[0],
                        Math.max(maximum, priceRange[0]),
                      ]);

                      resetToFirstPage();
                      setPriceChanged(true);
                    }}
                    className="price-slider absolute inset-0 w-full"
                    style={{
                      zIndex: 2,
                    }}
                  />
                </div>

                {/* Price values */}
                <div className="mt-4 flex items-center gap-3">
                  {/* Minimum */}
                  <div
                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    ₹{priceRange[0].toLocaleString("en-IN")}
                  </div>

                  <span
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    to
                  </span>

                  {/* Maximum */}
                  <div
                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    ₹{priceRange[1].toLocaleString("en-IN")}
                  </div>
                  
                </div>
                
              </div>
              
            )}
          </div>
          {hasActiveFilters && (
<button
  type="button"
  onClick={clearFilters}
  title="Clear filters"
  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition"
  style={{
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    borderColor: "var(--border-color)",
  }}
>
  <RotateCcw size={17} strokeWidth={2.0} />
</button>
)}
        </div>

        {isFetching && !loading && (
          <div
            className="mb-3 flex items-center justify-end gap-2 text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            <span
              className="h-2 w-2 animate-pulse rounded-full"
              style={{
                backgroundColor: "var(--accent-color)",
              }}
            />
            Updating results...
          </div>
        )}

        {/* Phone grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Loading */}
          {loading && (
            <p
              className="col-span-full text-center"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Loading phones...
            </p>
          )}

          {/* Error */}
          {error && (
            <p
              className="col-span-full text-center"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {error}
            </p>
          )}

          {/* Phones */}
          {!loading &&
            !error &&
            phones.map((phone) => (
              <PhoneCard
                key={phone._id}
                id={phone._id}
                brand={phone.brand}
                name={phone.name}
                description={phone.description}
                price={phone.price}
                image={phone.image}
                isNew={phone.isNewPhone}
              />
            ))}

          {/* No results */}
          {!loading && !error && phones.length === 0 && (
            <p
              className="col-span-full py-10 text-center"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              No phones found matching your filters.
            </p>
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((page) => page - 1);
              }}
              className="cursor-pointer rounded-xl border px-5 py-3 transition disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              Previous
            </button>

            <span
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((page) => page + 1);
              }}
              className="cursor-pointer rounded-xl border px-5 py-3 transition disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
