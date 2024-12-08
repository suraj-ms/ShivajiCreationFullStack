import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePantMeasurement } from '../../../utils/redux/Measurement/measurementSlice';
import FloatingInput from '../../usables/FloatingInput';

function Pant() {
  const dispatch = useDispatch();
  const pantMeasurements = useSelector((state) => state.measurements.pantMeasurements);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePantMeasurement({ field: name, value }));
  };

  return (
    <div className="pant measurement_item" style={{ background: '#f2ccff' }}>
      <h3>Pant</h3>
      <div style={{ display: 'flex' }}>
        <FloatingInput label="Length" name="Length" value={pantMeasurements.Length} onChange={handleChange} />
        <FloatingInput label="width" name="width" value={pantMeasurements.width} onChange={handleChange} />
      </div>
      <div style={{ display: 'flex' }}>
        <FloatingInput label="Hip" name="Hip" value={pantMeasurements.Hip} onChange={handleChange} />
        <FloatingInput label="Fork" name="Fork" value={pantMeasurements.Fork} onChange={handleChange} />
      </div>
      <FloatingInput label="Bottom" name="Bottom" value={pantMeasurements.Bottom} onChange={handleChange} />
      <div style={{ display: 'flex' }}>
        <FloatingInput label="Rt" name="Rt" value={pantMeasurements.Rt} onChange={handleChange} />
        <FloatingInput label="Knee" name="Knee" value={pantMeasurements.Knee} onChange={handleChange} />
      </div>
    </div>
  );
}

export default Pant;
