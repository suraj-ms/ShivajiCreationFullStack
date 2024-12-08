import React from 'react'
import Pant from "./Pant";
import Shirt from "./Shirt";
import Suit from "./Suit";
import Bandi from './Bandi';
import Jubba from './Jubba';
import Pyjama from './Pyjama';


function All() {
    return (

        <div className="measurement_details">
            <div className="measurement_section">
                <Pant />
                <Shirt />
                <Suit />
                <Bandi />
                <Jubba />
                <Pyjama />
            </div>
            <div className="reaction_btn">
                <input type="reset" value="Reset" />
                <input type="submit" value="Submit" />
            </div>

        </div>

    )
}

export default All