import React from "react";

class BlockStyleButton extends React.Component {
	onToggle = e => {
		e.preventDefault();
		this.props.onToggle(this.props.style);
	};

	render() {
		let className = "RichEditor-styleButton";
		if (this.props.active) {
			className += " RichEditor-activeButton";
		}

		return (
			<span className={className}>
                <button onClick={this.onToggle}>
				{this.props.label}
                </button>
			</span>
		);
	}
}

export default BlockStyleButton;
