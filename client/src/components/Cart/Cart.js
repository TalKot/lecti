import React, {Component} from 'react';
import {connect} from "react-redux";
import axios from "axios/index";
import {Link} from 'react-router-dom';
import * as actions from '../../actions';


class Cart extends Component {

    CancelCartPurchaseGroup = async (purchaseGroupID) => {
        await axios.post(`/api/cart/remove/${purchaseGroupID}/`);
        this.props.fetchUser();
    };

    render() {
        if (!this.props.auth) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            )
        }

        if(!this.props.auth.cart.length){
            return(
                <div style={{textAlign: 'center'}}>
                    <h1>Cart Empty</h1>
                </div>
            );
        }

        return (
            <div style={{textAlign: 'center'}}>


                <h1>Cart</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Time</th>
                        <th>Remove Group</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.auth.cart.map(({purchaseGroup,amount,time}) => {

                            return (
                                <tr key={Math.random()}>
                                    <td key={Math.random()}><Link
                                        to={`/purchasegroup/${purchaseGroup}`}>{purchaseGroup}</Link>
                                    </td>
                                    <td key={Math.random()}>{amount}</td>
                                    <td key={Math.random()}>{time}</td>
                                    <td>
                                        <button className="btn-floating"
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

