import React from 'react';
import { ReactComponent as ProgrammingImg } from '../assets/undraw_programming_2svr.svg';
import { ReactComponent as CarImg } from '../assets/undraw_toy_car_7umw.svg';
import placeholderStyles from '../styles/placeholderStyles.module.css';

const Placeholder = () => {
    return (
        <div className={placeholderStyles.container}>
            <div className={placeholderStyles.textContainer}>
                <h2>Oops, this page isn't ready yet! </h2>
                <p>The developer is busy playing with toy cars...</p>
            </div>
            <div className={placeholderStyles.imgContainer}>
                <CarImg/>
            </div>
        </div>
    )
} 
export default Placeholder;