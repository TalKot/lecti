import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions';

// import axios from "axios/index";

class SuggestionPurchaseGroupItem extends Component {

    takeOwnershipIfAdmin = () => {
        if (this.props.auth.isSeller) {
            return (
                <div className="card-panel #fff9c4 blue lighten-4 center">
                    <span className="text-darken-2">Because your user is tpye seller, you can take ownership on this purchase group suggestion.</span>
                </div>
            )
        }
    };


    render() {
        if (!this.props.auth) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        }

        return (
            <div>
                <div className="card-panel #fff9c4 yellow lighten-4 center">
                    <span className="text-darken-2">Warning! This Purchase group is not active until some seller you manage to supply the items.</span>
                </div>
                {this.takeOwnershipIfAdmin()}

                <h1>
                    {this.props.match.params.id}
                </h1>
            </div>
        )
    };

};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps, actions)(SuggestionPurchaseGroupItem);
