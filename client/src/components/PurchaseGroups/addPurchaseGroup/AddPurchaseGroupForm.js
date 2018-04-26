import React, { Component } from 'react';
import { reduxForm, Field, select } from 'redux-form';
import { Link } from 'react-router-dom';
import formFields from "./formFields";
import PurchaseGroupField from "./PurchaseGroupField";

class AddPurchaseGroup extends Component {
    renderFields() {
        return formFields.map(({ label, name }) => {

            if (name === 'subCategory') {
                return (
                    <div key={name}>
                        <label>{label}</label>
                        <select className="browser-default">
                            {this.getOptions()}
                        </select>
                    </div>
                );
            }
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
    getOptions = () => {

        const subCatagories = [
            { name: 'Shirts', value: 'Shirts' },
            { name: 'Shoes', value: 'Shoes' },
            { name: 'Computers', value: 'Computers' },
        ];

        return subCatagories.map(({ value, name }) => {
            return (
                <option key={name} value={value}>{name}</option>
            );
        });
    };

    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>


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
    form: 'AddPurchaseGroup',
})(AddPurchaseGroup);
