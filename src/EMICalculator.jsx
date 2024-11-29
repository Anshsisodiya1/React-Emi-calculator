import React, { useState, useEffect } from "react";
import "./App.css";

const EMICalculator = () => {
  const [principalAmount, setPrincipalAmount] = useState("");
  const [rateOfInterest, setRateOfInterest] = useState("");
  const [duration, setDuration] = useState("");
  const [emitable, setEmitable] = useState([]);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("emiHistory")) || [];
    setCalculationHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("emiHistory", JSON.stringify(calculationHistory));
  }, [calculationHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const principal = Number(principalAmount);
    const rate = Number(rateOfInterest);
    const time = Number(duration);

    if (!principal || !rate || !time || principal <= 0 || rate < 0 || time <= 0) {
      alert("Please provide valid inputs for all fields!");
      return;
    }

    if (principal < 10000) {
      alert("Principal amount must be ₹10,000 or above to calculate EMI!");
      return;
    }

    const monthlyRate = rate / 12 / 100;
    const emi =
      (principal * monthlyRate * (1 + monthlyRate) ** time) /
      ((1 + monthlyRate) ** time - 1);

    const newEmitable = [];
    for (let i = 1; i <= time; i++) {
      newEmitable.push({
        month: i,
        amount: emi.toFixed(2),
      });
    }

    setEmitable(newEmitable);

    const newHistoryEntry = {
      principalAmount: principal,
      rateOfInterest: rate,
      duration: time,
      emi: emi.toFixed(2),
      timestamp: new Date().toLocaleString(),
    };

    setCalculationHistory([newHistoryEntry, ...calculationHistory]);
  };

  return (
    <div className="emi-container">
      <h1 className="title">EMI Calculator</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>Enter the Amount:</label>
        <input
          type="text"
          value={principalAmount}
          onChange={(e) => setPrincipalAmount(e.target.value)}
          placeholder="Enter Principal Amount"
        />
        <label>Enter Rate in %:</label>
        <input
          type="text"
          value={rateOfInterest}
          onChange={(e) => setRateOfInterest(e.target.value)}
          placeholder="Enter Rate of Interest (%)"
        />
        <label>Enter Time in Months:</label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Enter Duration (Months)"
        />
        <button type="submit">Calculate EMI</button>
      </form>

      {emitable.length > 0 && (
        <table className="emi-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>EMI</th>
            </tr>
          </thead>
          <tbody>
            {emitable.map((emi) => (
              <tr key={emi.month}>
                <td>{emi.month}</td>
                <td>{emi.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => setShowHistory(!showHistory)}
        className="history-button"
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showHistory && calculationHistory.length > 0 && (
        <table className="history-table">
          <thead>
            <tr>
              <th>Principal Amount</th>
              <th>Rate of Interest (%)</th>
              <th>Duration (Months)</th>
              <th>EMI</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {calculationHistory.map((entry, index) => (
              <tr key={index}>
                <td>{entry.principalAmount}</td>
                <td>{entry.rateOfInterest}</td>
                <td>{entry.duration}</td>
                <td>{entry.emi}</td>
                <td>{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EMICalculator;
