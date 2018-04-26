import React, { Component } from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions'
import axios from 'axios';
import {Link} from 'react-router-dom';

class PurchaseGroupFormReview extends Component {

    state = {
        similar: undefined
    };

    async componentDidMount() {
        const { data } = await axios.get(`/api/purchaseGroup/checksimilar/${this.props.auth.isSeller}/${this.props.formValues.name}`);
        if (data) {
            this.setState({ similar  : data })
        }

    }

    reviewFields = formFields.map(({ name, label }) => {
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {this.props.formValues[name]}
                </div>
            </div>
        );
    });

    getWarning = () => {
        if (this.props.auth.isSeller) {
            //notify to user to purchase group will create as suggestion
            return (
                <div className="card-panel #fff9c4 yellow lighten-4 center">
                    <span className="text-darken-2">Because your user is type seller, this purchase group will open as live and active purchase group.</span>
                </div>

            );
        } else {
            //notify to user to purchase group will create as active purchase group
            return (
                <div className="card-panel #fff9c4 blue lighten-4 center">
                    <span className="text-darken-2">Because your user is type buyer, this purchase group will open on suggestion mode only.</span>
                </div>

            );
        }
    };

    getSimilarGroup = () => {

        if (this.state.similar) {
            return (
                <div className="card-panel #fff9c4 blue lighten-4 center">
                    <span className="text-darken-2">We found the following purchase group to be the same as the one you are trying to open : <Link to={`/purchasegroup/${this.state.similar._id}`}>{this.state.similar.name}</Link></span>
                </div>
            );
        }
    };

    render() {
        return (
            <div>
                {this.getWarning()}
                <h5>Please confirm your entries</h5>
                {this.reviewFields}
                <button
                    className="yellow darken-3 white-text btn-flat"
                    onClick={this.props.onCancel}
                >
                    Back
                </button>
                <button
                    onClick={() => this.props.createNewPurchaseGroup(this.props.formValues, this.props.auth.isSeller, this.props.history)}
                    className="green btn-flat right white-text"
                >
                    Submit
                </button>
                {this.getSimilarGroup()}
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        formValues: state.form.AddPurchaseGroup.values,
        auth: state.auth,
        onCancel: state.onCancel,
        createNewPurchaseGroup: state.createNewPurchaseGroup,
        history: state.history,
    };
}

export default connect(mapStateToProps, actions)(withRouter(PurchaseGroupFormReview));
