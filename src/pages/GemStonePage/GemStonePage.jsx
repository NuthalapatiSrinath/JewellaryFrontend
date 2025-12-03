import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabSelector from "../../components/TabSelector/TabSelector";
import TickSlider from "../../components/TickSlider/TickSlider";
import DoubleRangeSlider from "../../components/DoubleRangeSlider/DoubleRangeSlider";
import EnhancedDynamicTable from "../../components/EnhancedDynamicTable/EnhancedDynamicTable";
import styles from "./GemStonePage.module.css";

const colorTicks = [
  "Alexandrite",
  "Blue Sapphire",
  "Pink Sapphire",
  "Ruby",
  "Emerald",
];
const cutTicks = ["Good", "Very Good", "Excellent", "Astor"];
const clarityTicks = ["S12", "S11", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];

const fmtCarat = (v) => Number(v).toFixed(2);

export default function GemStonePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(1);
  const [selectedShape, setSelectedShape] = useState(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [caratMin, setCaratMin] = useState(1.0);
  const [caratMax, setCaratMax] = useState(4.5);
  const [priceMin, setPriceMin] = useState(50);
  const [priceMax, setPriceMax] = useState(4000);
  const [cutIndex, setCutIndex] = useState(2);
  const [clarityIndex, setClarityIndex] = useState(2);
  const [fastShipping, setFastShipping] = useState(false);

  const shapeNames = useMemo(
    () => ["round", "oval", "princess", "cushion", "emerald", "pear", "heart"],
    []
  );

  // ✅ Detect shape/color from URL and preselect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shape = params.get("shape");
    const color = params.get("color");
    if (shape) setSelectedShape(shape.toLowerCase());
    if (color) {
      const idx = colorTicks.findIndex(
        (c) => c.toLowerCase() === color.toLowerCase()
      );
      if (idx !== -1) setColorIndex(idx);
    }
  }, [location.search]);

  // Product dataset
  const products = useMemo(() => {
    const base = [
      {
        id: "g-001",
        slug: "alexandrite-round-1-05",
        title: "1.05 Carat Round Cut Lab-Created Alexandrite",
        shape: "round",
        color: "Alexandrite",
        carat: 1.05,
        priceNumeric: 415,
        price: "$ 415 USD",
        sku: "ALR5",
        measurement: "6.0x6.0 MM",
        clarity: "VS2",
        cut: "Excellent",
        fastShipping: true,
        thumb: "/images/rings/gold.jpg",
      },
      {
        id: "g-002",
        slug: "ruby-round-1-15",
        title: "1.15 Carat Round Cut Lab-Created Ruby",
        shape: "round",
        color: "Ruby",
        carat: 1.15,
        priceNumeric: 454,
        price: "$ 454 USD",
        sku: "RUB2",
        measurement: "6.1x6.1 MM",
        clarity: "VS1",
        cut: "Very Good",
        fastShipping: false,
        thumb: "/images/rings/gold.jpg",
      },
      {
        id: "g-003",
        slug: "emerald-pear-1-20",
        title: "1.20 Carat Pear Cut Lab-Created Emerald",
        shape: "pear",
        color: "Emerald",
        carat: 1.2,
        priceNumeric: 474,
        price: "$ 474 USD",
        sku: "EMR3",
        measurement: "6.3x4.2 MM",
        clarity: "VVS2",
        cut: "Excellent",
        fastShipping: false,
        thumb: "/images/rings/gold.jpg",
      },
    ];

    const colors = [
      "Alexandrite",
      "Blue Sapphire",
      "Pink Sapphire",
      "Ruby",
      "Emerald",
    ];
    const shapes = [
      "round",
      "oval",
      "princess",
      "cushion",
      "pear",
      "heart",
      "asscher",
    ];
    const out = [...base];
    for (let i = 3; i < 55; i++) {
      const color = colors[i % colors.length];
      const shape = shapes[i % shapes.length];
      const carat = +(1 + (i % 35) * 0.05).toFixed(2);
      const priceNumeric = Math.round(350 + i * 20 + carat * 80);
      out.push({
        id: `g-${String(i + 1).padStart(3, "0")}`,
        slug: `${color.toLowerCase().replace(/\s+/g, "-")}-${shape}-${i + 1}`,
        title: `${carat} Carat ${
          shape.charAt(0).toUpperCase() + shape.slice(1)
        } ${color}`,
        shape,
        color,
        carat,
        priceNumeric,
        price: `$ ${priceNumeric} USD`,
        sku: `SKU${i + 1}`,
        measurement: `${(5 + (i % 5)).toFixed(1)}x${(5 + (i % 5)).toFixed(
          1
        )} MM`,
        clarity: clarityTicks[i % clarityTicks.length],
        cut: cutTicks[i % cutTicks.length],
        fastShipping: i % 6 === 0,
        thumb: `/images/rings/gold.jpg`,
      });
    }
    return out;
  }, []);

  // Filtering logic
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedShape && p.shape !== selectedShape) return false;
      if (p.carat < caratMin || p.carat > caratMax) return false;
      if (p.priceNumeric < priceMin || p.priceNumeric > priceMax) return false;
      const colorFilter = colorTicks[colorIndex];
      if (colorFilter && p.color !== colorFilter) return false;
      const cIdx = clarityTicks.indexOf(p.clarity);
      if (clarityIndex && cIdx > clarityIndex) return false;
      const cutIdx = cutTicks.indexOf(p.cut);
      if (cutIndex && cutIdx > cutIndex) return false;
      if (fastShipping && !p.fastShipping) return false;
      return true;
    });
  }, [
    products,
    selectedShape,
    caratMin,
    caratMax,
    priceMin,
    priceMax,
    colorIndex,
    clarityIndex,
    cutIndex,
    fastShipping,
  ]);

  // Update URL when selecting filters manually (shape or color)
  const updateURL = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    navigate({ search: params.toString() }, { replace: true });
  };

  const tableHeadings = [
    {
      title: "SHAPE",
      accessor: "shape",
      cell: (val) => <span className={styles.upper}>{val}</span>,
    },
    { title: "CARAT", accessor: "carat", cell: (v) => fmtCarat(v) },
    { title: "COLOR", accessor: "color" },
    { title: "PRICE", accessor: "price" },
  ];

  const tableData = visibleProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    shape: p.shape,
    carat: p.carat,
    color: p.color,
    price: p.price,
    sku: p.sku,
    measurement: p.measurement,
    thumb: p.thumb,
  }));

  const resetAll = () => {
    setSelectedShape(null);
    setCaratMin(1.0);
    setCaratMax(4.5);
    setPriceMin(50);
    setPriceMax(4000);
    setColorIndex(0);
    setClarityIndex(2);
    setCutIndex(2);
    setFastShipping(false);
    navigate("/gemstone", { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          ARRA Jewels &nbsp;|&nbsp; Loose Lab Created Gemstones
        </div>
        <h1 className={styles.title}>Loose Lab Created Gemstones</h1>
        <p className={styles.lead}>
          Shop an extensive collection of breathtaking lab gemstones, including
          rubies, emeralds, sapphires, and alexandrites.
        </p>
      </div>

      <div className={styles.belowPage}>
        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.topRow}>
            <TabSelector
              tabs={["Natural", "Lab Grown"]}
              activeIndex={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className={styles.filtersGrid}>
            <div className={styles.col}>
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Shape</h3>
                <div className={styles.shapeGrid}>
                  {shapeNames.map((name) => {
                    const isActive = selectedShape === name;
                    return (
                      <button
                        key={name}
                        className={`${styles.shapeBtn} ${
                          isActive ? styles.shapeActive : ""
                        }`}
                        onClick={() => {
                          const newShape = selectedShape === name ? null : name;
                          setSelectedShape(newShape);
                          updateURL("shape", newShape);
                        }}
                      >
                        <img
                          src={`/images/shapes/${name}.svg`}
                          alt={name}
                          className={styles.shapeImg}
                        />
                        <div className={styles.shapeLabel}>{name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Carat</h3>
                <div className={styles.rowBetween}>
                  <div>
                    Min{" "}
                    <span className={styles.pill}>{fmtCarat(caratMin)}</span>
                  </div>
                  <div>
                    Max{" "}
                    <span className={styles.pill}>{fmtCarat(caratMax)}</span>
                  </div>
                </div>
                <DoubleRangeSlider
                  min={0.5}
                  max={10}
                  step={0.01}
                  valueMin={caratMin}
                  valueMax={caratMax}
                  onChange={({ min, max }) => {
                    setCaratMin(min);
                    setCaratMax(max);
                  }}
                />
              </div>

              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Clarity</h3>
                <TickSlider
                  ticks={clarityTicks}
                  selectedIndex={clarityIndex}
                  onChange={setClarityIndex}
                />
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Price</h3>
                <div className={styles.rowBetween}>
                  <div className={styles.pricePill}>$ {priceMin}</div>
                  <div className={styles.pricePill}>$ {priceMax}</div>
                </div>
                <DoubleRangeSlider
                  min={50}
                  max={10000}
                  step={10}
                  valueMin={priceMin}
                  valueMax={priceMax}
                  onChange={({ min, max }) => {
                    setPriceMin(min);
                    setPriceMax(max);
                  }}
                />
              </div>

              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Color</h3>
                <TickSlider
                  ticks={colorTicks}
                  selectedIndex={colorIndex}
                  onChange={(idx) => {
                    setColorIndex(idx);
                    updateURL("color", colorTicks[idx]);
                  }}
                />
              </div>

              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Cut</h3>
                <TickSlider
                  ticks={cutTicks}
                  selectedIndex={cutIndex}
                  onChange={setCutIndex}
                />
              </div>
            </div>
          </div>

          <div className={styles.bottomControls}>
            <label className={styles.fastShipping}>
              <input
                type="checkbox"
                checked={fastShipping}
                onChange={(e) => setFastShipping(e.target.checked)}
              />
              Fast Shipping
            </label>

            <div className={styles.controlsRight}>
              <button className={styles.resetBtn} onClick={resetAll}>
                Reset ⭮
              </button>
            </div>
          </div>
        </div>

        <div className={styles.resultsHeader}>
          <div className={styles.resultsCount}>
            {visibleProducts.length} RESULTS
          </div>
        </div>

        <div className={styles.tableSection}>
          <EnhancedDynamicTable
            headings={tableHeadings}
            columnData={tableData}
          />
        </div>
      </div>
    </div>
  );
}
