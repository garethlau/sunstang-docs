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
  
    const bannerStyle = {
        backgroundColor: bannerColor,
        opacity: "1.0",
        height: "40px",
        border: "none",
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
    const renderIcon = () => {
        switch(props.status) {
            case "success":
                return (
                    <i class="material-icons">
                        check_circle_outline
                    </i>
                )
            case "warning":
                return (
                    <i class="material-icons">
                        warning
                    </i>
                )
            case "fail":
                return (
                    <i class="material-icons">
                        error_outline
                    </i>
                )
            default:
                return (
                    <></>
                )
        }
    }

    return (
        <div className={popupBannerStyles.bannerContainer}>
            <div style={bannerStyle} className={popupBannerStyles.slide} >
                <div className={popupBannerStyles.textContainer}>
                    <p className={popupBannerStyles.textStyle}>
                        {message}
                    </p>
                </div>
                <div className={popupBannerStyles.iconContainer}>
                    {renderIcon()}
                </div>
            </div>
        </div>
    )
}

export default PopupBanner;