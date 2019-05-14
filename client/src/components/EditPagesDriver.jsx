import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchPages} from '../actions';

class EditPagesDriver extends Component {


    componentDidMount() {
        this.props.fetchPages();
    }

    render() {
        console.log(this.props.pages);
        const titlesArray = this.props.pages.map(page => {
            let pagePath = "/edit/page/" + page._id
            return(
                <Link to={pagePath}>
                    <div>
                        {page.title}
                    </div>
                </Link>
            )
        });



        return(
            <>
                hi from document driver
                {titlesArray}
                <Link to="/edit/page">Create new page</Link>
            </>
        )
    }
}

function mapStateToProps(state) {
    return({pages: state.pages})
}

export default connect(mapStateToProps, {fetchPages})(EditPagesDriver);
