import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain2.png';
import './Logo.css';


const Logo = () => {
        return (
            <div className="ma4 mt0">
                <Tilt className="Tilt br2 shadow-2 fill" options={{ max : 55 }} style={{ height: '120px', width: '120px' }} >
                    <div className="Tilt-inner"><img style={{height: '120px', width: '120px'}} src={brain} className="box" alt=""/></div>
                </Tilt>
            </div>
        )
}

export default Logo;