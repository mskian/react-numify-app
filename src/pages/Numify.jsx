import { useEffect, useState, useRef, useCallback } from "react";
import { numify } from "numify";
import DOMPurify from "dompurify";

const formatOptions = ["en", "in", "de", "fr", "es", "it", "se"];

function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

function App() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState("en");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const validateAndFormat = useCallback((value) => {
    if (!value) {
      setOutput("");
      setError("");
      return;
    }

    let sanitizedValue = value.replace(/[^\d]/g, "");

    if (!sanitizedValue || sanitizedValue.startsWith("0")) {
      setError("Invalid input (only numbers, no leading zeros)");
      setOutput("");
      return;
    }

    if (sanitizedValue.length > 23) {
      setError("Number too large (max 23 digits)");
      setOutput("");
      return;
    }

    try {
      const numericInput = Number(sanitizedValue);
      if (isNaN(numericInput) || numericInput <= 0) {
        setError("Invalid number input");
        setOutput("");
        return;
      }

      const formattedNumber = numify(numericInput, { formatType: format });
      setOutput(DOMPurify.sanitize(formattedNumber));
      setError("");
    } catch (err) {
      console.error("Error formatting number:", err);
      setError("Error processing number");
      setOutput("");
    }
  }, [format]);

  const debouncedValidateAndFormat = useDebounce(validateAndFormat, 250);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    debouncedValidateAndFormat(value);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
    validateAndFormat(input);
  };

  useEffect(() => {
    document.title = `Numify - convert long numbers to human readable format`;
    document.querySelector('meta[name="description"]').setAttribute(
      "content",
      `Numify - Simple utility to convert long numbers to human readable format.`
    );
    document
      .querySelector('link[rel="canonical"]')
      .setAttribute("href", window.location.href);
  }, []);

  const formattedOutput = output ? (
    <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{output}</span>
  ) : (
    "Enter a number to see the result"
  );

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-size-5 has-text-centered has-text-dark">
          📊 Number Formatter
        </h1>

        <div className="card">
          <div className="card-content">
            {/* Number Input */}
            <div className="field">
              <label className="label has-text-dark">Enter a Number:</label>
              <div className="control">
                <input
                  type="text"
                  className={`input is-medium ${error ? "is-danger" : ""}`}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type a number..."
                  maxLength="23"
                />
              </div>
              {error && <p className="help is-danger">{error}</p>}
            </div>

            {/* Format Selector */}
            <div className="field">
              <label className="label has-text-dark">Select Format:</label>
              <div className="control">
                <div className="select is-fullwidth is-medium">
                  <select value={format} onChange={handleFormatChange}>
                    {formatOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Output Display */}
            <div
              className={`notification ${
                output ? "is-primary" : "is-light"
              } has-text-centered`}
              style={{ transition: "all 0.3s ease-in-out" }}
            >
              <strong>Formatted Output: </strong>
              {formattedOutput}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
