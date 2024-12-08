import React from 'react'
import FloatingInput from "../../usables/FloatingInput";

function Jubba() {
    return (
        <div className="jubba measurement_item" style={{ background: '#ccb3ff' }}>
            <h3>Jubba</h3>
            <div style={{ display: 'flex' }}>
                <FloatingInput label="Length" />
                <FloatingInput label="Sholder" />
            </div>
            <div style={{ display: 'flex' }}>
                <div className="full">
                    <h4>Full</h4>
                    <FloatingInput label="Length" />
                    <FloatingInput label="Elbow" />
                    <FloatingInput label="down Width" />
                    <FloatingInput label="Cuff" />
                </div>
                <div className="half">
                    <h4>Half</h4>
                    <FloatingInput label="Length" />
                    <FloatingInput label="Elbow" />
                </div>
            </div>
            <FloatingInput label="Neck" />

            <div>
                <h4>Rf</h4>
                <FloatingInput label="" />
                <FloatingInput label="" />
                <FloatingInput label="" />
            </div>
        </div>
    )
}

export default Jubba