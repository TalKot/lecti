import React, {Component} from 'react';
import axios from "axios/index";
import {connect} from "react-redux";
import * as actions from "../../../actions";
import {Link} from 'react-router-dom';
import swal from 'sweetalert';

class PurchaseGroupItem extends Component {

    async componentDidMount() {
        const purchaseGroupID = this.props.match.params.item;
        const {data} = await axios.get(`/api/purchaseGroup/getgroup/id/${purchaseGroupID}`);
        this.setState({purchaseGroupData: data})
    }

    notify() {
        axios.post(`/api/purchaseGroup/viewed/${this.props.match.params.item}/`);
    }

    buyPurchaseGroup = async (purchaseGroup, amount) => {
        let status = await this.props.onAddPurchaseGroup(purchaseGroup._id, amount);
        if (status) {
            swal("Nice For You!", `You have purchased ${amount} amount of ${purchaseGroup.name}.`, "success");
        } else {
            swal("ops! something went wrong!", `You didn't purchase ${amount} amount of ${purchaseGroup.name}.`, "warning");
        }

    };
    //TODO - NEED TO COMPLETE THIS CODE
    addToCart = async (purchaseGroup, amount) => {
        let status = await this.props.onAddPurchaseGroupToCart(purchaseGroup._id, amount);
        console.log(status);
        // swal("Nice For You!", `Product ${purchaseGroup.name} with ${amount} amount added to cart .`, "success");

    };

    render() {

        if (!this.state) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            )
        }

        this.notify();

        let amount = 0;
        const activeOrDisable = this.state.purchaseGroupData.isActive ? "" : "disabled";

        // console.log(this.state.purchaseGroupData);
        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    <div className="row" style={{textAlign: 'center', margin: '0'}}>
                        <div className="col s8 m5">
                            <div className="card">
                                <div className="card-image">
                                    <img src={this.state.purchaseGroupData.picture}
                                         alt={this.state.purchaseGroupData.picture}/>
                                </div>
                                <div className="card-content">
                                    <h6>Name - <strong>{this.state.purchaseGroupData.name}</strong></h6>
                                    <h6>Type - {this.state.purchaseGroupData.type}</h6>
                                    <h6>Active - {this.state.purchaseGroupData.isActive ? 'true' : 'false'}</h6>
                                    <h6>Deleted - {this.state.purchaseGroupData.isDeleted ? 'true' : 'false'}</h6>
                                    <h6>Suggestion
                                        - {this.state.purchaseGroupData.isSuggestion ? 'true' : 'false'}</h6>
                                </div>
                                <div className="card-action">
                                    <div className="row">
                                        <label htmlFor="amount">Amount:</label>
                                        <input type="number" onChange={e => amount = e.target.value}/>

                                        <button className={`btn waves-effect waves-light left ${activeOrDisable}`}
                                                type="submit"
                                                name="action"
                                                onClick={() => {
                                                    this.buyPurchaseGroup(this.state.purchaseGroupData, amount)
                                                }}>Buy
                                        </button>
                                        <button className="btn waves-effect waves-light right #7986cb indigo lighten-2" type="submit"
                                                name="action"
                                                onClick={() => {
                                                    this.addToCart(this.state.purchaseGroupData, amount)
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
                                        Original Product Price - {this.state.purchaseGroupData.originalPrice}<br/>
                                        Group Price Per Item - {this.state.purchaseGroupData.priceForGroup}<br/>
                                        Discount - {this.state.purchaseGroupData.discount}%<br/>
                                    </div>
                                </div>

                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        <h6>Stock
                                            - {this.state.purchaseGroupData.sales}/{this.state.purchaseGroupData.totalAmount}</h6>
                                        <i className="material-icons">shopping_basket</i>
                                    </div>
                                </div>


                                <div className="col s3 m6">
                                    <div className="card-panel">

                                        <div className="row">
                                            <div className="col s3">
                                                <h6>Seller Data:</h6>
                                            </div>
                                            <div className="chip col s3">
                                                <img src={this.state.purchaseGroupData.seller.photoURL}
                                                     alt={this.state.purchaseGroupData.seller.photoURL}/>
                                                <Link to={`/seller/${this.state.purchaseGroupData.seller._id}`}>
                                                    {this.state.purchaseGroupData.seller.displayName}
                                                </Link>
                                            </div>
                                            <div className="col s5">
                                                <h6>Email: {this.state.purchaseGroupData.seller.email}</h6>
                                            </div>
                                        </div>

                                    </div>
                                </div>


                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        <h6>Description - {this.state.purchaseGroupData.description}</h6>
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
