import React from 'react';
import {Link} from 'react-router-dom';

const PurchaseGroupSlim = ({purchaseGroup}) => {

    return (
        <div className="col s6 m4">
            <div className="card">
                <div className="card-image small">
                    <Link to={`/purchasegroup/${purchaseGroup._id}`}><img src={purchaseGroup.picture} alt={purchaseGroup.picture}/></Link>
                </div>
                <div className="card-content">
                    <b>{purchaseGroup.name}</b>,<br/>
                    <div className="row">
                        <div className="col left">
                            Original Price: {purchaseGroup.originalPrice}<br/>
                            Group Price: {purchaseGroup.priceForGroup}
                        </div>
                        <div className="col right">
                            Total Amount: {purchaseGroup.totalAmount}<br/>
                            Total Sales: {purchaseGroup.sales}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseGroupSlim;
