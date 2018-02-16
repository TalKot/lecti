import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';

import Header from './Header/Header';
import Test from './test/test';
import Footer from './Footer/Footer';
import Landing from './Landing/Landing';

// const Header = () => <h2>Header</h2>;
// const Landing = () => <h2>Landing</h2>;
const Surveys = () =>  <h2>Surveys</h2>;
const SurveyNew = () => <h2>SurveyNew</h2>;
const History = () => <h2>History</h2>;
const PurchaseGroups = () => <h2>PurchaseGroups</h2>;
const Profile = () => <h2>Profile</h2>;
// const Footer = () => <h2>Footer</h2>;

class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <div className="container">
                <BrowserRouter>
                    <div>
                        <Header/>
                        <Route exact path="/" component={Landing}/>
                        <Route exact path="/surveys" component={Surveys}/>
                        <Route exact path="/survey/new" component={SurveyNew}/>
                        <Route exact path="/history" component={History}/>
                        <Route exact path="/purchasegroups" component={PurchaseGroups}/>
                        <Route exact path="/profile" component={Profile}/>
                        <Route exact path="/test" component={Test}/>
                        <Footer/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null, actions)(App);
