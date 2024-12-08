import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import './Measurement.css'
import All from "../../Pages/MeasurementItems/MeasurementEdit/All";
import MeasurementDisplay from "../../Pages/MeasurementItems/MeasurementDisplay/MeasurementDisplay.jsx";

function Measurement() {
  const { orderNumber } = useParams(); // Get the orderNumber from the URL



  return (
    <>
      <div className="measurement">
        <All />
        <MeasurementDisplay />
      </div>
    </>
  );
}

export default Measurement;
