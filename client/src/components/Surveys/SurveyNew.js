import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import SurveyForm from './SurveyForm';

class SurveyNew extends Component {

    render() {
        return (
            <div>
                <SurveyForm />
            </div>
        );
    }
}

export default reduxForm({
    form: 'surveyForm'
})(SurveyNew);
