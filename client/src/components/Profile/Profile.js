import { Link } from 'react-router-dom';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import axios from "axios/index";
import { Icon, Image, Statistic } from 'semantic-ui-react'
import Loader from '../Loader/Loader'

class Profile extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { data } = await axios.get(`/api/purchaseGroup/getgroup/user/`);
        this.setState({ purchaseGroups: data })
    };

    removePurchaseGroup = async (purchaseGroup, amount, price) => {
        const options = {
            amount,
            price
        };
        await axios.post(`/api/purchaseGroup/remove/${purchaseGroup.data._id}/`, options);
        const { data } = await axios.get(`/api/purchaseGroup/getgroup/user/`);
        this.setState({ purchaseGroups: data });
        this.props.fetchUser();
    };

    isActiveButton = (purchaseGroup, amount, price) => {
        return purchaseGroup.data.isActive ?
            (<td key={Math.random()}>
                <a className="btn-floating #f44336 red pulse" onClick={() => {
                    this.removePurchaseGroup(purchaseGroup, amount, price)
                }}><i
                    className="material-icons">remove_circle_outline</i></a>
            </td>) :
            (<td key={Math.random()}>
                <a className="btn-floating disabled"><i className="material-icons">remove_circle_outline</i></a>
            </td>)

    };

    getPurchaseHistory() {
        if (this.state.purchaseGroups.length) {
            return (
                <table className="striped centered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Time</th>
                            <th>Original Price</th>
                            <th>Group Price</th>
                            <th>Type</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            this.state.purchaseGroups.map(purchaseGroup => {

                                return (
                                    <tr key={Math.random()}>
                                        <td key={Math.random()}><Link
                                            to={`/purchasegroup/${purchaseGroup.data._id}`}>{purchaseGroup.data._id}</Link>
                                        </td>
                                        <td key={Math.random()}><Link
                                            to={`/purchasegroup/${purchaseGroup.data._id}`}>{purchaseGroup.data.name}</Link>
                                        </td>
                                        <td key={Math.random()}>{purchaseGroup.amount}</td>
                                        <td key={Math.random()}>{purchaseGroup.time}</td>
                                        <td key={Math.random()}>{purchaseGroup.data.originalPrice}</td>
                                        <td key={Math.random()}>{purchaseGroup.data.priceForGroup}</td>
                                        <td key={Math.random()}>{purchaseGroup.data.type}</td>
                                        {this.isActiveButton(purchaseGroup, purchaseGroup.amount, purchaseGroup.data.priceForGroup)}
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            );
        } else {
            return (
                <h1>There Is No Purchase History...Yet...</h1>
            );

        }

    }
    getStatics = () => {
        return (
            <Statistic.Group >
                <Statistic>
                    <Statistic.Value>{this.state.purchaseGroups.length}</Statistic.Value>
                    <Statistic.Label>P.G. Bought</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value text>
                        BEST<br />
                        SELLER
              </Statistic.Value>
                    <Statistic.Label>RATING</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value >
                        {this.props.auth.credits}
                        <Icon name='dollar' />
                    </Statistic.Value>
                    <Statistic.Label>CREDITS</Statistic.Label>
                </Statistic>
            </Statistic.Group>
        );
    }
    render() {
        if (!this.props.auth || !this.state) {
            return (
                <Loader />
            );
        }

        return (
            <div style={{ textAlign: 'center' }}>
                <div className="row" style={{ textAlign: 'center', margin: '0' }}>
                    <div className="col s8 m5">
                        <div className="card">
                            <div className="card-image">
                                <img src={this.props.auth.photoURL} alt={this.props.auth.photoURL} />
                                <span className="card-title">{this.props.auth.displayName}</span>
                            </div>
                            <div className="card-content">
                                <h6>Gender - {this.props.auth.gender}</h6>
                                <h6>Credits - {this.props.auth.credits}$</h6>
                            </div>
                            <div className="card-action">
                                <h6>Email - {this.props.auth.email}</h6>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col s3 m6">
                                <div className="card-panel">
                                    <i className="material-icons" style={{ margin: "10px" }}>shopping_basket</i>
                                    Total Purchase Groups Bought - {this.state.purchaseGroups.length}
                                </div>
                            </div>

                            <div className="col s3 m6">
                                <div className="card-panel">
                                    <i className="material-icons prefix" style={{ margin: "10px" }}>account_circle</i>
                                    <span className="title">User Auth ID - </span>
                                    {this.props.auth.AuthId}
                                </div>
                            </div>

                            <div className="col s3 m6">
                                <div className="card-panel">
                                    Purchase Group Sales - {this.props.auth.purchaseGroupsSell.length} groups
                                </div>
                            </div>

                            <div className="col s3 m6">
                                <div className="card-panel">
                                    User Type - {this.props.auth.isSeller ? "Seller" : "Buyer"}
                                </div>
                            </div>


                            <div className="col s3 m6">
                                <div className="card-panel">
                                    {this.getStatics()}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {this.getPurchaseHistory()}
            </div>
        );
    };
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps, actions)(Profile);

