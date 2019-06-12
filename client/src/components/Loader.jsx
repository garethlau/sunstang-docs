import React from 'react';
import Loader from 'react-loader-spinner';

import loaderStyles from '../styles/loaderStyles.module.css';

/*
Really big pages, don't put anything. Default of 80 looks great
Smaller loading areas, use a size of size={40};
Really small areas, use size of size={20}
*/

const Loading = (props) => {
	let width;
	if (props.size === undefined) {
		width = "80px"
	}
	else {
		width = props.size + 'px'
	}
	return (
		<div class={loaderStyles.container} style={{width: width, margin: "auto", paddingTop: props.paddingTop || "150px"}}>
			<Loader type="Triangle" color="rgb(255, 165, 0)" height={props.size || 80} width={props.size || 80} />
		</div>
	)
};
export default Loading;