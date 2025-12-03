import React, { useMemo, useState } from "react";
import "./ShippingBillingForm.css";
import Button from "../../components/Button/Button"; // ✅ your existing button

/**
 * ShippingBillingForm
 *
 * Props:
 * - initialValues: {
 *     firstName, lastName, countryCode, address, postalCode, mobile
 *   }
 * - countries: Array<{ code: string, name: string, flag?: string }>
 * - onContinue: (values) => void
 * - heading: string
 * - subtext: string
 */
const ShippingBillingForm = ({
  initialValues = {
    firstName: "",
    lastName: "",
    countryCode: "US",
    address: "",
    postalCode: "",
    mobile: "",
  },
  countries = [
    { code: "US", name: "USA", flag: "🇺🇸" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  ],
  onContinue = () => {},
  heading = "Shipping and Billing",
  subtext = "Please choose your shipping method",
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === values.countryCode) || countries[0],
    [countries, values.countryCode]
  );

  const setField = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!values.firstName.trim()) e.firstName = "First name is required";
    if (!values.lastName.trim()) e.lastName = "Last name is required";
    if (!values.address.trim()) e.address = "Address is required";
    if (!values.postalCode.trim()) e.postalCode = "Postal code is required";
    if (!values.mobile.trim()) e.mobile = "Mobile number is required";
    // simple mobile check
    if (values.mobile && !/^[0-9+\-\s()]{6,}$/.test(values.mobile))
      e.mobile = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    onContinue({ ...values, country: selectedCountry });
  };

  return (
    <form className="sb-card" onSubmit={handleContinue} noValidate>
      <h2 className="sb-title">{heading}</h2>
      <p className="sb-subtext">{subtext}</p>

      <div className="sb-grid-2">
        <div className="sb-field">
          <label>First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={values.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            className={errors.firstName ? "has-error" : ""}
          />
          {errors.firstName && (
            <span className="sb-error">{errors.firstName}</span>
          )}
        </div>

        <div className="sb-field">
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            value={values.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            className={errors.lastName ? "has-error" : ""}
          />
          {errors.lastName && (
            <span className="sb-error">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="sb-field">
        <label>Country</label>
        <div className="sb-select-wrap">
          <span className="sb-flag">{selectedCountry?.flag || "🌐"}</span>
          <select
            value={values.countryCode}
            onChange={(e) => setField("countryCode", e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="sb-caret" aria-hidden>
            ▾
          </span>
        </div>
      </div>

      <div className="sb-field">
        <label>Address</label>
        <textarea
          placeholder="Address"
          rows={3}
          value={values.address}
          onChange={(e) => setField("address", e.target.value)}
          className={errors.address ? "has-error" : ""}
        />
        {errors.address && <span className="sb-error">{errors.address}</span>}
      </div>

      <div className="sb-grid-2">
        <div className="sb-field">
          <label>Postal Code</label>
          <input
            type="text"
            placeholder="Postal Code"
            value={values.postalCode}
            onChange={(e) => setField("postalCode", e.target.value)}
            className={errors.postalCode ? "has-error" : ""}
          />
          {errors.postalCode && (
            <span className="sb-error">{errors.postalCode}</span>
          )}
        </div>

        <div className="sb-field">
          <label>Mobile Number</label>
          <input
            type="tel"
            placeholder="Mobile Number"
            value={values.mobile}
            onChange={(e) => setField("mobile", e.target.value)}
            className={errors.mobile ? "has-error" : ""}
          />
          {errors.mobile && <span className="sb-error">{errors.mobile}</span>}
        </div>
      </div>

      {/* ✅ use your existing Button component; no button code/styles here */}
      <div className="sb-actions">
        <Button label="Continue" onClick={handleContinue} />
      </div>
    </form>
  );
};

export default ShippingBillingForm;
