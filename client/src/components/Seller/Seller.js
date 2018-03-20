import React, {Component} from 'react';
import axios from 'axios';
import PurchaseGroup from '../PurchaseGroups/PurchaseGroup/PurchaseGroup'
class Seller extends Component {

    async componentDidMount() {
        const sellerID = this.props.match.params.id;
        const {data} = await axios.get(`/api/seller/${sellerID}`);
        this.setState({seller: data});
    }

    getSellerPurchaseGroups() {
        return (
        <div className="row">
            {
                this.state.seller.purchaseGroupsSell.map(purchaseGroup => {
                    return <PurchaseGroup key={Math.random()} purchaseGroup={purchaseGroup}
                    />
                })
            }
        </div>
        );
    }

    render() {

        if (!this.state) {
            return (
                <h1>Loading...</h1>
            )
        }

        return (
                <div style={{textAlign: 'center'}}>
                    <div className="row" style={{textAlign: 'center', margin: '0'}}>
                        <div className="col s8 m5">
                            <div className="card">
                                <div className="card-image">
                                    <img src={this.state.seller.photoURL} alt={this.state.seller.photoURL}/>
                                    <span className="card-title">{this.state.seller.displayName}</span>
                                </div>
                                <div className="card-content">
                                    <h6>Email - {this.state.seller.email}</h6>
                                    <h6>Gender - {this.state.seller.gender}</h6>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="row">

                                <div className="col s3 m6">
                                    <div className="card-panel">
                                        Auth ID - {this.state.seller.AuthId}
                                        <i className="material-icons">perm_identity</i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <h4>Items for sale({this.state.seller.purchaseGroupsSell.length})</h4>
                {this.getSellerPurchaseGroups()}
            </div>
        );
    }
}

export default Seller;

