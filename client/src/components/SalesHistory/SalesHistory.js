import {Link} from 'react-router-dom';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import axios from "axios/index";
import Loder from '../Loader/Loader'

class Sales extends Component {


    async componentDidMount() {
        const {data} = await axios.get(`/api/purchaseGroup/getsales/user/`);
        this.setState({purchaseGroups: data})
    };

    CancelPurchaseGroup = async (purchaseGroupID) => {
        await axios.post(`/api/purchaseGroup/removesale/${purchaseGroupID}/`);
        const {data} = await axios.get(`/api/purchaseGroup/getsales/user/`);
        this.setState({purchaseGroups: data});
        this.props.fetchUser();
    };

    isActiveButton = (purchaseGroup, amount, sales) => {
        return (amount === sales) || purchaseGroup.isDeleted || !purchaseGroup.isActive ?
            (<td key={Math.random()} style={{textAlign: 'center'}}>
                <a className="btn-floating disabled"><i className="material-icons">remove_circle_outline</i></a>
            </td>) :
            (<td key={Math.random()} style={{textAlign: 'center'}}>
                <a className="btn-floating #f44336 red pulse" onClick={() => {
                    this.CancelPurchaseGroup(purchaseGroup._id)
                }}><i
                    className="material-icons">remove_circle_outline</i></a>
            </td>)
    };

    render() {
        if (!this.props.auth || !this.state) {
            return (
                <Loder/>
            );
        }
        return (
            <div style={{textAlign: 'center'}}>


                <h1>Sales History</h1>
                <table className="striped highlight centered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Total Amount</th>
                        <th>Sales</th>
                        <th>Original Price</th>
                        <th>Group Price</th>
                        <th>Type</th>
                        <th>Cancel Group</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.purchaseGroups.map(purchaseGroup => {

                            return (
                                <tr key={Math.random()}>
                                    <td key={Math.random()}><Link
                                        to={`/purchasegroup/${purchaseGroup._id}`}>{purchaseGroup._id}</Link></td>
                                    <td key={Math.random()}><Link
                                        to={`/purchasegroup/${purchaseGroup._id}`}>{purchaseGroup.name}</Link></td>
                                    <td key={Math.random()}>{purchaseGroup.totalAmount}</td>
                                    <td key={Math.random()}>{purchaseGroup.sales}</td>
                                    <td key={Math.random()}>{purchaseGroup.originalPrice}</td>
                                    <td key={Math.random()}>{purchaseGroup.priceForGroup}</td>
                                    <td key={Math.random()}>{purchaseGroup.type}</td>
                                    {this.isActiveButton(purchaseGroup, purchaseGroup.totalAmount, purchaseGroup.sales)}
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

export default connect(mapStateToProps, actions)(Sales);

