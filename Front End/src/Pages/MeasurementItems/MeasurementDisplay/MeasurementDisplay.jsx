import React from 'react'
import '../../../Styles/MeasurementItems/MeasurementDisplay.css'
import PantDisplay from './PantDisplay'
import ShirtDisplay from './ShirtDisplay'
import SuitDisplay from './SuitDisplay';

function MeasurementDisplay() {
  return (
    <div className="measurement_display">
      <div className="measurement_display_container">
        <div className="cust_basic_data">
          <div className="cust_data_items">300</div>
          <div className="cust_data_items">Abdul</div>
          <div className="cust_data_items">7890987654</div>
        </div>
        <div className="measurement_data_section">
          <PantDisplay />
          <ShirtDisplay />
        </div>
      </div>
    </div>
  )
}

export default MeasurementDisplay