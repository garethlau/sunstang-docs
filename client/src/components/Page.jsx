import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from "axios";

// import components
import Loader from './Loader';

class Page extends Component {
	componentDidMount() {
		// default page stuff goes here

	}
	render() {
		if (this.props.page === undefined || this.props.page.length === 0) {
			// the page hasn't been loaded in
			return (
				<Loader/>
			)
		}
		else {
			// the page has been loaded we can display it
			const page = this.props.page;
			const blocks = JSON.parse(this.props.page.content).blocks;
			console.log(blocks);

			const displayBlocks = blocks.map(block => {
				return (
					<div key={block.key}>
						<p>Block text is: {block.text}</p>
						<p>Block type is: {block.type}</p>
						<p>Block key is: {block.key}</p>
					</div>
				)
			});

			return (
				<div>
					<h1>{page.title}</h1>
					<p>{page.authorId}</p>
					{displayBlocks}
				</div>
			)
		}
	}
}
function mapStateToProps (state) {
	return ({
		page: state.page
	})
}

export default connect(mapStateToProps, {})(Page);