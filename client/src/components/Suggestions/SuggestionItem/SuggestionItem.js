import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import axios from "axios/index";
import swal from 'sweetalert';
import Loader from '../../Loader/Loader';
import { Button, Icon, Label } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';


class SuggestionPurchaseGroupItem extends Component {

    fetchData = async () =>{
        const ID = this.props.match.params.id;
        const { data } = await axios.get(`/api/purchaseGroup/getsuggestions/${ID}`);
        this.setState({ suggestion: data });
    }

    async componentDidMount() {
        await this.fetchData();
    }

    takeOwnership = async () => {
        const ID = this.state.suggestion._id;
        await axios.post(`/api/purchaseGroup/getsuggestions/${ID}`);
        this.props.history.push(`/purchasegroup/${this.state.suggestion._id}`)
    };

    takeOwnershipIfAdmin = () => {
        if (this.props.auth.isSeller) {

            return (
    
                <Button animated='fade'  primary style={{width:'100%'}} onClick={this.takeOwnership}>
                    <Button.Content visible>
                    Because your user type is "seller", you can take ownership on this purchase group suggestion.
                    </Button.Content>
                    <Button.Content hidden>
                        Click Me!
                    </Button.Content>
                </Button>
            )
        }
    };

    joinGroup = async () => {
        swal("Joined Suggestion!", 'Thank you for joining the group. Because the group is suggestion only, no money was taken from your account.');
        
        const options = {
            groupID: this.state.suggestion._id
        };
        
        await axios.post(`/api/purchaseGroup/join/suggestions/`, options);
        await this.fetchData();
    };

    leaveGroup = async () => {
        swal("Left Suggestion!", 'Because the group is suggestion only, no money was refunded.');

        const options = {
            groupID: this.state.suggestion._id
        };

        await axios.post(`/api/purchaseGroup/leave/suggestions/`, options);
        await this.fetchData();
    };

    render() {
        if (!this.props.auth || !this.state) {
            return (
                <Loader />
            );
        }

        return (
            <div>
                <div className="card-panel #fff9c4 yellow lighten-4 center">
                    <span className="text-darken-2">Warning! This Purchase group is not active until some seller will manage to supply the items.</span>
                </div>
                

                {this.takeOwnershipIfAdmin()}

                <div style={{ textAlign: 'center' }}>
                    <div className="row" style={{ textAlign: 'center', margin: '0' }}>
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
                                        Original Product Price - {this.state.suggestion.originalPrice}<br />
                                        Group Price Per Item - {this.state.suggestion.priceForGroup}<br />
                                        Discount - {this.state.suggestion.discount}%<br />
                                    </div>
                                </div>



                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        <h6>Stock - {this.state.suggestion.totalAmount}</h6>
                                        <h6>Joined - {this.state.suggestion.potentialBuyers.length}</h6>
                                        <div>
                                                <Button as='div' labelPosition='right' onClick={this.joinGroup}>
                                                    
                                                        <Icon name='like outline' />
                                                        Join Suggestion
                                                    
                                                </Button>
                                                <Button as='div' labelPosition='left' onClick={this.leaveGroup}>
                                                        <Icon name='dislike outline' />
                                                        Leave Suggestion
                                                </Button>
                                        </div>
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

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps, actions)(withRouter(SuggestionPurchaseGroupItem));