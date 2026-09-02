"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, Pencil, Search, X } from "lucide-react";

type ReferenceValue =
  | string
  | {
      _id: string;
      name?: string;
      value?: string;
    };

type Phone = {
  _id: string;
  name: string;

  brand?: ReferenceValue;
  brandId?: ReferenceValue;

  price: number;
  description: string;

  image: string;
  imageUrl?: string | null;
  imageFileId?: string | null;

  isNewPhone: boolean;
  isActive: boolean;

  variant?: ReferenceValue;
  variantId?: ReferenceValue;

  ram?: ReferenceValue;
  ramId?: ReferenceValue;

  rom?: ReferenceValue;
  romId?: ReferenceValue;
};

type ManagePhoneListProps = {
  onEdit: (phone: Phone) => void;
  refreshKey: number;
};

type MasterItem = {
  _id: string;
  name?: string;
  value?: string;
  isActive: boolean;
};

const getReferenceText = (value?: ReferenceValue) => {
  if (!value) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.name || value.value || "—";
};

export default function ManagePhoneList({
  onEdit,
  refreshKey,
}: ManagePhoneListProps) {
  const [phones, setPhones] = useState<Phone[]>([]);

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedRom, setSelectedRom] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  const [priceChanged, setPriceChanged] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const [brandVariants, setBrandVariants] = useState<MasterItem[]>([]);

  const priceFilterRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<{
    brands: MasterItem[];
    variants: MasterItem[];
    rams: MasterItem[];
    roms: MasterItem[];
    price: {
      min: number;
      max: number;
    };
  }>({
    brands: [],
    variants: [],
    rams: [],
    roms: [],
    price: {
      min: 0,
      max: 0,
    },
  });

  const [updatingId, setUpdatingId] = useState<string | null>(null);

/*
 * -----------------------------------------
 * SEARCH DEBOUNCE
 * -----------------------------------------
 */

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 400);

  return () => {
    clearTimeout(timer);
  };
}, [searchTerm]);

/*
 * -----------------------------------------
 * FETCH PHONES
 * -----------------------------------------
 */

useEffect(() => {
  const fetchPhones = async () => {
    try {
  if (phones.length === 0) {
    setLoading(true);
  }

  setIsFetching(true);

  const params = new URLSearchParams();

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/phones?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch phones");
      }

      const data = await response.json();

      setPhones(data.phones || []);
    } catch (error) {
      console.error("Error fetching phones:", error);
    } finally {
  setLoading(false);
  setIsFetching(false);
}
  };

  fetchPhones();
}, [
  refreshKey,
  debouncedSearch,
  selectedBrand,
  selectedVariant,
  selectedRam,
  selectedRom,
  priceRange,
  priceChanged,
]);

/*
 * -----------------------------------------
 * FETCH FILTER OPTIONS
 * -----------------------------------------
 */

useEffect(() => {
  const fetchFilters = async () => {
    try {
      const params = new URLSearchParams();

       if (selectedBrand) {
        params.set("brandId", selectedBrand);
      }

      if (selectedVariant) {
        params.set("variantId", selectedVariant);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/phones/filters?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch phone filters");
      }

      const data = await response.json();

      setFilters(data);

      if (data.rams.length === 1) {
  setSelectedRam(data.rams[0]._id);
} else if (data.rams.length > 1) {
  setSelectedRam("");
}

if (data.roms.length === 1) {
  setSelectedRom(data.roms[0]._id);
} else if (data.roms.length > 1) {
  setSelectedRom("");
}

    } catch (error) {
      console.error("Error fetching phone filters:", error);
    }
  };

  fetchFilters();
}, [selectedBrand, selectedVariant]);

/*
 * -----------------------------------------
 * FETCH VARIANTS BY BRAND
 * -----------------------------------------
 */

useEffect(() => {
  const fetchVariantsByBrand = async () => {
    if (!selectedBrand) {
      setBrandVariants([]);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/phones/variants?brandId=${selectedBrand}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch variants");
      }

      const data = await response.json();

      setBrandVariants(data);
      setSelectedVariant((currentVariant) => {
  const stillValid = data.some(
    (variant: MasterItem) => variant._id === currentVariant,
  );

  if (stillValid) {
    return currentVariant;
  }

  if (data.length === 1) {
    return data[0]._id;
  }

  return "";
});

    } catch (error) {
      console.error("Error fetching brand variants:", error);
    }
  };

  fetchVariantsByBrand();
}, [selectedBrand]);

/*
 * -----------------------------------------
 * RESET DEPENDENT FILTERS
 * -----------------------------------------
 */

useEffect(() => {
  setSelectedVariant("");
  setSelectedRam("");
  setSelectedRom("");
}, [selectedBrand]);

/*
 * -----------------------------------------
 * SET INITIAL PRICE RANGE
 * -----------------------------------------
 */

useEffect(() => {
  if (filters.price.max > 0 && !priceChanged) {
    setPriceRange([0, filters.price.max]);
  }
}, [filters.price.max, priceChanged]);

/*
 * -----------------------------------------
 * CLOSE PRICE POPUP
 * -----------------------------------------
 */

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
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);

/*
 * -----------------------------------------
 * CLEAR FILTERS
 * -----------------------------------------
 */

const clearFilters = () => {
  setSearchTerm("");
  setDebouncedSearch("");

  setSelectedBrand("");
  setSelectedVariant("");
  setSelectedRam("");
  setSelectedRom("");

  setPriceChanged(false);
  setShowPriceFilter(false);

  if (filters.price.max > 0) {
    setPriceRange([filters.price.min, filters.price.max]);
  } else {
    setPriceRange([0, 0]);
  }
};

  /*
   * -----------------------------------------
   * TOGGLE ACTIVE / INACTIVE
   * -----------------------------------------
   */
  const togglePhoneStatus = async (phone: Phone) => {
    try {
      setUpdatingId(phone._id);

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/phones/${phone._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update phone status");
      }

      setPhones((currentPhones) =>
        currentPhones.map((currentPhone) =>
          currentPhone._id === phone._id
            ? {
                ...currentPhone,
                isActive: data.phone?.isActive ?? !currentPhone.isActive,
              }
            : currentPhone,
        ),
      );
    } catch (error) {
      console.error("Toggle phone status error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  /*
   * -----------------------------------------
   * LOADING
   * -----------------------------------------
   */
  if (loading) {
    return (
      <p
        className="mt-12"
        style={{
          color: "var(--text-secondary)",
        }}
      >
        Loading phones...
      </p>
    );
  }

  /*
   * -----------------------------------------
   * UI
   * -----------------------------------------
   */
  return (
    <section className="mt-6">
      <div className="mt-6 flex flex-nowrap items-center gap-2 overflow-visible pb-2">
        {/* SEARCH */}

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
            }}
            placeholder="Search phones..."
            className="w-full bg-transparent outline-none"
            style={{
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* BRAND */}

        <select
          value={selectedBrand}
          onChange={(event) => {
            setSelectedBrand(event.target.value);
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
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* VARIANT */}

        <select
          value={selectedVariant}
          onChange={(event) => {
            setSelectedVariant(event.target.value);
          }}
          disabled={selectedBrand !== "" && brandVariants.length === 1}
          className="w-24 shrink-0 cursor-pointer rounded-xl border px-3 py-3 outline-none"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <option value="">Variant</option>

          {(selectedBrand ? brandVariants : filters.variants).map((variant) => (
            <option key={variant._id} value={variant._id}>
              {variant.name}
            </option>
          ))}
        </select>

        {/* RAM */}

        <select
          value={selectedRam}
          onChange={(event) => {
            setSelectedRam(event.target.value);
          }}
          disabled={filters.rams.length === 1}
          className="w-24 shrink-0 cursor-pointer rounded-xl border px-3 py-3 outline-none"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <option value="">RAM</option>

          {filters.rams.map((ram) => (
            <option key={ram._id} value={ram._id}>
              {ram.value}
            </option>
          ))}
        </select>

        {/* ROM */}

        <select
          value={selectedRom}
          onChange={(event) => {
            setSelectedRom(event.target.value);
          }}
          disabled={filters.roms.length === 1}
          className="w-24 shrink-0 cursor-pointer rounded-xl border px-3 py-3 outline-none"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <option value="">ROM</option>

          {filters.roms.map((rom) => (
            <option key={rom._id} value={rom._id}>
              {rom.value}
            </option>
          ))}
        </select>

        {/* PRICE */}

        <div ref={priceFilterRef} className="relative shrink-0">
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

            <ChevronDown size={16} />
          </button>

          {showPriceFilter && (
            <div
              className="absolute left-0 top-full z-30 mt-2 w-80 rounded-2xl border p-5 shadow-xl"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <p className="text-sm font-semibold">PRICE</p>

              <div className="relative mt-6 h-6">
                <div
                  className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                  style={{
                    backgroundColor: "var(--border-color)",
                  }}
                />

                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                  style={{
                    left:
                      filters.price.max > 0
                        ? `${(priceRange[0] / filters.price.max) * 100}%`
                        : "0%",
                    right:
                      filters.price.max > 0
                        ? `${100 - (priceRange[1] / filters.price.max) * 100}%`
                        : "0%",
                    backgroundColor: "var(--accent-color)",
                  }}
                />

                {/* MIN */}

                <input
                  type="range"
                  min={0}
                  max={filters.price.max}
                  value={priceRange[0]}
                  onChange={(event) => {
                    const minimum = Number(event.target.value);

                    setPriceRange([
                      Math.min(minimum, priceRange[1]),
                      priceRange[1],
                    ]);

                    setPriceChanged(true);
                  }}
                  className="price-slider absolute inset-0 w-full"
                  style={{
                    zIndex: 3,
                  }}
                />

                {/* MAX */}

                <input
                  type="range"
                  min={filters.price.min}
                  max={filters.price.max}
                  value={priceRange[1]}
                  onChange={(event) => {
                    const maximum = Number(event.target.value);

                    setPriceRange([
                      priceRange[0],
                      Math.max(maximum, priceRange[0]),
                    ]);

                    setPriceChanged(true);
                  }}
                  className="price-slider absolute inset-0 w-full"
                  style={{
                    zIndex: 2,
                  }}
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-primary)",
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

                <div
                  className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                >
                  ₹{priceRange[1].toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          )}
        </div>
        {(searchTerm ||
          selectedBrand ||
          selectedVariant ||
          selectedRam ||
          selectedRom ||
          priceChanged) && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-xl px-3 py-3 text-sm font-medium transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
      <div className="mt-8 space-y-4">
        {phones.length === 0 ? (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            No phones found.
          </div>
        ) : (
          phones.map((phone) => {
            const brand = phone.brandId || phone.brand;

            const variant = phone.variantId || phone.variant;

            const ram = phone.ramId || phone.ram;

            const rom = phone.romId || phone.rom;

            return (
              <div
                key={phone._id}
                className="flex items-center gap-6 rounded-2xl border p-5 transition"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {/* IMAGE */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                  {phone.image ? (
                    <img
                      src={phone.image}
                      alt={phone.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span
                      className="text-xs"
                      style={{
                        color: "var(--text-secondary)",
                      }}
                    >
                      No image
                    </span>
                  )}
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {getReferenceText(brand)}
                  </p>

                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {phone.name}
                  </h3>

                  <p
                    className="mt-1"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    ₹{phone.price.toLocaleString("en-IN")}
                  </p>

                  <div
                    className="mt-2 flex flex-wrap gap-2 text-xs"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span>{getReferenceText(variant)}</span>

                    <span>•</span>

                    <span>{getReferenceText(ram)} RAM</span>

                    <span>•</span>

                    <span>{getReferenceText(rom)} ROM</span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex shrink-0 items-center gap-3">
                  {/* EDIT */}
                  <button
                    type="button"
                    onClick={() => onEdit(phone)}
                    className="flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition"
                    style={{
                      backgroundColor: "var(--text-primary)",
                      color: "var(--bg-primary)",
                    }}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>      
    </section>
  );
}
