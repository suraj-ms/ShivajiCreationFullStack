import React from 'react'
import FloatingInput from "../../usables/FloatingInput";

function Suit() {
    return (
        <div className="suit measurement_item" style={{ background: '#b3b3ff' }}>
            <h3>Suit</h3>
            <div style={{ display: 'flex' }}>
                <FloatingInput label="Length" />
                <FloatingInput label="Sholder" />
            </div>

            <div className="full">
                <h4>Sholder</h4>
                <FloatingInput label="Length" />
                <FloatingInput label="Elbow" />
            </div>
            <hr />
            <FloatingInput label="Neck" />

                <div>
                    <h4>Rf</h4>
                    <FloatingInput label="" />
                    <FloatingInput label="" />
                    <FloatingInput label="" />
                    <FloatingInput label="" />
                </div>

        </div>
    )
}

export default Suit