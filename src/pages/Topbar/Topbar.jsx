import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import hooks
import { openModal } from "../../redux/slices/modalSlice";

import styles from "./Topbar.module.css";
import { FaSearch, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import UserMenu from "../../components/UserMenu/UserMenu";

/**
 * Topbar with full-width mega panels.
 * - Measurements write --topbar-height to :root so fixed panels read it.
 * - Panel hover/open is controlled in JS to avoid double-open issues on click/navigation.
 */

export default function Topbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openPanelId, setOpenPanelId] = useState(null); // which panel is open
  const location = useLocation();
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const wishlistCount = wishlistItems.length;

  // This ref stores timestamp until which hover/focus opens are ignored.
  // We set this after clicks or navigation to avoid immediate reopen.
  const ignoreHoverUntilRef = useRef(0);
  const HOVER_IGNORE_MS = 700;

  // Measure header and write CSS var --topbar-height (so panel position works)
  useLayoutEffect(() => {
    let rafId = null;
    let ro = null;
    const setVar = (h) => {
      const height = typeof h === "number" ? Math.round(h) : 0;
      document.documentElement.style.setProperty(
        "--topbar-height",
        `${height}px`
      );
    };
    const measure = () => {
      if (!headerRef.current) {
        setVar(0);
        return;
      }
      const rect = headerRef.current.getBoundingClientRect();
      setVar(rect.height);
    };
    measure();
    rafId = requestAnimationFrame(measure);

    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);

    if (typeof ResizeObserver !== "undefined" && headerRef.current) {
      ro = new ResizeObserver((entries) => {
        for (const e of entries) {
          if (e.target === headerRef.current) {
            const h =
              e.contentRect?.height ??
              headerRef.current.getBoundingClientRect().height;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => setVar(h));
          }
        }
      });
      ro.observe(headerRef.current);
    }

    const onPop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
      // ignore hover briefly on history navigation
      ignoreHoverUntilRef.current = Date.now() + HOVER_IGNORE_MS;
    };
    window.addEventListener("popstate", onPop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("popstate", onPop);
      if (ro) ro.disconnect();
    };
  }, []);

  // When route changes, close mobile drawer and any open panel; suppress hover for a short time
  useEffect(() => {
    setDrawerOpen(false);
    setOpenPanelId(null);
    ignoreHoverUntilRef.current = Date.now() + HOVER_IGNORE_MS;
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setOpenPanelId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // close panel if click outside panel or nav region
      if (
        openPanelId &&
        !event.target.closest(`.${styles.panelWrap}`) &&
        !event.target.closest(`.${styles.nav}`)
      ) {
        setOpenPanelId(null);
        // also suppress hover briefly so panel doesn't re-open instantly
        ignoreHoverUntilRef.current = Date.now() + HOVER_IGNORE_MS;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPanelId]);

  const isEngagementActive = location.pathname.startsWith("/engagement");
  const portalRoot = typeof document !== "undefined" ? document.body : null;

  // mobile drawer elements (portal)
  const drawerElem = (
    <>
      <div
        className={`${styles.drawerOverlay} ${drawerOpen ? styles.open : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`${styles.mobileDrawer} ${drawerOpen ? styles.open : ""}`}
        aria-hidden={!drawerOpen}
      >
        <div className={styles.drawerHeader}>
          <button
            className={styles.closeBtn}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className={styles.drawerContent}>
          <Link
            to="/visit"
            className={styles.drawerLink}
            onClick={() => setDrawerOpen(false)}
          >
            Visit Us
          </Link>
          <Link
            to="/contact"
            className={styles.drawerLink}
            onClick={() => setDrawerOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/journal"
            className={styles.drawerLink}
            onClick={() => setDrawerOpen(false)}
          >
            Journal
          </Link>

          <nav className={styles.drawerNav}>
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={styles.drawerNavLink}
                  onClick={() => setDrawerOpen(false)}
                >
                  ARRA JEWELS
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/engagement/design"
                  className={styles.drawerNavLink}
                  onClick={() => setDrawerOpen(false)}
                >
                  ENGAGEMENT
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/wedding"
                  className={styles.drawerNavLink}
                  onClick={() => setDrawerOpen(false)}
                >
                  WEDDING
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/jewellery"
                  className={styles.drawerNavLink}
                  onClick={() => setDrawerOpen(false)}
                >
                  JEWELLERY
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/diamonds"
                  className={styles.drawerNavLink}
                  onClick={() => setDrawerOpen(false)}
                >
                  DIAMONDS
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/gemstone"
                  className={styles.drawerNavLink}
                  onClick={() => setDrawerOpen(false)}
                >
                  GEMSTONE
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/gifts"
                  className={styles.drawerNavLink}
                  onClick={() => setDrawerOpen(false)}
                >
                  GIFTS
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={styles.drawerNavLink}
                  onClick={() => setDrawerOpen(false)}
                >
                  ABOUT
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );

  /**
   * NavMenuWithPanel - inline helper component that renders either a simple NavLink
   * or a NavLink + full-width JS-controlled mega panel.
   */
  function NavMenuWithPanel({
    to,
    label,
    isActiveFlag,
    megaProps,
    openPanelId: externalOpenPanelId,
    setOpenPanelId: externalSetOpenPanelId,
    ignoreHoverUntilRef,
  }) {
    const navigate = useNavigate();
    const panelId = megaProps?.id || null;
    const [localOpen, setLocalOpen] = useState(false);
    const containerRef = useRef(null);
    const suppressOpenRef = useRef(0); // prevent immediate re-open after click

    const isPanelOpen =
      externalOpenPanelId !== undefined && externalSetOpenPanelId !== undefined
        ? externalOpenPanelId === panelId
        : localOpen;

    const openPanel = () => {
      if (Date.now() < suppressOpenRef.current) return;
      if (externalSetOpenPanelId) externalSetOpenPanelId(panelId);
      else setLocalOpen(true);
    };

    const closePanel = () => {
      if (externalSetOpenPanelId) externalSetOpenPanelId(null);
      else setLocalOpen(false);
    };

    // Hover / focus handlers (respect suppression)
    const onPointerEnter = (e) => {
      if (Date.now() < suppressOpenRef.current) return;
      if (megaProps) openPanel();
    };

    const onPointerLeave = (e) => {
      if (!megaProps) return;
      const toEl = e?.relatedTarget;
      const isNode = toEl && toEl instanceof Node;
      if (
        isNode &&
        containerRef.current &&
        containerRef.current.contains(toEl)
      ) {
        return;
      }
      closePanel();
    };

    const onFocus = (e) => {
      if (Date.now() < suppressOpenRef.current) return;
      if (megaProps) openPanel();
    };
    const onBlur = (e) => {
      if (!megaProps) return;
      const related = e.relatedTarget;
      if (
        related &&
        related instanceof Node &&
        containerRef.current &&
        containerRef.current.contains(related)
      ) {
        return;
      }
      closePanel();
    };

    // click on the main nav label: close & suppress reopening
    const onToggleClick = (e) => {
      if (!megaProps) return;
      closePanel();
      suppressOpenRef.current = Date.now() + 600;
      // allow navigation to proceed (NavLink will handle it)
    };

    const handlePanelItemClick = (e, item) => {
      e.preventDefault();
      closePanel();
      suppressOpenRef.current = Date.now() + 600;
      if (ignoreHoverUntilRef) {
        ignoreHoverUntilRef.current = Date.now() + 800;
      }

      try {
        if (panelId === "mega-engagement") {
          let shape = null;
          if (typeof item.to === "string" && item.to.includes("shape=")) {
            const m = item.to.match(/shape=([^&]+)/i);
            if (m && m[1]) shape = decodeURIComponent(m[1]);
          }
          if (!shape && item.label) {
            const maybe = String(item.label).trim();
            if (/^[A-Za-z]+$/.test(maybe)) shape = maybe.toLowerCase();
          }

          if (shape) {
            const target = `/engagement/design?style=${encodeURIComponent(
              shape
            )}`;
            navigate(target);
            return;
          }
        }

        if (item.to) {
          navigate(item.to);
          return;
        }
      } catch (err) {
        if (item.to) navigate(item.to);
      }
    };

    if (!megaProps) {
      return (
        <li ref={containerRef}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive || isActiveFlag ? styles.active : ""
              }`
            }
          >
            {label}
          </NavLink>
        </li>
      );
    }

    return (
      <li
        ref={containerRef}
        className={styles.navLiWithPanel}
        onMouseEnter={onPointerEnter}
        onMouseLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <NavLink
          to={to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive || isActiveFlag ? styles.active : ""}`
          }
          onClick={onToggleClick}
          aria-haspopup="true"
          aria-expanded={isPanelOpen}
        >
          {label}
        </NavLink>

        <div
          className={`${styles.panelWrap} ${isPanelOpen ? styles.open : ""}`}
          id={panelId}
          role="region"
          aria-label={`${label} menu`}
        >
          <div className={styles.megaPanel}>
            <div className={styles.megaInner}>
              {megaProps.columns.map((col, ci) => (
                <div className={styles.column} key={ci}>
                  {col.title && <h4>{col.title}</h4>}
                  <ul>
                    {col.items.map((it, ii) => (
                      <li key={ii}>
                        <a
                          href={it.to || "#"}
                          onClick={(e) => handlePanelItemClick(e, it)}
                          className={styles.panelItemLink}
                        >
                          {it.icon && (
                            <img
                              src={it.icon}
                              alt=""
                              aria-hidden="true"
                              className={styles.itemIcon}
                            />
                          )}
                          <span className={styles.itemLabel}>{it.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {megaProps.image && (
                <div className={styles.panelImage}>
                  <img src={megaProps.image.src} alt={megaProps.image.alt} />
                  {megaProps.image.ctaLabel && (
                    <a
                      href={megaProps.image.ctaTo || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        closePanel();
                        suppressOpenRef.current = Date.now() + 600;
                        if (ignoreHoverUntilRef)
                          ignoreHoverUntilRef.current = Date.now() + 800;
                        if (megaProps.image.ctaTo)
                          navigate(megaProps.image.ctaTo);
                      }}
                      className={styles.panelCta}
                    >
                      {megaProps.image.ctaLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.topbar} ${scrolled ? styles.scrolled : ""}`}
        role="banner"
      >
        <div className={styles.row}>
          <div className={styles.left}>
            <img src="/logo.png" alt="Arra emblem" className={styles.emblem} />
            <Link to="/visit" className={styles.utilityLink}>
              Visit Us
            </Link>
            <Link to="/contact" className={styles.utilityLink}>
              Contact
            </Link>
          </div>

          <div className={styles.center}>
            <Link to="/" className={styles.brand} aria-label="Arra Jewels home">
              <span className={styles.brandText}>ARRA</span>
              <img
                src="/logo.png"
                alt="Arra emblem"
                className={styles.emblem}
              />
              <span className={styles.brandText}>JEWELS</span>
            </Link>
          </div>

          <div className={styles.right}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => dispatch(openModal({ type: "SEARCH" }))}
              aria-label="Search"
            >
              <FaSearch />
            </button>

            {/* LIVE WISHLIST BADGE */}
            <Link
              to="/wishlist"
              className={styles.iconBtn}
              aria-label="Wishlist"
            >
              <FaRegHeart />
              {wishlistCount > 0 && (
                <span className={styles.badge}>{wishlistCount}</span>
              )}
            </Link>

            <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
              <FaShoppingBag />
            </Link>

            {/* User Menu Component */}
            <UserMenu />

            <button
              className={styles.hamburger}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <HiMenu size={20} />
            </button>
          </div>
        </div>

        <div className={styles.bottomBorder} />

        <nav className={styles.nav} role="navigation" aria-label="Primary">
          <ul className={styles.navList}>
            <NavMenuWithPanel
              to="/engagement/design"
              label="ENGAGEMENT"
              isActiveFlag={isEngagementActive}
              megaProps={{
                id: "mega-engagement",
                columns: [
                  {
                    title: "BY STYLE",
                    items: [
                      { label: "All", to: "/engagement/design" },
                      {
                        label: "Cathedral",
                        to: "/engagement/design?style=Cathedral",
                      },
                      {
                        label: "Channel Set",
                        to: "/engagement/design?style=Channel%20Set",
                      },
                      {
                        label: "Cluster",
                        to: "/engagement/design?style=Cluster",
                      },
                      {
                        label: "Designer",
                        to: "/engagement/design?style=Designer",
                      },
                      {
                        label: "Floral",
                        to: "/engagement/design?style=Floral",
                      },
                      { label: "Halo", to: "/engagement/design?style=Halo" },
                      {
                        label: "Hidden Halo",
                        to: "/engagement/design?style=Hidden%20Halo",
                      },
                      {
                        label: "Milgrain",
                        to: "/engagement/design?style=Milgrain",
                      },
                      { label: "Pave", to: "/engagement/design?style=Pave" },
                      {
                        label: "Petite",
                        to: "/engagement/design?style=Petite",
                      },
                      {
                        label: "Side Stone",
                        to: "/engagement/design?style=Side%20Stone",
                      },
                      {
                        label: "Six Prong",
                        to: "/engagement/design?style=Six%20Prong",
                      },
                      {
                        label: "Solitaire",
                        to: "/engagement/design?style=Solitaire",
                      },
                      {
                        label: "Split Shank",
                        to: "/engagement/design?style=Split%20Shank",
                      },
                      {
                        label: "Three Stone",
                        to: "/engagement/design?style=Three%20Stone",
                      },
                      {
                        label: "Unique",
                        to: "/engagement/design?style=Unique",
                      },
                      {
                        label: "Vintage",
                        to: "/engagement/design?style=Vintage",
                      },
                    ],
                  },
                  {
                    title: "BY SHAPE",
                    items: [
                      {
                        label: "Round",
                        to: "/engagement/design?shape=round",
                        icon: "/images/shapes/round.svg",
                      },
                      {
                        label: "Oval",
                        to: "/engagement/design?shape=oval",
                        icon: "/images/shapes/oval.svg",
                      },
                      {
                        label: "Emerald",
                        to: "/engagement/design?shape=emerald",
                        icon: "/images/shapes/emerald.svg",
                      },
                      {
                        label: "Cushion",
                        to: "/engagement/design?shape=cushion",
                        icon: "/images/shapes/cushion.svg",
                      },
                      {
                        label: "Marquise",
                        to: "/engagement/design?shape=marquise",
                        icon: "/images/shapes/marquise.svg",
                      },
                      {
                        label: "Radiant",
                        to: "/engagement/design?shape=radiant",
                        icon: "/images/shapes/radient.svg",
                      },
                      {
                        label: "Pear",
                        to: "/engagement/design?shape=pear",
                        icon: "/images/shapes/pear.svg",
                      },
                      {
                        label: "Princess",
                        to: "/engagement/design?shape=princess",
                        icon: "/images/shapes/princess.svg",
                      },
                      {
                        label: "Asscher",
                        to: "/engagement/design?shape=asscher",
                        icon: "/images/shapes/asscher.svg",
                      },
                      {
                        label: "Heart",
                        to: "/engagement/design?shape=heart",
                        icon: "/images/shapes/heart.svg",
                      },
                    ],
                  },
                  {
                    title: "FEATURED",
                    items: [
                      { label: "Ready to Ship", to: "/engagement/ready" },
                      { label: "Custom Design", to: "/engagement/design" },
                    ],
                  },
                ],
                image: {
                  src: "/images/hover/engagementpanel1.png",
                  alt: "Engagement guide",
                },
              }}
              openPanelId={openPanelId}
              setOpenPanelId={setOpenPanelId}
              ignoreHoverUntilRef={ignoreHoverUntilRef}
            />

            <NavMenuWithPanel
              to="/wedding"
              label="WEDDING"
              megaProps={{
                id: "mega-wedding",
                columns: [
                  {
                    title: "BY STYLE",
                    items: [
                      { label: "Wedding", to: "/wedding/wedding" },
                      { label: "Anniversary", to: "/wedding/anniversary" },
                      { label: "Eternity", to: "/wedding/eternity" },
                      { label: "Curved", to: "/wedding/curved" },
                      { label: "Stackable", to: "/wedding/stackable" },
                      { label: "Men's", to: "/wedding" },
                      { label: "Shop All", to: "/wedding" },
                    ],
                  },
                ],
                image: {
                  src: "/images/hover/engagementpanel.png",
                  alt: "Wedding hero",
                },
              }}
              openPanelId={openPanelId}
              setOpenPanelId={setOpenPanelId}
            />

            <NavMenuWithPanel
              to="/jewellery"
              label="JEWELLERY"
              megaProps={{
                id: "mega-jewellery",
                columns: [
                  {
                    title: "EARRINGS",
                    items: [
                      { label: "Ready to Ship", to: "/jewellery/earrings" },
                      { label: "Shop All", to: "/jewellery" },
                    ],
                  },
                  {
                    title: "NECKLACES",
                    items: [
                      {
                        label: "Ready to Ship Necklaces",
                        to: "/jewellery/necklaces",
                      },
                    ],
                  },
                  {
                    title: "BRACELETS",
                    items: [
                      {
                        label: "Ready to Ship Bracelets",
                        to: "/jewellery/bracelets",
                      },
                    ],
                  },
                  {
                    title: "RINGS & BANDS",
                    items: [
                      { label: "Ready to Ship Rings", to: "/jewellery/rings" },
                      { label: "Ready to Ship Bands", to: "/jewellery/rings" },
                    ],
                  },
                ],
                image: {
                  src: "/images/hover/jewellarypanel.png",
                  alt: "Jewellery hero",
                },
              }}
              openPanelId={openPanelId}
              setOpenPanelId={setOpenPanelId}
            />

            <NavMenuWithPanel
              to="/diamonds"
              label="DIAMONDS"
              megaProps={{
                id: "mega-diamonds",
                columns: [
                  {
                    title: "LOOSE LAB DIAMONDS",
                    items: [
                      {
                        label: "Round",
                        to: "/diamonds?shape=round",
                        icon: "/images/shapes/round.svg",
                      },
                      {
                        label: "Oval",
                        to: "/diamonds?shape=oval",
                        icon: "/images/shapes/oval.svg",
                      },
                      {
                        label: "Emerald",
                        to: "/diamonds?shape=emerald",
                        icon: "/images/shapes/emerald.svg",
                      },
                      {
                        label: "Cushion",
                        to: "/diamonds?shape=cushion",
                        icon: "/images/shapes/cushion.svg",
                      },
                      {
                        label: "Princess",
                        to: "/diamonds?shape=princess",
                        icon: "/images/shapes/princess.svg",
                      },
                      {
                        label: "Asscher",
                        to: "/diamonds?shape=asscher",
                        icon: "/images/shapes/asscher.svg",
                      },
                      {
                        label: "Heart",
                        to: "/diamonds?shape=heart",
                        icon: "/images/shapes/heart.svg",
                      },
                    ],
                  },
                  {
                    title: "FEATURED",
                    items: [
                      { label: "Lab Diamond Jewelry", to: "/diamonds" },
                      { label: "The Gift Guide", to: "/gifts" },
                    ],
                  },
                ],
                image: {
                  src: "/images/hover/diamondspanel.png",
                  alt: "Diamonds",
                },
              }}
              openPanelId={openPanelId}
              setOpenPanelId={setOpenPanelId}
            />

            <NavMenuWithPanel
              to="/gemstone"
              label="GEMSTONE"
              megaProps={{
                id: "mega-gemstone",
                columns: [
                  {
                    title: "BY SHAPE",
                    items: [
                      {
                        label: "Round",
                        to: "/gemstone?shape=round",
                        icon: "/images/shapes/round.svg",
                      },
                      {
                        label: "Oval",
                        to: "/gemstone?shape=oval",
                        icon: "/images/shapes/oval.svg",
                      },
                      {
                        label: "Princess",
                        to: "/gemstone?shape=princess",
                        icon: "/images/shapes/princess.svg",
                      },
                      {
                        label: "Cushion",
                        to: "/gemstone?shape=cushion",
                        icon: "/images/shapes/cushion.svg",
                      },
                      {
                        label: "Emerald",
                        to: "/gemstone?shape=emerald",
                        icon: "/images/shapes/emerald.svg",
                      },
                      {
                        label: "Pear",
                        to: "/gemstone?shape=pear",
                        icon: "/images/shapes/pear.svg",
                      },
                      {
                        label: "Heart",
                        to: "/gemstone?shape=heart",
                        icon: "/images/shapes/heart.svg",
                      },
                    ],
                  },
                  {
                    title: "BY COLOR",
                    items: [
                      { label: "Ruby", to: "/gemstone?color=Ruby" },
                      { label: "Emerald", to: "/gemstone?color=Emerald" },
                      {
                        label: "Blue Sapphire",
                        to: "/gemstone?color=Blue%20Sapphire",
                      },
                      {
                        label: "Pink Sapphire",
                        to: "/gemstone?color=Pink%20Sapphire",
                      },
                      {
                        label: "Alexandrite",
                        to: "/gemstone?color=Alexandrite",
                      },
                    ],
                  },
                ],
                image: {
                  src: "/images/hover/gemstonepanel.png",
                  alt: "Gemstone",
                },
              }}
              openPanelId={openPanelId}
              setOpenPanelId={setOpenPanelId}
            />

            <NavMenuWithPanel
              to="/gifts"
              label="GIFTS"
              megaProps={{
                id: "mega-gifts",
                columns: [
                  {
                    title: "GIFT GUIDES",
                    items: [
                      { label: "Engagement Gifts", to: "/engagement" },
                      { label: "Most Gifted", to: "/gifts" },
                      { label: "Classic Jewelry Must-Haves", to: "/jewellery" },
                      { label: "Personalized Gifts", to: "/gifts" },
                      { label: "Ready To Ship Jewelry", to: "/jewellery" },
                    ],
                  },
                ],
                image: { src: "/images/hover/giftpanel.png", alt: "Gifts" },
              }}
              openPanelId={openPanelId}
              setOpenPanelId={setOpenPanelId}
            />

            <NavMenuWithPanel
              to="/about"
              label="ABOUT"
              megaProps={{
                id: "mega-about",
                columns: [
                  {
                    title: "ABOUT",
                    items: [
                      { label: "Visit Us", to: "/visit" },
                      { label: "Contact", to: "/contact" },
                      { label: "Our Journal", to: "/journal" },
                    ],
                  },
                  {
                    title: "OUR MATERIALS",
                    items: [
                      { label: "Lab Grown Diamonds", to: "/diamonds" },
                      { label: "Lab Created Gemstones", to: "/gemstone" },
                    ],
                  },
                ],
                image: { src: "/images/store.jpg", alt: "About" },
              }}
              openPanelId={openPanelId}
              setOpenPanelId={setOpenPanelId}
            />
          </ul>
        </nav>
      </header>

      {/* Portal mount for mobile drawer */}
      {portalRoot ? ReactDOM.createPortal(drawerElem, portalRoot) : drawerElem}
    </>
  );
}
