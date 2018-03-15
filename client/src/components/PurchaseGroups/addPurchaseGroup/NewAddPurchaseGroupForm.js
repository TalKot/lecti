import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import AddPurchaseGroupForm from './AddPurchaseGroupForm';
import PurchaseGroupFormReview from './PurchaseGroupFormReview';

class NewAddPurchaseGroupForm extends Component {
    //manage componente state short version without constructor
    state = { showFormReview: false };

    renderContent() {
        if (this.state.showFormReview) {
            return (
                <PurchaseGroupFormReview
                    onCancel={() => this.setState({ showFormReview: false })}
                />
            );
        }

        return (
            <AddPurchaseGroupForm
                onSurveySubmit={() => this.setState({ showFormReview: true })}
            />
        );
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        );
    }
}

export default reduxForm({
    form: 'AddPurchaseGroup'
})(NewAddPurchaseGroupForm);
