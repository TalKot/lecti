import React, {Component} from 'react';
import {connect} from "react-redux";
import axios from "axios/index";
import {Link} from 'react-router-dom';
import * as actions from '../../actions';
import Loder from '../Loader/Loader'


class Cart extends Component {

    CancelCartPurchaseGroup = async (purchaseGroupID) => {
        await axios.post(`/api/cart/remove/${purchaseGroupID}/`);
        this.props.fetchUser();
    };

    render() {
        if (!this.props.auth) {
            return (
                <Loder />
            )
        }

        if (!this.props.auth.cart.length) {
            return (
                <div style={{textAlign: 'center'}}>
                    <h4>Your Lecti Shopping Cart</h4>
                    <div style={{width:"70%",color:"gray",margin:"auto"}}>
                        <p>
                            Your shopping cart is empty, but it doesn't have to stay that way.
                            There are lots of great purchase groups to explore and one-of-a-kind items just waiting for
                            you to purchase and join.
                        </p>
                        <p>
                            Start shopping with the "Buy" button, and look for the "Cart" button as well. You can add
                            several items to your cart
                            from different sellers and pay for as long as they are still active.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div style={{textAlign: 'center'}}>

                <h4>Your Lecti Shopping Cart</h4>
                <table className="striped centered">
                    <thead>
                    <tr>
                        <th />
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Time</th>
                        <th>Remove Group</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.auth.cart.map(({purchaseGroup, amount, time},key) => {

                            return (
                                <tr key={Math.random()}>
                                    <td>{key + 1}</td>
                                    <td key={Math.random()}><Link
                                        to={`/purchasegroup/${purchaseGroup}`}>{purchaseGroup}</Link>
                                    </td>
                                    <td key={Math.random()}>{amount}</td>
                                    <td key={Math.random()}>{time}</td>
                                    <td>
                                        <button className="btn-floating pulse"
                                                onClick={() => {
                                                    this.CancelCartPurchaseGroup(purchaseGroup);
                                                }}><i className="material-icons">remove_shopping_cart</i></button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    };

};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps, actions)(Cart);

