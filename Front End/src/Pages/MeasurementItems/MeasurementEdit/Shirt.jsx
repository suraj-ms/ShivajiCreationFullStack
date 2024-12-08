import React from 'react';
import FloatingInput from '../../usables/FloatingInput';
import { useDispatch, useSelector } from 'react-redux';
import { updateShirtMeasurement } from '../../../utils/redux/Measurement/measurementSlice';

function Shirt() {
    const dispatch = useDispatch();
    const shirtMeasurements = useSelector((state) => state.measurements.shirtMeasurements);

    const handleInputChange = (field, value) => {
        dispatch(updateShirtMeasurement({ field, value }));
    };

    return (
        <div className="shirt measurement_item" style={{ background: '#ccb3ff' }}>
            <h3>Shirt</h3>
            <div style={{ display: 'flex' }}>
                <FloatingInput
                    label="Length"
                    value={shirtMeasurements.Length}
                    onChange={(e) => handleInputChange('Length', e.target.value)}
                />
                <FloatingInput
                    label="Shoulder"
                    value={shirtMeasurements.Shoulder}
                    onChange={(e) => handleInputChange('Shoulder', e.target.value)}
                />
            </div>
            <div style={{ display: 'flex' }}>
                <div className="full">
                    <h4>Full</h4>
                    <FloatingInput
                        label="Length"
                        value={shirtMeasurements.FullLength}
                        onChange={(e) => handleInputChange('FullLength', e.target.value)}
                    />
                    <FloatingInput
                        label="Elbow"
                        value={shirtMeasurements.fElbow}
                        onChange={(e) => handleInputChange('fElbow', e.target.value)}
                    />
                    <FloatingInput
                        label="Down Width"
                        value={shirtMeasurements.DownWidth}
                        onChange={(e) => handleInputChange('DownWidth', e.target.value)}
                    />
                    <FloatingInput
                        label="Cuff"
                        value={shirtMeasurements.Cuff}
                        onChange={(e) => handleInputChange('Cuff', e.target.value)}
                    />
                </div>
                <div className="half">
                    <h4>Half</h4>
                    <FloatingInput
                        label="Length"
                        value={shirtMeasurements.HalfLength}
                        onChange={(e) => handleInputChange('HalfLength', e.target.value)}
                    />
                    <FloatingInput
                        label="Elbow"
                        value={shirtMeasurements.hElbow}
                        onChange={(e) => handleInputChange('hElbow', e.target.value)}
                    />
                </div>
            </div>
            <FloatingInput
                label="Neck"
                value={shirtMeasurements.Neck}
                onChange={(e) => handleInputChange('Neck', e.target.value)}
            />
            <div style={{ display: 'flex' }}>
                <div>
                    <h4>Rf</h4>
                    <FloatingInput
                        label="Rf1"
                        value={shirtMeasurements.Rf1}
                        onChange={(e) => handleInputChange('Rf1', e.target.value)}
                    />
                    <FloatingInput
                        label="Rf2"
                        value={shirtMeasurements.Rf2}
                        onChange={(e) => handleInputChange('Rf2', e.target.value)}
                    />
                    <FloatingInput
                        label="Rf3"
                        value={shirtMeasurements.Rf3}
                        onChange={(e) => handleInputChange('Rf3', e.target.value)}
                    />
                    <FloatingInput
                        label="Rf4"
                        value={shirtMeasurements.Rf4}
                        onChange={(e) => handleInputChange('Rf4', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default Shirt;
