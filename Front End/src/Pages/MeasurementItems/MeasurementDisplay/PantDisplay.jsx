import React from 'react';
import { useSelector } from 'react-redux';

function PantDisplay() {
  const pantMeasurements = useSelector((state) => state.measurements.pantMeasurements);


  return (
    <div>
      <h3>Pant</h3>
      <div className="measurement_values">
        <div><p className="Length">{pantMeasurements.Length}</p></div>
        <div><p className="width">{pantMeasurements.width}</p></div>
        <div><p className="Hip">{pantMeasurements.Hip}</p></div>
        <div><p className="Fork">{pantMeasurements.Fork}</p></div>
        <div><p className="Bottom">{pantMeasurements.Bottom}</p></div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '60px' }}>
            <label htmlFor="">Rt </label>
            <div><p className="Rt"> {pantMeasurements.Rt}</p></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '60px' }}>
            <label htmlFor="">Knee </label>
            <div><p className="Knee">{pantMeasurements.Knee}</p></div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PantDisplay;
