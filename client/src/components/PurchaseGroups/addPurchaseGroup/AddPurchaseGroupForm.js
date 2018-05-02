import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import formFields from "./formFields";
import PurchaseGroupField from "./PurchaseGroupField";
import Types from '../../../utils/types';
import { Grid, Image, Label, Segment } from 'semantic-ui-react'


class AddPurchaseGroup extends Component {
    renderFields() {
        return formFields.map(({ label, name }) => {

            if (name === 'subCategory') {

                return (
                    <div key={'subCategory'}>
                        <label style={{ margin: '10px' }}>{label}</label>
                        <Field name={name} component="select" type="text" key={name} label={label} className="browser-default">
                            {this.getSubCategories()}
                        </Field>
                    </div>
                );
            } else if (name === 'type') {
                return (
                    <div key={'category'}>
                        <label style={{ margin: '10px' }}>{label}</label>
                        <Field name={name} component="select" type="text" key={name} label={label} className="browser-default">
                            {this.getCategories()}
                        </Field>
                    </div>
                );
            } else {
                return (
                    <Field
                        key={name}
                        component={PurchaseGroupField}
                        type="text"
                        label={label}
                        name={name}
                    />
                );
            }
        });
    }

    getCategories = () => {
        return Types.categories.map(({ value, name }) => {
            return (
                <option key={value} value={value}>{name}</option>
            );
        });
    };

    getSubCategories = () => {
        return Object.keys(Types.subCategories).map((type) => {
            return Types.subCategories[type].map(({ name, value }) => {
                return (
                    <option key={value} value={value} > {name}</option>
                );
            })
        });
    };

    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>

                    <Grid columns={1}>
                        <Grid.Column>
                            <Segment raised>
                                <Label as='a' color='red' ribbon>Overview</Label>
                                <span>Account Details</span>
                                <br /><br />
                                {this.renderFields()}

                                <Label as='a' color='blue' ribbon>Community</Label>
                                <span>User Reviews</span>
                                <br /><br />
                                <Link to="/home" className="red btn-flat white-text">
                                    Cancel
                                </Link>
                                <button type="submit" className="teal btn-flat right white-text">
                                    Next
                                    <i className="material-icons right">done</i>
                                </button>
                            </Segment>
                        </Grid.Column>
                    </Grid>
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
