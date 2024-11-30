import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

function Measurement() {
  const { orderNumber } = useParams(); // Get the orderNumber from the URL
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await api.get(`/getMeasurements?orderNumber=${orderNumber}`);
        setMeasurements(response.data.measurements || []);
      } catch (err) {
        console.error("Error fetching measurements:", err);
      }
    };

    fetchMeasurements();
  }, [orderNumber]);

  return (
    <div className="measurement-details">
      <h3>Measurements for Order {orderNumber}</h3>
      <ul>
        {measurements.map((measurement, index) => (
          <li key={index}>
            {measurement.name}: {measurement.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Measurement;
