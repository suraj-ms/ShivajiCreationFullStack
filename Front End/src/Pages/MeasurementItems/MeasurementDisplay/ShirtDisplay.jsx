import React from 'react';
import { useSelector } from 'react-redux';

function ShirtDisplay() {
    const shirtMeasurements = useSelector((state) => state.measurements.shirtMeasurements);

    return (
        <div>
            <h3>Shirt Measurements</h3>
            <div className="measurement_values">
                <div><p className="length"> {shirtMeasurements.Length}</p></div>
                <div><p className="shoulder"> {shirtMeasurements.Shoulder}</p></div>
                <div style={{display:'flex'}}>
                    <div className="full">
                        <div><p className="Length"> {shirtMeasurements.FullLength}</p></div>
                        <div><p className="Elbow"> {shirtMeasurements.fElbow}</p></div>
                        <div><p className="down_width"> {shirtMeasurements.DownWidth}</p></div>
                        <div><p className="Cuff"> {shirtMeasurements.Cuff}</p></div>
                    </div>
                    <div className="half">
                        <div><p className="Length"> {shirtMeasurements.HalfLength}</p></div>
                        <div><p className="Elbow"> {shirtMeasurements.Elbow}</p></div>
                    </div>
                </div>
                <div><p className="Neck"> {shirtMeasurements.Neck}</p></div>
                <div>
                    <div className="rf">
                        <div><p> {shirtMeasurements.Rf1}</p></div>
                        <div><p> {shirtMeasurements.Rf2}</p></div>
                        <div><p>{shirtMeasurements.Rf3}</p></div>
                        <div><p> {shirtMeasurements.Rf4}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShirtDisplay;
