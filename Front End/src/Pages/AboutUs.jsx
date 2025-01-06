import React from 'react';
import Masonry from "react-masonry-css";
import image1 from '../assets/gallary/image1.PNG';
import image2 from '../assets/gallary/image2.PNG';
import image3 from '../assets/gallary/image3.PNG';
import image from '../assets/gallary/image.PNG';
import image4 from '../assets/gallary/image4.PNG';
import image5 from '../assets/gallary/image5.PNG';
import image6 from '../assets/gallary/image6.PNG';
import image7 from '../assets/gallary/image7.PNG';
import LoginFooter from './LoginFooter';
import { Link, useNavigate } from 'react-router-dom';

import '../Styles/AboutUs.css';

const AboutUs = () => {
    const images = [
        image1,
        image2,
        image3,
        image4,
        image5,
        image,
        image6,
        image7,
    ];

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div>
            <div className="about_pg_header">
                <h1>About US</h1>
                <b className="about_pg_header_desc">
                    Our mission is to systematically <span style={{ color: "blue" }}>organize</span> daily
                    <span style={{ color: "red" }}> data</span>  and ensure it is <span style={{ color: "green" }}>universally accessible</span> and valuable for all users.
                </b>
            </div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
            >
                {images.map((image, index) => (
                    <div key={index} className="masonry-item">
                        <img src={image} alt={`image-${index}`} className="masonry-img" />
                    </div>
                ))}
            </Masonry>
            <h2 style={{ fontSize: '2.5rem', paddingBottom: '50px' }}>Make life easier with a little help from Shivaji Creations </h2>
            <div style={{ width: "90%", margin: "30px auto", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", padding: "20px" }}>
                <img src={image1} alt="" width="50%" />
                <p style={{ fontSize: "1.3rem", paddingTop: "30px" }}>Manage Customer Dashboard to edit and update order status</p>
            </div>

            <div style={{ width: "90%", margin: "30px auto", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", padding: "20px" }}>
                <img src={image2} alt="" width="50%" />
                <p style={{ fontSize: "1.3rem", paddingTop: "30px" }}>Add multiple customers</p>
            </div>

            <div style={{ width: "90%", margin: "30px auto", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", padding: "20px" }}>
                <img src={image5} alt="" width="50%" />
                <p style={{ fontSize: "1.3rem", paddingTop: "30px" }}>Manage bill sections</p>
            </div>

            <div style={{ width: "90%", margin: "30px auto", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", padding: "20px" }}>
                <img src={image7} alt="" width="50%" />
                <p style={{ fontSize: "1.3rem", paddingTop: "30px" }}>Manage employee tickets and billing section</p>
            </div>
            <br />
            <br />
            <hr />
            <br />
            <br />
            <div>
                <h1>Developed By</h1>
                <br />
                <p>Get to know the people driving innovation at platform.</p>
                <div style={{background: "white",width:"fit-content", padding: "20px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", borderRadius: "10px", margin: "20px auto"}}>
                    <b style={{fontSize:"2rem"}}><ion-icon style={{fontSize:"1.5rem"}} name="person-outline"></ion-icon> Suraj MS</b>
                    <div style={{padding:"10px", fontWeight:"bolder"}}>Founder</div>
                    <div style={{padding:"10px"}}>Suraj is a visionary leader with a passion for software and innovation.</div>
                    <div>
                        <Link className='footer_link' to={'https://www.linkedin.com/in/suraj-m-s-757540151/'}><ion-icon name="logo-linkedin"></ion-icon></Link>

                    </div>
                </div>
            </div>

            <div style={{ width: '100%', height: "100px" }}></div>
            <LoginFooter />
        </div>
    );
}

export default AboutUs;