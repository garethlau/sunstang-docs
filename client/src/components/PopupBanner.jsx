import React from 'react';

import popupBannerStyles from '../styles/popupBannerStyles.module.css';


const PopupBanner = (props) => {
    let bannerColor;
    if (props.status === "success") {
        bannerColor = "#43A047"
    }
    else if (props.status === "fail") {
        //bannerColor = "#FFBABA"
        bannerColor = "#ff8e8e";
    }
    else if (props.status === "warning") {
        bannerColor = "#ffcf56"
    }
    const bannerContainer = {
        width: "60%",
        paddingLeft: "20%",
        paddingRight: "20%",
        position: "fixed",
        top: "0px",
        left: "0",
    }
    const bannerStyle = {
        backgroundColor: bannerColor,
        opacity: "1.0",
        height: "40px",
        width: "60%",
        border: "none",
    }
    const textStyle = {
        paddingTop: "10px",
        paddingLeft: "10px",
        marginTop: "0"
    }
    let message = props.message;
    if (props.message === undefined) {
        switch(props.status) {
            case "success":
                message = "Sucess"
                break;
            case "warning":
                message ="Warning";
                break;
            case "fail":
                message = "Fail";
                break;
            default:
                message = "There is supposed to be a message here."
            }

    }
    return (
        <div style={bannerContainer}>
            <div style={bannerStyle} className={popupBannerStyles.slide} >
                <p style={textStyle}>
                    {message}
                </p>
            </div>
        </div>
    )
}

export default PopupBanner;