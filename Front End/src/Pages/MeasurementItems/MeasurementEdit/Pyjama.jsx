import React from 'react'
import FloatingInput from "../../usables/FloatingInput";

function Pyjama() {
    return (
        <div className="pyjama measurement_item" style={{ background: '#ffb3d9' }}>
            <h3>Pyjama</h3>
            <div style={{ display: 'flex' }}>
                <FloatingInput label="Length" />
                <FloatingInput label="width" />
            </div>
            <div style={{ display: 'flex' }}>
                <FloatingInput label="Hip" />
                <FloatingInput label="Fork" />
            </div>
            <FloatingInput label="Bottom" />
            <div style={{ display: 'flex' }}>
                <FloatingInput label="Rt" />
                <FloatingInput label="Knee" />
            </div>
        </div>
    )
}

export default Pyjama