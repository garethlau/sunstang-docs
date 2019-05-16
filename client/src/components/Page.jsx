import React, {Component} from 'react';
import axios from "axios";

// import components
import Loader from './Loader';

class Page extends Component {
	state ={
		isLoaded: false
	};
	componentDidMount() {
		console.log(this.props.location.pathname.split('/'));
		if (this.props.location.pathname.split('/').length === 4) {
			// a page id was provided in the url
			const pageId = (this.props.location.pathname).split('/')[3];
			console.log("Page id was provided: ", pageId);
	        const path = "/api/get-page/" + pageId;
	        axios.get(path).then((res) => {
	        	console.log("res is", res);
	        	console.log("res.data.content is", JSON.parse(res.data.content));
	            this.setState({
		            isLoaded: true,
			        pageTitle: res.data.title,
			        authorId: res.data.authorId,
		            content: JSON.parse(res.data.content),
		            pageId: res.data._id
		        })
	        })
		}
		else {
			// user shouldn't access this route without a page ID
		}
	}
	renderTitle = () => {
		if (this.state.isLoaded) {
			return (
				<h1>{this.state.pageTitle}</h1>
			)
		}
		else {
			return (
				<h1>Default Header</h1>
			)
		}
	};
	renderBlocks = () => {
		if (this.state.isLoaded) {
			console.log("Loaded");
			return this.state.content.blocks.map((block) => {
				console.log("block.text is", block.text);
				return(
					<div key={block.key}>
						{block.text}
					</div>
				)
			})
		}
		else {
			// blocks not loaded
			console.log("Not loaded");
			return(
				<Loader/>
			)
		}
	};

	render() {
		return(
			<div>
				{this.renderTitle()}
				{this.renderBlocks()}
			</div>
		)
	}
}
export default Page;