import React from 'react'
import { useSelector } from 'react-redux';

function SuitDisplay() {
  return (
    <div>
    <h3>Suit Measurements</h3>
    <div className="measurement_values">
        <div><p className="length"> {suitMeasurements.Length}</p></div>
        <div><p className="shoulder"> {suitMeasurements.Shoulder}</p></div>
        <div style={{display:'flex'}}>
            <div className="full">
                <div><p className="Length"> {suitMeasurements.FullLength}</p></div>
                <div><p className="Elbow"> {suitMeasurements.fElbow}</p></div>
            </div>
            <div className="half">
                <div><p className="Length"> {suitMeasurements.HalfLength}</p></div>
                <div><p className="Elbow"> {suitMeasurements.Elbow}</p></div>
            </div>
        </div>
        <div><p className="Neck"> {suitMeasurements.Neck}</p></div>
        <div>
            <div className="rf">
                <div><p> {suitMeasurements.Rf1}</p></div>
                <div><p> {suitMeasurements.Rf2}</p></div>
                <div><p>{suitMeasurements.Rf3}</p></div>
                <div><p> {suitMeasurements.Rf4}</p></div>
            </div>
        </div>
    </div>
</div>
  )
}

export default SuitDisplay