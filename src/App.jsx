import { useState, useEffect, useCallback } from "react";
import DOMPurify from "dompurify";

const COUNTRY_DATA = {
  US: { locale: "en-US", currency: "USD", symbol: "$" },
  IN: { locale: "en-IN", currency: "INR", symbol: "₹" },
  UK: { locale: "en-GB", currency: "GBP", symbol: "£" },
  DE: { locale: "de-DE", currency: "EUR", symbol: "€" },
  FR: { locale: "fr-FR", currency: "EUR", symbol: "€" },
  JP: { locale: "ja-JP", currency: "JPY", symbol: "¥" },
  CN: { locale: "zh-CN", currency: "CNY", symbol: "¥" },
  SG: { locale: "en-SG", currency: "SGD", symbol: "S$" },
  AU: { locale: "en-AU", currency: "AUD", symbol: "A$" },
  CA: { locale: "en-CA", currency: "CAD", symbol: "C$" },
};

const MAX_NUMBER = 100_000_000_000_000_000;

export default function NumberFormatter() {
  const [input, setInput] = useState("");
  const [country, setCountry] = useState("US");
  const [compactOutput, setCompactOutput] = useState("");
  const [currencyOutput, setCurrencyOutput] = useState("");
  const [error, setError] = useState("");

  const formatNumber = useCallback((value, countryCode) => {
    if (!value) {
      setCompactOutput("");
      setCurrencyOutput("");
      setError("");
      return;
    }

    const sanitizedValue = value.replace(/[^\d]/g, "");

    if (!sanitizedValue || sanitizedValue.startsWith("0")) {
      setError("❌ Invalid input! Only positive numbers (no leading zeros) allowed.");
      setCompactOutput("");
      setCurrencyOutput("");
      return;
    }

    try {
      const numericInput = Number(sanitizedValue);
      if (isNaN(numericInput) || numericInput <= 0) {
        setError("❌ Invalid number! Enter a positive value.");
        setCompactOutput("");
        setCurrencyOutput("");
        return;
      }

      if (numericInput > MAX_NUMBER) {
        setError(`⚠️ Value too large! Max allowed: ${MAX_NUMBER.toLocaleString()}`);
        setCompactOutput("");
        setCurrencyOutput("");
        return;
      }

      const { locale, currency, symbol } = COUNTRY_DATA[countryCode] || COUNTRY_DATA.US;

      const formattedCompact = new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
      }).format(numericInput);

      const formattedCurrency = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }).format(numericInput);

      setCompactOutput(DOMPurify.sanitize(`${formattedCompact}`));
      setCurrencyOutput(DOMPurify.sanitize(`${symbol} ${formattedCurrency.replace(/[^\d.,]/g, "")}`));
      setError("");
    } catch (err) {
      console.error("Error formatting number:", err);
      setError("⚠️ Error processing number");
      setCompactOutput("");
      setCurrencyOutput("");
    }
  }, []);

  useEffect(() => {
    formatNumber(input, country);
  }, [input, country, formatNumber]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-size-5 has-text-centered has-text-dark">🌍 Compact Number and Currency Formatter</h1>

        <div className="card">
          <div className="card-content">
            {/* Number Input */}
            <div className="field mt-5">
              <label className="label has-text-dark">Enter a Number (Max: 100 Trillion):</label>
              <div className="control">
                <input
                  type="text"
                  className={`input is-info ${error ? "is-danger" : ""}`}
                  value={input}
                  onInput={(e) => {
                    const cleanValue = e.target.value.replace(/[^\d]/g, "");
                    setInput(cleanValue);
                  }}
                  maxLength={17}
                  placeholder="Type a number..."
                />
              </div>
              {error && <p className="help is-danger">{error}</p>}
            </div>

            {/* Country Selector */}
            <div className="field mt-5">
              <label className="label has-text-dark">Select Country:</label>
              <div className="control">
                <div className="select is-warning">
                  <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    {Object.keys(COUNTRY_DATA).map((code) => (
                      <option key={code} value={code}>
                        {code} - {COUNTRY_DATA[code].currency} ({COUNTRY_DATA[code].symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Output Display */}
            <div className="notification has-background-danger-dark mt-6 mb-5">
              <strong>🔢 Format: </strong>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {compactOutput || "Enter a number to see the result"}
              </span>
              <br />
              <br />
              <strong>💰 Value: </strong>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {currencyOutput || "Enter a number to see the result"}
              </span>
            </div>
          </div>
        </div>

        {/* Credits */}
       <div className="card mt-6 mb-4 has-background-primary-dark">
        <div className="card-content">
         <p>
           <span className="has-text-white is-size-4">💡 Credits</span> <br /> <br />
            📌 <a 
                href="https://github.com/mcnaveen/numify" 
                target="_blank" 
               rel="nofollow noopener"
               className="has-text-info-light"
              >
                MC Naveen - Numify (Node.js)
             </a>  
             <br />
            📌 <a 
                href="https://github.com/azaitsev/millify" 
                target="_blank" 
                rel="nofollow noopener"
                 className="has-text-info-light"
              >
                Alex Zaitsev - Millify (python)
              </a>
              <br />
            📌 <a 
                href="https://dev.to/gautemeekolsen/formatting-large-numbers-in-javascript-3am9" 
                target="_blank" 
                rel="nofollow noopener"
                 className="has-text-info-light"
              >
                Formatting large numbers in JavaScript
              </a>
          </p>
        </div>
       </div>

      </div>
    </section>
  );
}
