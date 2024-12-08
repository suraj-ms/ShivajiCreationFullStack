import React from 'react'
import FloatingInput from "../../usables/FloatingInput";

function Bandi() {
    return (
        <div className="bandi measurement_item" style={{ background: '#b3c6ff' }}>
            <h3>Bandi</h3>

            <FloatingInput label="Length" />
            <FloatingInput label="Sholder" />
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

export default Bandi