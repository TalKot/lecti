import React from 'react';
import {connect} from 'react-redux';
import formFields from './formFields';
import {withRouter} from 'react-router-dom';
import * as actions from '../../../actions'


const PurchaseGroupFormReview = ({onCancel, formValues, createNewPurchaseGroup, history,auth}) => {
    if (!auth) {
        return (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        );
    }

    const reviewFields = formFields.map(({name, label}) => {
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        );
    });

    const getWarning = () => {
        if (auth.isSeller) {
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

    return (
        <div>
            {getWarning()}
            <h5>Please confirm your entries</h5>
            {reviewFields}
            <button
                className="yellow darken-3 white-text btn-flat"
                onClick={onCancel}
            >
                Back
            </button>
            <button
                onClick={() => createNewPurchaseGroup(formValues, auth.isSeller,history)}
                className="green btn-flat right white-text"
            >
                Submit
            </button>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        formValues: state.form.AddPurchaseGroup.values,
        auth : state.auth
    };
}

export default connect(mapStateToProps, actions)(withRouter(PurchaseGroupFormReview));
