import React, { useState } from "react";
import styles from "./ContactUsSection.module.css";
import HeadingAndInput from "../../components/HeadingAndInput/HeadingAndInput";
import Button from "../../components/Button/Button";
import { FiUser, FiPhone, FiMail } from "react-icons/fi";

const DEFAULT_EMAIL = "support@arrajewels.com";

const ContactUsSection = () => {
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real submit / API call
    alert(`Thanks, ${form.name || "friend"}! We’ll be in touch soon.`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Row 1: Image + Card Form */}
        <div className={styles.topRow}>
          <div className={styles.photoWrap}>
            <div className={styles.plate} aria-hidden="true" />
            <img
              className={styles.photo}
              src="/images/showroom.jpg"
              alt="Showroom interior"
            />
          </div>

          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Lets Get in Touch</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
              <HeadingAndInput
                label="Name"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                leftIcon={<FiUser />}
              />
              <HeadingAndInput
                label="Mobile Number"
                name="mobile"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.mobile}
                onChange={handleChange}
                leftIcon={<FiPhone />}
              />
              <HeadingAndInput
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                leftIcon={<FiMail />}
              />

              <Button
                label="Submit"
                bgColor="var(--Primary_Color)"
                textColor="var(--White_Color)"
                hoverBg="#8b2f8b"
                height="44px"
                borderRadius="12px"
                width="100%"
                onClick={handleSubmit}
                style={{ marginTop: 8 }}
              />
            </form>
          </div>
        </div>

        {/* Row 2: Headline */}
        <div className={styles.helpWrap}>
          <p className={styles.helpLine1}>Got a question or need style tips?</p>
          <p className={styles.helpLine2}>
            Our personal shoppers are ready to help.
          </p>
        </div>

        {/* Row 3: Contact + Hours */}
        <div className={styles.infoRow}>
          <div className={styles.block}>
            <h4 className={styles.blockTitle}>CONTACT US</h4>

            <div className={styles.lineItem}>
              <span className={styles.key}>Toll Free :</span>
              <a className={styles.value} href="tel:+18669969642">
                1-866-996-9642
              </a>
            </div>

            <div className={styles.lineItem}>
              <span className={styles.key}>International :</span>
              <a className={styles.value} href="tel:+18669969642">
                1-866-996-9642
              </a>
            </div>

            <div className={styles.actionsRow}>
              <a
                className={styles.textLink}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Live Chat
              </a>
              <a className={styles.textLink} href={`mailto:${DEFAULT_EMAIL}`}>
                Email Us
              </a>
              <a
                className={styles.textLink}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // replace with navigate("/appointments") or open modal
                  alert("Open Book an Appointment flow");
                }}
              >
                Book an Appointment
              </a>
            </div>
          </div>

          <div className={styles.block}>
            <h4 className={styles.blockTitle}>HOURS</h4>

            <div className={styles.lineItemStack}>
              <span className={styles.key}>Monday to Saturday :</span>
              <span className={styles.subtle}>10:00 AM to 6:00PM</span>
            </div>

            <div className={styles.lineItemStack} style={{ marginTop: 18 }}>
              <span className={styles.key}>Sunday :</span>
              <span className={styles.subtle}>10:00 AM to 2:00PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
