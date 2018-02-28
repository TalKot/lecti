import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import FormField from './FormField';
import formFields from './formFields';
import { Link } from 'react-router-dom';
import validateEmails from "../../utils/validateEmails";


class BecomeSeller extends Component {
    renderFields() {
        return formFields.map(({ label, name }) => {
            return (
                <Field
                    key={name}
                    component={FormField}
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
                <form>
                    {this.renderFields()}
                    <Link to="/" className="red btn-flat white-text">
                        Cancel
                    </Link>
                    <button
                        // onClick={() => this.props.submitSurvey(()=>{})}
                        onClick = {(values)=>{this.props.becomeSellerSubmit(values)}}
                        className="green btn-flat right white-text"
                    >
                        Send
                        <i className="material-icons right">email</i>
                    </button>
                </form>
            </div>
        );
    }

}

function validate(values) {
    const errors = {};

    errors.recipients = validateEmails(values.recipients || '');

    // validate values in form fields
    formFields.forEach(({ name }) => {
        if (!values[name]) {
            errors[name] = 'You must provide a value';
        }

    });
    //returns fields errors
    return errors;
}

export default reduxForm({
    validate,
    becomeSellerForm: 'surveyForm'
})(BecomeSeller);
