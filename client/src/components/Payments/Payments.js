import React, {Component} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 5
        };
    }


    render() {
        if (!this.state.amount) return;
        return (
            <StripeCheckout
                name="Lecti"
                description={`Credit your Lecti account - ${this.state.amount}$`}
                amount={this.props.amount * 100}
                token={token => this.props.handleToken(token, this.state.amount)}
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
            >
                <i className="material-icons" style={{cursor: 'pointer'}}>attach_money</i>
            </StripeCheckout>
        );
    }
}

export default connect(null, actions)(Payments);
