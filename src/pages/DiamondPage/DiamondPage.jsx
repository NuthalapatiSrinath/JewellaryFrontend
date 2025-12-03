import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TabSelector from "../../components/TabSelector/TabSelector";
import TickSlider from "../../components/TickSlider/TickSlider";
import DoubleRangeSlider from "../../components/DoubleRangeSlider/DoubleRangeSlider";

import styles from "./DiamondPage.module.css";

/**
 * DiamondPage
 * - All data is local/mock for now.
 * - Table rows expand in-place to show the large detail panel (no modal).
 * - Filters (basic + advanced) are wired and filter the table live.
 */

const shapeNamesDefault = [
  "round",
  "oval",
  "emerald",
  "cushion",
  "marquise",
  "pear",
  "princess",
  "asscher",
  "heart",
];
const cutTicks = ["Good", "Very Good", "Excellent", "Ideal"];
const colorTicks = ["G", "F", "E", "D"];
const clarityTicks = ["VS2", "VS1", "VVS2", "VVS1", "IF"];
const qualityOptions = [
  "What is most important to you?",
  "Superior Quality",
  "Biggest Diamond",
];
const polishOptions = ["All", "Very Good", "Excellent", "Ideal"];
const symmetryOptions = ["All", "Good", "Very Good", "Excellent", "Ideal"];
const fluorescenceOptions = [
  "All",
  "None",
  "Faint",
  "Medium",
  "Strong",
  "Very Strong",
];

const fmtCarat = (v) => (Number(v) || 0).toFixed(2);

export default function DiamondPage() {
  const navigate = useNavigate();

  // --- filter state ---
  const [activeTab, setActiveTab] = useState(1); // 0 Natural, 1 Lab Grown
  const [selectedShape, setSelectedShape] = useState(null);

  const [caratMin, setCaratMin] = useState(1.0);
  const [caratMax, setCaratMax] = useState(3.0);

  const [priceMin, setPriceMin] = useState(150);
  const [priceMax, setPriceMax] = useState(50000);

  const [colorIndex, setColorIndex] = useState(3); // maps to colorTicks (D)
  const [clarityIndex, setClarityIndex] = useState(1);
  const [cutIndex, setCutIndex] = useState(2);

  // advanced filters
  const [fancy, setFancy] = useState(null);
  const [tableMin, setTableMin] = useState(0);
  const [tableMax, setTableMax] = useState(100);
  const [polish, setPolish] = useState("All");
  const [depthMin, setDepthMin] = useState(0);
  const [depthMax, setDepthMax] = useState(100);
  const [lwMin, setLwMin] = useState(0);
  const [lwMax, setLwMax] = useState(3);
  const [fluorescence, setFluorescence] = useState("All");
  const [symmetry, setSymmetry] = useState("All");
  const [quality, setQuality] = useState(qualityOptions[0]);

  const [fastShipping, setFastShipping] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // --- mock products ---
  const products = useMemo(() => {
    // a few base entries then programmatically create more for realistic results
    const base = [
      {
        id: "d-001",
        slug: "round-1-00-igicertified",
        title:
          "1.00 Carat Round Shaped, Excellent Cut, D Color, VS1 Clarity, IGI Certified Lab Grown Diamond",
        shape: "round",
        cut: "Excellent",
        color: "D",
        clarity: "VS1",
        carat: 1.0,
        priceNumeric: 749,
        price: "$ 749 USD",
        sku: "EB-350159",
        measurement: "6.5x6.5 MM",
        thumb: "/images/diamonds/round-1.jpg",
        tablePercent: 58,
        depthPercent: 62,
        lwRatio: 1.0,
        polish: "Excellent",
        symmetry: "Ideal",
        fluorescence: "None",
        fancy: null,
        fastShipping: true,
      },
      {
        id: "d-002",
        slug: "round-1-00-ideal-d-vvs2",
        title: "1.00 Carat Round Shaped, Ideal Cut, D Color, VVS2 Clarity",
        shape: "round",
        cut: "Ideal",
        color: "D",
        clarity: "VVS2",
        carat: 1.0,
        priceNumeric: 765,
        price: "$ 765 USD",
        sku: "EB-350160",
        measurement: "6.5x6.5 MM",
        tablePercent: 60,
        depthPercent: 61,
        lwRatio: 1.0,
        polish: "Very Good",
        symmetry: "Excellent",
        fluorescence: "Faint",
        fancy: null,
        fastShipping: false,
      },
    ];

    const colors = ["D", "E", "F", "G"];
    const clarity = ["IF", "VVS1", "VVS2", "VS1", "VS2"];
    const cuts = ["Good", "Very Good", "Excellent", "Ideal"];
    const shapes = shapeNamesDefault;

    const out = [...base];
    for (let i = 2; i < 180; i++) {
      const color = colors[i % colors.length];
      const cl = clarity[i % clarity.length];
      const shape = shapes[i % shapes.length];
      const cut = cuts[i % cuts.length];
      const carat = +(0.9 + (i % 30) * 0.05).toFixed(2);
      const priceNumeric = Math.round(600 + i * 45 + carat * 120);
      out.push({
        id: `d-${String(i + 1).padStart(3, "0")}`,
        slug: `diamond-${shape}-${i + 1}`,
        title: `${carat} Carat ${
          shape.charAt(0).toUpperCase() + shape.slice(1)
        } ${color} ${cl} ${cut}`,
        shape,
        cut,
        color,
        clarity: cl,
        carat,
        priceNumeric,
        price: `$ ${priceNumeric} USD`,
        sku: `D-SKU-${i + 1}`,
        measurement: `${(5.5 + (i % 6)).toFixed(1)}x${(5.5 + (i % 6)).toFixed(
          1
        )} MM`,
        thumb: `/images/diamonds/${shape}.jpg`,
        tablePercent: 50 + (i % 20),
        depthPercent: 55 + (i % 20),
        lwRatio: +(0.8 + (i % 30) * 0.02).toFixed(2),
        polish: polishOptions[i % polishOptions.length],
        symmetry: symmetryOptions[i % symmetryOptions.length],
        fluorescence: fluorescenceOptions[i % fluorescenceOptions.length],
        fancy: i % 11 === 0 ? "Pink" : null,
        fastShipping: i % 7 === 0,
      });
    }
    return out;
  }, []);

  // --- filtering logic (applies all filters) ---
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      // tab (Natural vs Lab Grown) - for demo we use ID parity
      if (activeTab === 0 && p.id.endsWith("0")) return false; // simple example
      if (selectedShape && p.shape !== selectedShape) return false;
      if (p.carat < caratMin || p.carat > caratMax) return false;
      if (p.priceNumeric < priceMin || p.priceNumeric > priceMax) return false;

      // color & clarity & cut as indexes/ticks
      const colorFilter = colorTicks[colorIndex];
      if (colorFilter && p.color !== colorFilter) return false;

      // clarity: clearer (smaller index = worse?) we use index as "minimum index allowed"
      const allowedClarityIndex = clarityIndex;
      const pClarityIndex = clarityTicks.indexOf(p.clarity);
      if (allowedClarityIndex != null && pClarityIndex > allowedClarityIndex)
        return false;

      const allowedCutIndex = cutIndex;
      const pCutIndex = cutTicks.indexOf(p.cut);
      if (allowedCutIndex != null && pCutIndex > allowedCutIndex) return false;

      if (fastShipping && !p.fastShipping) return false;

      // advanced filters
      if (fancy && p.fancy !== fancy) return false;
      if (p.tablePercent < tableMin || p.tablePercent > tableMax) return false;
      if (polish !== "All" && p.polish !== polish) return false;
      if (p.depthPercent < depthMin || p.depthPercent > depthMax) return false;
      if (p.lwRatio < lwMin || p.lwRatio > lwMax) return false;
      if (fluorescence !== "All" && p.fluorescence !== fluorescence)
        return false;
      if (symmetry !== "All" && p.symmetry !== symmetry) return false;
      if (
        quality !== qualityOptions[0] &&
        quality === "Superior Quality" &&
        p.priceNumeric > 100000
      )
        return false;

      return true;
    });
  }, [
    products,
    activeTab,
    selectedShape,
    caratMin,
    caratMax,
    priceMin,
    priceMax,
    colorIndex,
    clarityIndex,
    cutIndex,
    fastShipping,
    fancy,
    tableMin,
    tableMax,
    polish,
    depthMin,
    depthMax,
    lwMin,
    lwMax,
    fluorescence,
    symmetry,
    quality,
  ]);

  // --- table expand state ---
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // --- clear filters ---
  const clearFilters = () => {
    setSelectedShape(null);
    setCaratMin(1.0);
    setCaratMax(3.0);
    setPriceMin(150);
    setPriceMax(50000);
    setColorIndex(3);
    setClarityIndex(1);
    setCutIndex(2);
    setFastShipping(false);
    setFancy(null);
    setTableMin(0);
    setTableMax(100);
    setPolish("All");
    setDepthMin(0);
    setDepthMax(100);
    setLwMin(0);
    setLwMax(3);
    setFluorescence("All");
    setSymmetry("All");
    setQuality(qualityOptions[0]);
    setShowAdvanced(false);
  };

  // --- table headings & data for DynamicTable component below ---
  const headings = [
    { title: "SHAPE", accessor: "shape" },
    { title: "CARAT", accessor: "carat" },
    { title: "CUT", accessor: "cut" },
    { title: "COLOR", accessor: "color" },
    { title: "CLARITY", accessor: "clarity" },
    { title: "PRICE", accessor: "price" },
    {
      title: "ACTION",
      accessor: "action",
      cell: (v, row) => (
        <button className={styles.viewBtn} onClick={() => toggleExpand(row.id)}>
          VIEW ▾
        </button>
      ),
    },
  ];

  const tableData = visibleProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    shape: p.shape,
    carat: fmtCarat(p.carat),
    cut: p.cut,
    color: p.color,
    clarity: p.clarity,
    price: p.price,
    sku: p.sku,
    measurement: p.measurement,
    thumb: p.thumb,
    full: p,
  }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          ARRA Jewels &nbsp;|&nbsp; Shop Lab Created Diamonds
        </div>
        <h1 className={styles.title}>Shop Lab Created Diamonds</h1>
        <p className={styles.lead}>
          Shop the largest selection of GIA and IGI certified Type IIa
          lab-created diamonds. Chemically, physically, and optically identical
          to earth-mined diamonds, Lab-Created Diamonds are the perfect choice
          for anyone seeking exceptional beauty, unmatched quality.
          {/* unbeatable value. Inventory changes daily. If you don’t see what
          you’re looking for, live chat or call us and we’ll find you the
          perfect diamond from our offline inventory.  */}
        </p>
      </header>
<div className={styles.belowPage}>
      <section className={styles.filtersSection}>
        {/* <div className={styles.topRow}>
          <TabSelector
            tabs={["Natural", "Lab Grown"]}
            activeIndex={activeTab}
            onTabChange={setActiveTab}
          />
        </div> */}

        {/* SHAPE full-width row */}
        <div className={styles.shapeRow}>
          <div className={styles.shapeLabel}>
            SHAPE <span className={styles.info}>ⓘ</span>
          </div>
          <div className={styles.shapeScroller}>
            {shapeNamesDefault.map((name) => {
              const isActive = selectedShape === name;
              return (
                <button
                  key={name}
                  className={`${styles.shapeBtn} ${
                    isActive ? styles.shapeActive : ""
                  }`}
                  onClick={() =>
                    setSelectedShape((s) => (s === name ? null : name))
                  }
                >
                  <img
                    src={`/images/shapes/${name}.svg`}
                    alt={name}
                    className={styles.shapeImg}
                  />
                  <div className={styles.shapeName}>{name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* two column filters */}
        <div className={styles.filtersTwoCol}>
          {/* LEFT column */}
          <div className={styles.col}>
            <div className={styles.block}>
              <div className={styles.blockLabel}>
                CARAT <span className={styles.info}>ⓘ</span>
              </div>
              <div className={styles.rangeRow}>
                <div className={styles.pill}>Min {fmtCarat(caratMin)}</div>
                <div className={styles.pill}>Max {fmtCarat(caratMax)}</div>
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
              <div className={styles.blockLabel}>
                PRICE <span className={styles.info}>ⓘ</span>
              </div>
              <div className={styles.rangeRow}>
                <div className={styles.pill}>${priceMin}</div>
                <div className={styles.pill}>${priceMax}</div>
              </div>
              <DoubleRangeSlider
                min={100}
                max={200000}
                step={50}
                valueMin={priceMin}
                valueMax={priceMax}
                onChange={({ min, max }) => {
                  setPriceMin(min);
                  setPriceMax(max);
                }}
              />
            </div>

            <div className={styles.block}>
              <div className={styles.blockLabel}>
                CUT <span className={styles.info}>ⓘ</span>
              </div>
              <TickSlider
                ticks={cutTicks}
                selectedIndex={cutIndex}
                onChange={setCutIndex}
              />
            </div>
          </div>

          {/* RIGHT column */}
          <div className={styles.col}>
            <div className={styles.block}>
              <div className={styles.blockLabel}>
                COLOR <span className={styles.info}>ⓘ</span>
              </div>
              <TickSlider
                ticks={colorTicks}
                selectedIndex={colorIndex}
                onChange={setColorIndex}
              />
            </div>

            <div className={styles.block}>
              <div className={styles.blockLabel}>
                CLARITY <span className={styles.info}>ⓘ</span>
              </div>
              <TickSlider
                ticks={clarityTicks}
                selectedIndex={clarityIndex}
                onChange={setClarityIndex}
              />
            </div>

            <div className={styles.block}>
              <div className={styles.blockLabel}>
                CERTIFIED BY <span className={styles.info}>ⓘ</span>
              </div>
              <select
                className={styles.selectBox}
                defaultValue="All"
                onChange={() => {
                  /* stub: add cert filter if needed */
                }}
              >
                <option>All</option>
                <option>IGI</option>
                <option>GIA</option>
              </select>
            </div>
          </div>
        </div>

        {/* advanced filters (togglable) */}
        {showAdvanced && (
          <div className={styles.advancedSection}>
            <div className={styles.advTwoCol}>
              <div className={styles.advCol}>
                <div className={styles.block}>
                  <div className={styles.blockLabel}>
                    FANCY <span className={styles.info}>ⓘ</span>
                  </div>
                  <div className={styles.fancyRow}>
                    {["Orange", "Pink", "Yellow", "Blue", "Other"].map((f) => (
                      <button
                        key={f}
                        className={`${styles.fancySwatch} ${
                          fancy === f ? styles.fancyActive : ""
                        }`}
                        onClick={() =>
                          setFancy((cur) => (cur === f ? null : f))
                        }
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.blockLabel}>TABLE %</div>
                  <div className={styles.rangeRow}>
                    <div className={styles.pill}>{tableMin}%</div>
                    <div className={styles.pill}>{tableMax}%</div>
                  </div>
                  <DoubleRangeSlider
                    min={0}
                    max={100}
                    step={1}
                    valueMin={tableMin}
                    valueMax={tableMax}
                    onChange={({ min, max }) => {
                      setTableMin(min);
                      setTableMax(max);
                    }}
                  />
                </div>

                <div className={styles.block}>
                  <div className={styles.blockLabel}>POLISH</div>
                  <select
                    className={styles.selectBox}
                    value={polish}
                    onChange={(e) => setPolish(e.target.value)}
                  >
                    {polishOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.advCol}>
                <div className={styles.block}>
                  <div className={styles.blockLabel}>L:W RATIO</div>
                  <div className={styles.rangeRow}>
                    <div className={styles.pill}>{lwMin}</div>
                    <div className={styles.pill}>{lwMax}</div>
                  </div>
                  <DoubleRangeSlider
                    min={0}
                    max={3}
                    step={0.01}
                    valueMin={lwMin}
                    valueMax={lwMax}
                    onChange={({ min, max }) => {
                      setLwMin(min);
                      setLwMax(max);
                    }}
                  />
                </div>

                <div className={styles.block}>
                  <div className={styles.blockLabel}>FLUORESCENCE</div>
                  <select
                    className={styles.selectBox}
                    value={fluorescence}
                    onChange={(e) => setFluorescence(e.target.value)}
                  >
                    {fluorescenceOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.block}>
                  <div className={styles.blockLabel}>SYMMETRY</div>
                  <select
                    className={styles.selectBox}
                    value={symmetry}
                    onChange={(e) => setSymmetry(e.target.value)}
                  >
                    {symmetryOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.advCol}>
                <div className={styles.block}>
                  <div className={styles.blockLabel}>DEPTH %</div>
                  <div className={styles.rangeRow}>
                    <div className={styles.pill}>{depthMin}%</div>
                    <div className={styles.pill}>{depthMax}%</div>
                  </div>
                  <DoubleRangeSlider
                    min={0}
                    max={100}
                    step={1}
                    valueMin={depthMin}
                    valueMax={depthMax}
                    onChange={({ min, max }) => {
                      setDepthMin(min);
                      setDepthMax(max);
                    }}
                  />
                </div>

                <div className={styles.block}>
                  <div className={styles.blockLabel}>QUALITY</div>
                  <select
                    className={styles.selectBox}
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                  >
                    {qualityOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* bottom row with fast shipping and the advanced toggle button */}
        <div className={styles.bottomControls}>
          <label className={styles.fastShipping}>
            <input
              type="checkbox"
              checked={fastShipping}
              onChange={(e) => setFastShipping(e.target.checked)}
            />{" "}
            Fast Shipping
          </label>

          <div className={styles.centerControl}>
            <button
              className={styles.advToggleBtn}
              onClick={() => setShowAdvanced((s) => !s)}
            >
              {showAdvanced ? "VIEW BASIC FILTERS" : "VIEW ADVANCED FILTERS"}
            </button>
          </div>
        </div>

        {/* clear filters centered */}
        <div className={styles.clearWrapper}>
          <button className={styles.clearFilters} onClick={clearFilters}>
            C L E A R &nbsp; F I L T E R S
          </button>
        </div>
      </section>

      {/* results count */}
      <section className={styles.resultsHeader}>
        <div className={styles.resultsCount}>
          {visibleProducts.length.toLocaleString()} RESULTS
        </div>
      </section>

      {/* table */}
      <section className={styles.tableSection}>
        <DynamicTable
          headings={headings}
          columnData={tableData}
          onRowExpand={(row) => {
            // used by expanded panel's "VIEW MORE DETAILS"
          }}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      </section>
      </div>
    </div>
  );
}

/* ------------------------------
   Inline DynamicTable component
   - simple, self-contained for this page
   - supports expandable rows which render a full "detail" block
   ------------------------------ */
function DynamicTable({
  headings = [],
  columnData = [],
  expandedId,
  setExpandedId,
}) {
  const navigate = useNavigate();

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.Dynamic}>
          <thead>
            <tr>
              {headings.map((h, i) => (
                <th key={i}>{h.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columnData.map((row) => (
              <React.Fragment key={row.id}>
                <tr className={styles.rowMain}>
                  {headings.map((h, idx) => (
                    <td key={idx}>
                      {h.cell
                        ? h.cell(row[h.accessor], row)
                        : row[h.accessor] ?? ""}
                    </td>
                  ))}
                </tr>

                {/* expanded details inline */}
                {expandedId === row.id && (
                  <tr className={styles.rowExpanded}>
                    <td colSpan={headings.length}>
                      <div className={styles.expandedPanel}>
                        <div className={styles.leftThumb}>
                          {row.thumb ? (
                            <img
                              src={row.thumb}
                              alt={row.title}
                              className={styles.expandedThumb}
                            />
                          ) : (
                            <div className={styles.thumbPlaceholder} />
                          )}
                        </div>

                        <div className={styles.centerDetails}>
                          <h3 className={styles.expandedTitle}>{row.title}</h3>
                          <p className={styles.helpLink}>
                            <a href="#">Need help? Talk to an expert.</a>
                          </p>

                          <div className={styles.metaGrid}>
                            <div>
                              <strong>PRICE:</strong> <span>{row.price}</span>
                            </div>
                            <div>
                              <strong>COLOR:</strong>{" "}
                              <span>{row.full.color}</span>
                            </div>

                            <div>
                              <strong>SKU:</strong> <span>{row.sku}</span>
                            </div>
                            <div>
                              <strong>SHAPE:</strong> <span>{row.shape}</span>
                            </div>

                            <div>
                              <strong>CARAT:</strong> <span>{row.carat}</span>
                            </div>
                            <div>
                              <strong>MEASUREMENT:</strong>{" "}
                              <span>{row.measurement}</span>
                            </div>
                          </div>

                          <a
                            className={styles.moreLink}
                            href={`/collection-product/${row.slug}`}
                          >
                            VIEW MORE DETAILS
                          </a>
                        </div>

                        <div className={styles.rightCtas}>
                          <div className={styles.closeWrap}>
                            <button
                              className={styles.closeBtnSmall}
                              onClick={() => setExpandedId(null)}
                            >
                              CLOSE ▴
                            </button>
                          </div>

                          <div className={styles.ctaRow}>
                            <button
                              className={styles.addToCart}
                              onClick={() => {
                                navigate("/cart", { state: { add: row.id } });
                              }}
                            >
                              ADD TO CART
                            </button>
                            <button
                              className={styles.addToRing}
                              onClick={() => {
                                navigate("/engagement", {
                                  state: { add: row.id },
                                });
                              }}
                            >
                              ADD TO RING
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
