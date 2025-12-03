import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./ProfilePage.module.css";
import HeadingAndInput from "../../components/HeadingAndInput/HeadingAndInput";
import Button from "../../components/Button/Button";
import { fetchAddresses, saveAddress } from "../../api/userActionsService";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Single State Object for All Fields ---
  const [formData, setFormData] = useState({
    _id: null,
    firstName: "",
    lastName: "",
    phone: "",
    email: user?.email || "",

    address: "",
    postalCode: "",
    state: "",
    city: "",
    country: "India",
    label: "home",
    isDefault: false,
  });

  // Define loadData outside useEffect so we can reuse it for real-time updates
  const loadData = async () => {
    try {
      // Don't set full loading spinner on re-fetch to keep UI stable
      // setLoading(true);
      console.group("[ProfilePage] Loading Data");

      // 1. Fetch Addresses
      const addressRes = await fetchAddresses();
      console.log("API Response:", addressRes);

      // Ensure we handle both structure types
      const addresses = Array.isArray(addressRes)
        ? addressRes
        : addressRes?.addresses || [];
      const defaultAddressId = addressRes?.defaultAddressId;

      console.log(
        `Found ${addresses.length} addresses. Default ID:`,
        defaultAddressId
      );

      if (addresses.length > 0) {
        // 2. Find Address Strategy
        let defAddr = addresses.find(
          (a) => String(a._id) === String(defaultAddressId)
        );

        if (!defAddr) {
          // Fallback 1: Find any marked default
          defAddr = addresses.find((a) => a.isDefault === true);
        }

        if (!defAddr) {
          console.warn(
            "No default found, falling back to first available address."
          );
          defAddr = addresses[0];
        }

        console.log("Selected Address for Profile:", defAddr);

        // 3. Populate State
        setFormData({
          _id: defAddr._id || null,
          firstName: defAddr.firstName || "",
          lastName: defAddr.lastName || "",
          phone: defAddr.phone || "",
          // Use address email if exists, otherwise auth user email from Redux
          email: defAddr.email || user?.email || "",

          address: defAddr.address || "",
          postalCode: defAddr.postalCode || "",
          state: defAddr.state || "",
          city: defAddr.city || "",
          country: defAddr.country || "India",
          label: defAddr.label || "home",
          isDefault: true, // Force default for main profile
        });
      } else {
        console.warn("No addresses found for user.");
        // Optional: Pre-fill name/email from Auth User if address list is empty
        if (user) {
          setFormData((prev) => ({
            ...prev,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
          }));
        }
      }
      console.groupEnd();
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    setLoading(true);
    loadData();
  }, [user]);

  // Handle Input Changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save Changes
  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("Saving Profile Data:", formData);

      // Construct payload matching your Schema
      const payload = {
        _id: formData._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        postalCode: formData.postalCode,
        state: formData.state,
        city: formData.city,
        country: formData.country,
        label: formData.label,
        isDefault: true,
      };

      await saveAddress(payload);

      toast.success("Profile updated successfully!");

      // REAL-TIME UPDATE: Re-fetch data immediately to sync UI with Server
      await loadData();
    } catch (err) {
      console.error("Save error:", err);
      const msg = err.response?.data?.message || "Failed to save changes.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  const displayName = formData.firstName || "User";

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* --- Header Banner --- */}
      <div className={styles.banner}>
        <div className={styles.bannerLeft}>
          <div className={styles.avatarPlaceholder}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.bannerInfo}>
            <span className={styles.name}>
              {formData.firstName} {formData.lastName}
            </span>
            <span className={styles.bannerEmail}>{formData.email}</span>
          </div>
        </div>
        <img
          src="/images/ring.svg"
          alt="Ring Decoration"
          className={styles.bannerImg}
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

      {/* --- Details Card --- */}
      <div className={styles.card}>
        {/* Personal Details Section */}
        <div className={styles.sectionHeader}>
          <div className={styles.iconCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h3 className={styles.sectionTitle}>Personal Details</h3>
        </div>

        <div className={styles.formGrid}>
          <HeadingAndInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Enter first name"
          />
          <HeadingAndInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Enter last name"
          />
          <HeadingAndInput
            label="Mobile Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter mobile number"
          />
          <HeadingAndInput
            label="Email Id"
            type="email"
            value={formData.email}
            disabled={true}
            style={{ opacity: 0.7, cursor: "not-allowed" }}
          />
        </div>

        <hr className={styles.divider} />

        {/* Address Details Section */}
        <div className={styles.sectionHeader}>
          <div className={styles.iconCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
          </div>
          <h3 className={styles.sectionTitle}>Address Details</h3>
        </div>

        <div className={styles.formGrid}>
          <div style={{ gridColumn: "1 / -1" }}>
            <HeadingAndInput
              label="Address (House No, Building, Street)"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter full address"
            />
          </div>
          <HeadingAndInput
            label="City"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Enter city"
          />
          <HeadingAndInput
            label="State"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="Enter state"
          />
          <HeadingAndInput
            label="Pin Code"
            value={formData.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            placeholder="Enter postal code"
          />
        </div>

        <div className={styles.actionWrap}>
          <Button
            label={saving ? "Saving..." : "Save Changes"}
            bgColor="var(--Primary_Color, #993399)"
            textColor="#fff"
            borderColor="var(--Primary_Color, #993399)"
            width="180px"
            height="48px"
            borderRadius="8px"
            fontSize="15px"
            fontWeight="600"
            disabled={saving}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
