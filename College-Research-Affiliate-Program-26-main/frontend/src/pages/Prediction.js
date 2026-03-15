import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import config from "../config";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

const Prediction = () => {

  const [modelInfo, setModelInfo] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const [inputData, setInputData] = useState({
    distance: "",
    temperature: ""
  });

  // Fetch model info
  useEffect(() => {

    axios.get(`${config.API_BASE_URL}/api/v1/model-info`)
      .then((response) => {
        setModelInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching model info:", error);
      });

  }, []);

  // Handle input change
  const handleChange = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value
    });
  };

  // Call prediction API
  const handlePredict = async () => {

    try {

      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/predict`,
        {
          distance: parseFloat(inputData.distance),
          temperature: parseFloat(inputData.temperature)
        }
      );

      setPrediction(response.data);

    } catch (error) {
      console.error("Prediction error:", error);
      alert("Prediction failed. Check backend.");
    }

  };

  return (
    <div className="prediction-page">

      <h1>Water Activity Prediction</h1>

      {/* Model Info Card */}
      <div className="model-info-card">

        <h2>Model Information</h2>

        {modelInfo && (
          <>
            <p><strong>Model Type:</strong> {modelInfo.model_type}</p>
            <p><strong>Accuracy:</strong> {(modelInfo.accuracy * 100).toFixed(2)}%</p>
            <p><strong>Version:</strong> {modelInfo.version}</p>
          </>
        )}

      </div>

      {/* Input Form */}
      <div className="prediction-form">

        <h2>Enter Sensor Data</h2>

        <input
          type="number"
          name="distance"
          placeholder="Distance"
          value={inputData.distance}
          onChange={handleChange}
        />

        <input
          type="number"
          name="temperature"
          placeholder="Temperature"
          value={inputData.temperature}
          onChange={handleChange}
        />

        <button onClick={handlePredict}>
          Predict
        </button>

      </div>

      {/* Prediction Results */}

      {prediction && (

        <div className="prediction-results">

          <h2>Prediction Results</h2>

          <p><strong>Activity:</strong> {prediction.activity}</p>

          <p>
            <strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%
          </p>

          {/* Confidence Chart */}

          <div style={{ width: "400px", height: "300px" }}>

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={[
                    { name: prediction.activity, value: prediction.confidence },
                    { name: "Other", value: 1 - prediction.confidence }
                  ]}
                  dataKey="value"
                  outerRadius={120}
                  label
                >

                  {[0, 1].map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}

                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      )}

    </div>
  );

};

export default Prediction;