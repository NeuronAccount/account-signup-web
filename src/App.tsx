import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';
import SignupPage from './signupPage/SignupPage';

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route path="/" component={SignupPage}/>
            </BrowserRouter>
        );
    }
}