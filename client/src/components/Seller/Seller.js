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
        console.log(this.state.seller);

        return (
            <div>
                <h4>Items for sale({this.state.seller.purchaseGroupsSell.length})</h4>
                {this.getSellerPurchaseGroups()}
            </div>
        );
    }
}

export default Seller;

