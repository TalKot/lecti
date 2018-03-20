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
        return await axios.post(`/api/purchaseGroup/getsuggestions/${ID}`);
    };

    takeOwnershipIfAdmin = () => {
        if (this.props.auth.isSeller) {
            return (
                <div className="card-panel #fff9c4 blue lighten-4 center text-darken-2" style={{width: "100%"}}>
                    <a href={`/purchasegroup/${this.state.suggestion._id}`}
                          onClick={() => this.takeOwnership()}
                    >
                        Because your user type is "seller", you can take ownership on this purchase group suggestion.
                    </a>
                </div>
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

                <div style={{textAlign: 'center'}}>
                    <div className="row" style={{textAlign: 'center', margin: '0'}}>
                        <div className="col s8 m5">
                            <div className="card">
                                <div className="card-content">
                                    <h6>Name - <strong>{this.state.suggestion.name}</strong></h6>
                                    <h6>Type - {this.state.suggestion.type}</h6>
                                    <h6>Active - {this.state.suggestion.isActive ? 'true' : 'false'}</h6>
                                    <h6>Deleted - {this.state.suggestion.isDeleted ? 'true' : 'false'}</h6>
                                    <h6>Suggestion
                                        - {this.state.suggestion.isSuggestion ? 'true' : 'false'}</h6>

                                </div>
                                <div className="card-action">
                                    <h6>Description - {this.state.suggestion.description}</h6>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="row">
                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        Original Product Price - {this.state.suggestion.originalPrice}<br/>
                                        Group Price Per Item - {this.state.suggestion.priceForGroup}<br/>
                                        Discount - {this.state.suggestion.discount}%<br/>
                                    </div>
                                </div>

                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        <h6>Stock
                                            - {this.state.suggestion.sales}/{this.state.suggestion.totalAmount}</h6>
                                        <i className="material-icons">shopping_basket</i>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

};

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps, actions)(SuggestionPurchaseGroupItem);
