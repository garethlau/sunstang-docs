import React, {Component} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {Link} from 'react-router-dom';
// import actions
import Axios from 'axios';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};


class PageList extends Component {
    componentDidMount () {
        console.log("pages as props", this.props.pages);
    }

    constructor (props) {
        super(props);
        let {pages} = this.props;
        this.state = {
            // titles: this.props.titles
            pages: pages,
            showSuccessPopup: false
        }
        this.onDragEnd = this.onDragEnd.bind(this);

    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const pages = reorder(
            this.state.pages,
            result.source.index,
            result.destination.index
        );
        this.setState({
            pages: pages
        });
    }

    saveList = () => {
        console.log(this.state.pages);
        Axios.post('/api/pages', {data: this.state.pages}).then((res) => {
            console.log(res);
            // todo show some sort of confirmation that it was successfully saved
            this.setState({
                showSuccessPopup: true
            });
            setTimeout(() => {
                this.setState({
                    showSuccessPopup: false
                });
            }, 3000);   // show the success popup for 3 seonds
        }).catch(err => console.log(err));
    }


    renderSuccessPopup = () => {
        if (this.state.showSuccessPopup) {
            return (
                <div>
                    SAVED
                </div>
            )
        }
    }

    render() {     
        return (
            <>

                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {this.state.pages.map((page, index) => (
                                <Draggable key={page._id} draggableId={page._id} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <Link to={"/edit/page/" + page._id}>{page.title}</Link>
                                        </div>
                                    )}
                                </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <button onClick={() => this.saveList()}>SAVE</button>
                {this.renderSuccessPopup()}
            </>
        );
    }
}
export default PageList;