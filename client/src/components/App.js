import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

const Header = () => <h2>Header</h2>
const Landing = () => <h2>Landing</h2>

class App extends Component {
    render() {
        return(
            <>
                <BrowserRouter>
                    <>
                        <Route exact={true} path="/" component={Landing}/>
                    </>
                </BrowserRouter>
            </>
        )
    }
}

export default App;
