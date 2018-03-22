import React from 'react';
import {Link} from 'react-router-dom';

const PurchaseGroup = ({purchaseGroup}) => {

    return (
        <div className="col s6 m4">
            <div className="card z-depth-3">
                <div className="card-image small" style={{height: "200px", width: "300px", textAlign: 'center'}}>
                    <Link to={`/purchasegroup/${purchaseGroup._id}`}>
                        <img src={purchaseGroup.picture} alt={purchaseGroup.picture}
                             style={{height: "200px", width: "300px", textAlign: 'center'}}
                        />
                    </Link>
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

export default PurchaseGroup;
