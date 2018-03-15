import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions'

const PurchaseGroupFormReview = ({ onCancel, formValues,createNewPurchaseGroup, history }) => {
  const reviewFields = formFields.map(({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>
          {formValues[name]}
        </div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button
        className="yellow darken-3 white-text btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        onClick={() => createNewPurchaseGroup(formValues, history)}
        className="green btn-flat right white-text"
      >
        Submittt
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return { formValues: state.form.AddPurchaseGroup.values };
}

export default connect(mapStateToProps, actions)(withRouter(PurchaseGroupFormReview));
