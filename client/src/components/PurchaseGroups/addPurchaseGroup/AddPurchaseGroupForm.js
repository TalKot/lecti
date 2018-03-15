import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {Link} from 'react-router-dom';
import formFields from "./formFields";
import PurchaseGroupField from "./PurchaseGroupField";
// import validateEmails from "../../../utils/validateEmails";

var options = [
    { value: 'computers', label: 'computers' },
    { value: 'shoes', label: 'shoes' }
];

class AddPurchaseGroup extends Component {
    renderFields() {
        return formFields.map(({label, name}) => {
            return (
                <Field
                    key={name}
                    component={PurchaseGroupField}
                    type="text"
                    label={label}
                    name={name}
                />
            );
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    <div className="input-field col s12">
                        <select  options={options} defaultValue='computers'>
                            <option value="computers">computers</option>
                            <option value="shoes">shoes</option>
                        </select>
                        <label>Materialize Select</label>
                    </div>
                    {this.renderFields()}


                    <Link to="/home" className="red btn-flat white-text">
                        Cancel
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text">
                        Next
                        <i className="material-icons right">done</i>
                    </button>

                </form>
            </div>

        );
    }

}

function validate(values) {
    const errors = {};

    // validate values in form fields
    formFields.forEach(({name}) => {
        if (!values[name]) {
            errors[name] = 'You must provide a value';
        }

    });
    //returns fields errors
    return errors;
}

export default reduxForm({
    validate,
    form: 'AddPurchaseGroup'
})(AddPurchaseGroup);
