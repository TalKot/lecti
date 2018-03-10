import React, {Component} from 'react';
import axios from "axios/index";
import {connect} from "react-redux";
import * as actions from "../../../actions";


class PurchaseGroupItem extends Component {

    async componentDidMount() {
        const purchaseGroupID = this.props.match.params.item;
        const {data} = await axios.get(`/api/purchaseGroup/getgroup/id/${purchaseGroupID}`);
        this.setState({purchaseGroupData: data})
    }

    notify() {
        const purchaseGroupID = this.props.match.params.item;
        axios.post(`/api/purchaseGroup/viewed/${purchaseGroupID}/`);
    }

    render() {

        this.notify();

        if (!this.state) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            )
        }
        let amount = 0;
        const activeOrDisable = this.state.purchaseGroupData.isActive ? "" : "disabled";

        console.log(this.state.purchaseGroupData);
        return (
            <div>
                {/*<h1>*/}
                    {/*{this.props.match.params.item}*/}
                {/*</h1>*/}


                <div style={{textAlign: 'center'}}>
                    <div className="row" style={{textAlign: 'center', margin: '0'}}>
                        <div className="col s8 m5">
                            <div className="card">
                                <div className="card-image">
                                    <img src={this.state.purchaseGroupData.picture} alt={this.state.purchaseGroupData.picture}/>
                                </div>
                                <div className="card-content">
                                    <h6>Name - <strong>{this.state.purchaseGroupData.name}</strong></h6>
                                    <h6>type - {this.state.purchaseGroupData.type}</h6>
                                    <h6>isActive - {this.state.purchaseGroupData.isActive ? 'true' : 'false'}</h6>
                                    <h6>isDeleted - {this.state.purchaseGroupData.isDeleted ? 'true' : 'false'}</h6>
                                    <h6>isSuggestion - {this.state.purchaseGroupData.isSuggestion ? 'true' : 'false'}</h6>
                                </div>
                                <div className="card-action">
                                    <div className="row">
                                        <label htmlFor="amount">Amount:</label>
                                        <input type="number" onChange={e => amount = e.target.value}/>

                                        <button className={`btn waves-effect waves-light left ${activeOrDisable}`} type="submit"
                                                name="action"
                                                onClick={() => {
                                                    // swal("Nice For You!", `You have purchased ${amount} amount of ${purchaseGroup.name}.`, "success");
                                                    this.props.onAddPurchaseGroup(this.state.purchaseGroupData._id, amount);
                                                }}>Buy
                                        </button>
                                        <button className="btn waves-effect waves-light right red" type="submit" name="action"
                                                onClick={() => {
                                                    this.props.onAddPurchaseGroupToCart(this.state.purchaseGroupData._id, amount)
                                                    // swal("Nice For You!", `Product ${purchaseGroup.name} with ${amount} amount added to cart .`, "success");
                                                }}>Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="row">
                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        originalPrice - {this.state.purchaseGroupData.originalPrice}<br />
                                        priceForGroup - {this.state.purchaseGroupData.priceForGroup}<br />
                                        discount - {this.state.purchaseGroupData.discount}%<br />
                                        <i className="material-icons">shopping_basket</i>
                                    </div>
                                </div>

                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        {/*potentialBuyers - {this.state.purchaseGroupData.potentialBuyers}*/}
                                        <i className="material-icons">perm_identity</i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

};

export default connect(null, actions)(PurchaseGroupItem);
