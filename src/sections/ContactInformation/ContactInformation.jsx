import React, { useState } from "react";
import "./ContactInformation.css";
import Button from "../../components/Button/Button"; // ✅ use your existing button component

/**
 * ContactInformation
 *
 * Props:
 * - onContinue(email: string, subscribed: boolean)
 * - defaultEmail (optional)
 * - heading (optional)
 */
const ContactInformation = ({
  onContinue = () => {},
  defaultEmail = "",
  heading = "Contact Information",
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    onContinue(email, subscribed);
  };

  return (
    <div className="contact-card">
      <h2 className="contact-title">{heading}</h2>
      <p className="contact-subtext">
        Please provide an email address to receive your order confirmation mail
      </p>

      <div className="contact-input-group">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`contact-input ${error ? "error" : ""}`}
        />
        {error && <span className="error-text">{error}</span>}
      </div>

      <label className="contact-checkbox">
        <input
          type="checkbox"
          checked={subscribed}
          onChange={(e) => setSubscribed(e.target.checked)}
        />
        <span>
          Sign me up for product updates and promotions from Arra jewels by
          Email
        </span>
      </label>

      <div className="contact-button">
        <Button label="Continue" onClick={handleContinue} />
      </div>

      <div className="contact-divider" />
      <p className="contact-footer">Create an Account</p>
    </div>
  );
};

export default ContactInformation;
