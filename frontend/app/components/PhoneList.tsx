"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import PhoneCard from "./PhoneCard";

type MasterItem = {
  _id: string;
  name?: string;
  value?: string;
  isActive: boolean;
};

type Phone = {
  _id: string;
  name: string;

  brand:
    | string
    | {
        _id: string;
        name: string;
      };

  variant:
    | string
    | {
        _id: string;
        name: string;
      };

  ram:
    | string
    | {
        _id: string;
        value: string;
      };

  rom:
    | string
    | {
        _id: string;
        value: string;
      };

  price: number;
  description: string;
  image: string;
  isNewPhone: boolean;
};

type PhoneFilters = {
  brands: MasterItem[];
  variants: MasterItem[];
  rams: MasterItem[];
  roms: MasterItem[];

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

  // Pagination

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);

  // Search

  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Selected master-data IDs

  const [selectedBrand, setSelectedBrand] = useState("");

  const [selectedVariant, setSelectedVariant] = useState("");

  const [brandVariants, setBrandVariants] = useState<MasterItem[]>([]);

  const [selectedRam, setSelectedRam] = useState("");

  const [selectedRom, setSelectedRom] = useState("");

  // Price

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  const [priceChanged, setPriceChanged] = useState(false);

  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const priceFilterRef = useRef<HTMLDivElement>(null);

  /*
   * ------------------------------------------------
   * BUILD API PARAMETERS
   * ------------------------------------------------
   */

  const buildParams = () => {
    const params = new URLSearchParams();

    params.set("page", String(currentPage));

    // 9 phones per page
    params.set("limit", "9");

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

  /*
   * ------------------------------------------------
   * RESET PAGE
   * ------------------------------------------------
   */

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  /*
   * ------------------------------------------------
   * CLEAR FILTERS
   * ------------------------------------------------
   */

  const clearFilters = () => {
    setSearchTerm("");

    setDebouncedSearch("");

    setSelectedBrand("");

    setSelectedVariant("");

    setSelectedRam("");

    setSelectedRom("");

    setPriceChanged(false);

    setCurrentPage(1);

    if (filters.price.max > 0) {
      setPriceRange([filters.price.min, filters.price.max]);
    } else {
      setPriceRange([0, 0]);
    }
  };

  /*
   * ------------------------------------------------
   * FETCH PHONES
   * ------------------------------------------------
   */

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        if (phones.length === 0) {
          setLoading(true);
        }

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

        setPhones(data.phones || []);

        setTotalPages(data.pagination?.totalPages || 0);
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
    priceChanged,
  ]);

  /*
   * ------------------------------------------------
   * FETCH FILTER OPTIONS
   * ------------------------------------------------
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
          `http://localhost:5000/api/phones/filters?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch phone filters");
        }

        const data: PhoneFilters = await response.json();

        setFilters(data);

        setPriceRange([0, data.price.max]);
        setPriceChanged(false);

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

  useEffect(() => {
    setSelectedVariant("");
    setSelectedRam("");
    setSelectedRom("");
  }, [selectedBrand]);

  useEffect(() => {
    const fetchVariantsByBrand = async () => {
      if (!selectedBrand) {
        setBrandVariants([]);
        setSelectedVariant("");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/phones/variants?brandId=${selectedBrand}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch variants");
        }

        const data = await response.json();

        setBrandVariants(data);

        setSelectedVariant((currentVariant) => {
          // If the current variant is valid for this brand,
          // keep it selected.
          const stillValid = data.some(
            (variant: MasterItem) => variant._id === currentVariant,
          );

          if (stillValid) {
            return currentVariant;
          }

          // If there is only one valid variant,
          // automatically select it.
          if (data.length === 1) {
            return data[0]._id;
          }

          // If there are multiple valid variants,
          // let the user choose.
          return "";
        });
      } catch (error) {
        console.error("Error fetching brand variants:", error);
      }
    };

    fetchVariantsByBrand();
  }, [selectedBrand]);

  /*
   * ------------------------------------------------
   * SEARCH DEBOUNCE
   * ------------------------------------------------
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
   * ------------------------------------------------
   * CLOSE PRICE POPUP WHEN CLICKING OUTSIDE
   * ------------------------------------------------
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
   * ------------------------------------------------
   * HELPERS
   * ------------------------------------------------
   */

  const getBrandName = (brand: Phone["brand"]) => {
    if (typeof brand === "string") {
      return brand;
    }

    return brand?.name || "";
  };

  /*
   * ------------------------------------------------
   * ACTIVE FILTER CHECK
   * ------------------------------------------------
   */

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedBrand !== "" ||
    selectedVariant !== "" ||
    selectedRam !== "" ||
    selectedRom !== "" ||
    priceChanged;

  /*
   * ------------------------------------------------
   * PRICE
   * ------------------------------------------------
   */

  const maxPrice = filters.price.max;

  return (
    <section
      id="phones"
      className="px-6 py-12 md:px-12 lg:px-24"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADING */}

        <h2
          className="text-3xl font-bold"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Explore Our Phones
        </h2>

        {/* FILTER ROW */}

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

                resetToFirstPage();
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

              resetToFirstPage();
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

            {(selectedBrand ? brandVariants : filters.variants).map(
              (variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.name}
                </option>
              ),
            )}
          </select>

          {/* RAM */}

          <select
            value={selectedRam}
            onChange={(event) => {
              setSelectedRam(event.target.value);

              resetToFirstPage();
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

              resetToFirstPage();
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

            {/* PRICE POPUP */}

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

                {/* SLIDER */}

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
                        maxPrice > 0
                          ? `${(priceRange[0] / maxPrice) * 100}%`
                          : "0%",
                      right:
                        maxPrice > 0
                          ? `${100 - (priceRange[1] / maxPrice) * 100}%`
                          : "0%",
                      backgroundColor: "var(--accent-color)",
                    }}
                  />

                  {/* MIN */}

                  <input
                    type="range"
                    min={filters.price.min}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(event) => {
                      const minimum = Number(event.target.value);

                      setPriceRange([
                        Math.min(minimum, priceRange[1]),
                        priceRange[1],
                      ]);

                      setPriceChanged(true);

                      resetToFirstPage();
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
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(event) => {
                      const maximum = Number(event.target.value);

                      setPriceRange([
                        priceRange[0],
                        Math.max(maximum, priceRange[0]),
                      ]);

                      setPriceChanged(true);

                      resetToFirstPage();
                    }}
                    className="price-slider absolute inset-0 w-full"
                    style={{
                      zIndex: 2,
                    }}
                  />
                </div>

                {/* PRICE VALUES */}

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

          {/* CLEAR */}

          {hasActiveFilters && (
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

        {/* FETCHING INDICATOR */}

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

        {/* PHONE GRID */}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

          {!loading &&
            !error &&
            phones.map((phone) => (
              <PhoneCard
                key={phone._id}
                id={phone._id}
                brand={getBrandName(phone.brand)}
                name={phone.name}
                description={phone.description}
                price={phone.price}
                image={phone.image}
                isNew={phone.isNewPhone}
              />
            ))}

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

        {/* PAGINATION */}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
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
              onClick={() => setCurrentPage((page) => page + 1)}
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
