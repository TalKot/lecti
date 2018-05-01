import React, { Component } from 'react';
import axios from "axios/index";
import { connect } from "react-redux";
import * as actions from "../../../actions";
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { Button, Grid, Image, Label, Segment, Confirm } from 'semantic-ui-react'
import Loder from '../../Loader/Loader';

class PurchaseGroupItem extends Component {

    async componentDidMount() {
        const purchaseGroupID = this.props.match.params.item;
        const { data } = await axios.get(`/api/purchaseGroup/getgroup/id/${purchaseGroupID}`);
        this.setState({ purchaseGroupData: data })
    }

    notify() {
        axios.post(`/api/purchaseGroup/viewed/${this.props.match.params.item}/`);
    }

    buyPurchaseGroup = async (purchaseGroup, amount) => {
        let status = await this.props.onAddPurchaseGroup(purchaseGroup._id, amount);
        if (status.result) {
            swal("Nice For You!", `You have purchased ${amount} amount of ${purchaseGroup.name}.`, "success");
            const purchaseGroupID = this.props.match.params.item;
            const { data } = await axios.get(`/api/purchaseGroup/getgroup/id/${purchaseGroupID}`);
            this.setState({ purchaseGroupData: data })
        } else {
            swal("You can't prefore this action!", `${status.response}.
                You didn't purchase ${amount} amount of ${purchaseGroup.name} `, "warning");
        }
    };

    
    addToCart = async (purchaseGroup, amount) => {
        let status = await this.props.onAddPurchaseGroupToCart(purchaseGroup._id, amount);
        if (status.result) {
            swal("Nice For You!", `You have added to cart ${amount} amount of ${purchaseGroup.name}.`, "success");
        } else {
            swal("You can't prefore this action!", `${status.response}.
                You didn't add to cart ${amount} amount of ${purchaseGroup.name} `, "warning");
        }
    };

    show = () => this.setState({ open: true })
    handleConfirm = () => this.setState({ result: 'confirmed', open: false })
    handleCancel = () => this.setState({ result: 'cancelled', open: false })

    render() {

        if (!this.state) {
            return (
                <Loder />
            )
        }

        this.notify();

        let amount = 0;
        const activeOrDisable = this.state.purchaseGroupData.isActive ? "" : "disabled";

        // console.log(this.state.purchaseGroupData);
        return (
            <div>
                <div style={{ textAlign: 'center' }}>
                    <div className="row" style={{ textAlign: 'center', margin: '0' }}>
                        <div className="col s8 m5">
                            <div className="card">
                                <div className="card-image">
                                    <img src={this.state.purchaseGroupData.picture}
                                        alt={this.state.purchaseGroupData.picture} />
                                </div>
                                <div className="card-content">
                                    <h6>Name - <strong>{this.state.purchaseGroupData.name}</strong></h6>
                                    <h6>Type - {this.state.purchaseGroupData.type}</h6>
                                    <h6>Sub Type - {this.state.purchaseGroupData.subCategory}</h6>
                                    <h6>Active - {this.state.purchaseGroupData.isActive ? 'true' : 'false'}</h6>
                                    <h6>Deleted - {this.state.purchaseGroupData.isDeleted ? 'true' : 'false'}</h6>
                                    <h6>Suggestion
                                        - {this.state.purchaseGroupData.isSuggestion ? 'true' : 'false'}</h6>
                                </div>
                                <div className="card-action">
                                    <div className="row">
                                        <label htmlFor="amount">Amount:</label>
                                        <input type="number" onChange={e => amount = e.target.value} />
                                        <div>
                                            <Button.Group>
                                                <Button className={`${activeOrDisable}`}
                                                    type="submit"
                                                    positive
                                                    name="action"
                                                    onClick={() => {
                                                        this.buyPurchaseGroup(this.state.purchaseGroupData, amount)
                                                    }}>Buy
                                                </Button>
                                                <Button.Or />
                                                <Button type="submit"
                                                    name="action"
                                                    onClick={() => {
                                                        this.addToCart(this.state.purchaseGroupData, amount)
                                                    }}>Cart
                                                </Button>
                                            </Button.Group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="row">
                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        Original Product Price - {this.state.purchaseGroupData.originalPrice}<br />
                                        Group Price Per Item - {this.state.purchaseGroupData.priceForGroup}<br />
                                        Discount - {this.state.purchaseGroupData.discount}%<br />
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
                                                    alt={this.state.purchaseGroupData.seller.photoURL} />
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
                                    <Grid columns={1}>
                                        <Grid.Column>
                                            <Segment raised>
                                                <Label as='a' color='red' ribbon>Description</Label>
                                                <span>Purcahse Group Details</span>

                                                <h6>{this.state.purchaseGroupData.description}</h6>
                                            </Segment>
                                        </Grid.Column>
                                    </Grid>
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
