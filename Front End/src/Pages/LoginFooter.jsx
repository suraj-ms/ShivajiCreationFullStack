import React from 'react'
import '../Styles/LoginFooter.css'
import { Link, useNavigate } from 'react-router-dom';

function LoginFooter() {
    return (
        <div className='footer_container'>
            <div className="copy_rights">
                Shivaji Creation © {new Date().getFullYear()}
            </div>
            <div className="footer_links">
                <Link className='footer_link' style={{marginRight:"20px"}}  to={'/'}>Home</Link>
                <Link className='footer_link' to={'/aboutus'}>About Us</Link>
            </div>
        </div>
    )
}

export default LoginFooter