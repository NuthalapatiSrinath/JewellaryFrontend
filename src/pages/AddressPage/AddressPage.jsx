import React, { useEffect, useState } from "react";
import styles from "./AddressPage.module.css";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import {
  fetchAddresses,
  addAddress,
  deleteAddress,
} from "../../api/addressService";

const isValidForm = (f) =>
  f.firstName && f.lastName && f.address && f.city && f.postalCode && f.phone;

export default function AddressPage({ onNext, onLoginRequest, isLoggedIn }) {
  const dispatch = useDispatch();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    label: "Home",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "Telangana",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });

  const loadAddresses = async () => {
    try {
      const data = await fetchAddresses();
      if (data?.addresses) {
        setSavedAddresses(data.addresses);
        // Auto-select first address if none selected
        if (!selectedId && data.addresses.length > 0) {
          setSelectedId(data.addresses[0]._id);
        }
      }
    } catch (error) {
      console.error("Load addresses failed", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) loadAddresses();
  }, [isLoggedIn]);

  const handleSaveAddress = async () => {
    if (!isLoggedIn) {
      onLoginRequest();
      return;
    }
    if (!isValidForm(form)) {
      alert("Please fill required fields (*)");
      return;
    }
    try {
      await addAddress(form);
      await loadAddresses();
      setForm({
        ...form,
        firstName: "",
        lastName: "",
        address: "",
        phone: "",
        city: "",
        postalCode: "",
      });
    } catch (error) {
      console.error("Save address failed", error);
    }
  };

  const handleProceed = () => {
    if (!isLoggedIn) {
      onLoginRequest();
    } else if (!selectedId) {
      alert("Please select an address.");
    } else {
      onNext(selectedId); // Pass ID to Host -> Payment Page
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* LEFT: Addresses & Form */}
        <div className={styles.leftCol}>
          {/* Saved Addresses List */}
          {savedAddresses.length > 0 && (
            <div
              className={styles.savedSection}
              style={{ marginBottom: "20px" }}
            >
              <h3>Select Shipping Address</h3>
              <div className={styles.addressList}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={styles.addrCard}
                    style={{
                      border:
                        selectedId === addr._id
                          ? "2px solid var(--Primary_Color)"
                          : "1px solid #ddd",
                      padding: "10px",
                      margin: "10px 0",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedId(addr._id)}
                  >
                    <strong>{addr.label}</strong>
                    <p>
                      {addr.firstName} {addr.lastName}
                    </p>
                    <p>
                      {addr.address}, {addr.city} - {addr.postalCode}
                    </p>
                    <p>Phone: {addr.phone}</p>
                    <button
                      style={{
                        marginTop: "5px",
                        background: "transparent",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Delete this address?")) {
                          deleteAddress(addr._id).then(loadAddresses);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Form */}
          <div className={styles.card}>
            <h3 className={styles.title}>Add New Address</h3>
            <div className={styles.row2}>
              <input
                className={styles.inp}
                placeholder="First Name *"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <input
                className={styles.inp}
                placeholder="Last Name *"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <input
              className={styles.inp}
              placeholder="Mobile Number *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className={styles.inp}
              placeholder="Address *"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <div className={styles.row2}>
              <input
                className={styles.inp}
                placeholder="City *"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                className={styles.inp}
                placeholder="Pincode *"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />
            </div>
            <div className={styles.actions}>
              <button className={styles.save} onClick={handleSaveAddress}>
                Save Address
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Checkout</h3>
          <p>Selected Address ID: {selectedId ? "Selected" : "None"}</p>
          <hr className={styles.hr} />
          <button className={styles.cta} onClick={handleProceed}>
            Proceed to Payment
          </button>
        </aside>
      </div>
    </div>
  );
}
