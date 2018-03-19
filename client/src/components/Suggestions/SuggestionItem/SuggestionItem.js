import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import axios from "axios/index";

class SuggestionPurchaseGroupItem extends Component {

    async componentDidMount() {
        const ID = this.props.match.params.id;
        const {data} = await axios.get(`/api/purchaseGroup/getsuggestions/${ID}`);
        this.setState({suggestion: data});
    }

    takeOwnership = async () => {
        const ID = this.state.suggestion._id;
        const {data} = await axios.post(`/api/purchaseGroup/getsuggestions/${ID}`);
        console.log(data);
    };

    takeOwnershipIfAdmin = () => {
        if (this.props.auth.isSeller) {
            return (
                <button className="card-panel #fff9c4 blue lighten-4 center text-darken-2" style={{width: "100%"}}
                        onClick={() => this.takeOwnership()}
                >
                    Because your user type is "seller", you can take ownership on this purchase group suggestion.
                </button>
            )
        }
    };


    render() {
        if (!this.props.auth || !this.state) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        }
        console.log(this.state.suggestion);
        return (
            <div>
                <div className="card-panel #fff9c4 yellow lighten-4 center">
                    <span className="text-darken-2">Warning! This Purchase group is not active until some seller will manage to supply the items.</span>
                </div>
                {this.takeOwnershipIfAdmin()}

                <h1>
                    {this.state.suggestion._id}
                </h1>
            </div>
        )
    };

};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps, actions)(SuggestionPurchaseGroupItem);
