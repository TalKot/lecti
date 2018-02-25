import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';

import Header from './Header/Header';
import Test from './test/test';
import Footer from './Footer/Footer';
import Landing from './Landing/Landing';
import PurchaseGroups from './PurchaseGroups/PurchaseGroups';
import Payments from './Payments/Payments';
import Surveys from './Surveys/Surveys';
import SurveyNew from './Surveys/SurveyNew';

const Profile = () => <h2>Profile</h2>;
const Cart = () => <h2>Cart</h2>;


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
                        <Route exact path="/surveys/new" component={SurveyNew}/>
                        {/*<Route exact path="/purchasegroups" component={PurchaseGroups}/>*/}
                        <Route exact path="/purchasegroups/:item" component={PurchaseGroups}/>
                        <Route exact path="/profile" component={Profile}/>
                        <Route exact path="/payments" component={Payments}/>
                        <Route exact path="/Cart" component={Cart}/>
                        <Route exact path="/test" component={Test}/>
                        <Footer/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null, actions)(App);
