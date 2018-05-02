import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header/Header';
import SideBar from './sideBar/sideBar';
import Footer from './Footer/Footer';
import Landing from './Landing/Landing';
import PurchaseGroups from './PurchaseGroups/PurchaseGroups';
import Payments from './Payments/Payments';
import Profile from './Profile/Profile';
import Cart from './Cart/Cart';
import purchaseGroupItem from './PurchaseGroups/PurchaseGroupItem/PurchaseGroupItem';
import SuggestionItem from './Suggestions/SuggestionItem/SuggestionItem';
import Sales from './SalesHistory/SalesHistory';
import Suggestions from './Suggestions/Suggestions';
import Home from './Home/Home';
import Seller from './Seller/Seller'
import NewAddPurchaseGroupForm from './PurchaseGroups/addPurchaseGroup/NewAddPurchaseGroupForm';

class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <div className="container" style={{margin:'0px 100px 0px 100px', width: '100%'}}>
                <BrowserRouter>
                    <div>
                        <Header />
                        {/* <SideBar /> */}
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/home" component={Home} />
                        <Route exact path="/sales" component={Sales} />
                        <Route exact path="/new/purchasegroup/" component={NewAddPurchaseGroupForm} />
                        <Route exact path="/purchasegroup/:item" component={purchaseGroupItem} />
                        <Route exact path="/purchasegroups/:item" component={PurchaseGroups} />
                        <Route exact path="/profile/:id" component={Profile} />
                        <Route exact path="/payments" component={Payments} />
                        <Route exact path="/cart" component={Cart} />
                        <Route exact path="/suggestions" component={Suggestions} />
                        <Route exact path="/suggestions/:id" component={SuggestionItem} />
                        <Route exact path="/seller/:id" component={Seller} />
                        <Footer />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null, actions)(App);
