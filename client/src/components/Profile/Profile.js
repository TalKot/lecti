import {Link} from 'react-router-dom';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import axios from "axios/index";

class Profile extends Component {

    async componentDidMount() {
        const {data} = await axios.get(`/api/purchaseGroup/getgroup/user/`);
        this.setState({purchaseGroups: data})
    };

    removePurchaseGroup = async (purchaseGroup,amount,price) => {
        console.log(purchaseGroup);
        const options = {
            amount,
            price
        };
        await axios.post(`/api/purchaseGroup/remove/${purchaseGroup.data._id}/`,options);
        const {data} = await axios.get(`/api/purchaseGroup/getgroup/user/`);
        this.setState({purchaseGroups: data})
    };

    isActiveButton = (purchaseGroup, amount,price) => {
        return purchaseGroup.data.isActive ?
            (<td key={Math.random()}>
                <a className="btn-floating" onClick={() => {
                    this.removePurchaseGroup(purchaseGroup,amount,price)
                }}><i
                    className="material-icons">remove_circle_outline</i></a>
            </td>):
            (<td key={Math.random()}>
                <a className="btn-floating disabled"><i className="material-icons">remove_circle_outline</i></a>
            </td>)

    };

    render() {
        if (!this.props.auth || !this.state) {
            return (<h1>Loading...</h1>);
        }
        return (
            <div style={{textAlign: 'center'}}>
                <div className="row" style={{textAlign: 'center', margin: '0'}}>
                    <div className="col s8 m5">
                        <div className="card">
                            <div className="card-image">
                                <img src={this.props.auth.photoURL}/>
                                <span className="card-title">{this.props.auth.displayName}</span>
                            </div>
                            <div className="card-content">
                                <h6>Profile email - {this.props.auth.email}</h6>
                                <h6>Gender - {this.props.auth.gender}</h6>
                                <h6>Credits - {this.props.auth.credits}$</h6>
                            </div>
                            <div className="card-action">
                                <a href={this.props.auth.email}>This is a link</a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col s3 m6">
                                <div className="card-panel">
                                    Total Purchase Groups Bought - {this.state.purchaseGroups.length}
                                    <i className="material-icons">shopping_basket</i>
                                </div>
                            </div>

                            <div className="col s3 m6">
                                <div className="card-panel">
                                    Auth ID - {this.props.auth.AuthId}
                                    <i className="material-icons">perm_identity</i>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>


                <h1>Purchase History</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>name</th>
                        <th>amount</th>
                        <th>time</th>
                        <th>originalPrice</th>
                        <th>priceForGroup</th>
                        <th>type</th>
                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        this.state.purchaseGroups.map(purchaseGroup => {

                            return (
                                <tr key={Math.random()}>
                                    <td key={Math.random()}><Link to={`/purchasegroup/${purchaseGroup._id}`}>{purchaseGroup._id}</Link></td>
                                    <td key={Math.random()}><Link to={`/purchasegroup/${purchaseGroup._id}`}>{purchaseGroup.data.name}</Link></td>
                                    <td key={Math.random()}>{purchaseGroup.amount}</td>
                                    <td key={Math.random()}>{purchaseGroup.time}</td>
                                    <td key={Math.random()}>{purchaseGroup.data.originalPrice}</td>
                                    <td key={Math.random()}>{purchaseGroup.data.priceForGroup}</td>
                                    <td key={Math.random()}>{purchaseGroup.data.type}</td>
                                    {this.isActiveButton(purchaseGroup,purchaseGroup.amount,purchaseGroup.data.priceForGroup)}
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>


        );
    };
}

function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps, actions)(Profile);

