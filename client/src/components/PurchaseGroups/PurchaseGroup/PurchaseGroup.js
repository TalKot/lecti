import React from 'react';

const PurchaseGroup = ({purchaseGroup,onAddPurchaseGroup}) => {
    let amount = 0;

    return (
        <div className="col s12 m3">
            <div className="card small">
                <div className="card-image">
                    <img src={purchaseGroup.picture}/>
                </div>
                <div className="card-content">
                    <p>
                        <b>{purchaseGroup.name}</b>,
                        originalPrice: {purchaseGroup.originalPrice},
                        priceForGroup: {purchaseGroup.priceForGroup},
                        totalAmount: {purchaseGroup.totalAmount}
                    </p>
                </div>
                <div className="card-action">
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" onChange={e => amount = e.target.value}/>
                    <button className="btn waves-effect waves-light" type="submit" name="action"
                            onClick={() => onAddPurchaseGroup(purchaseGroup._id, amount)}>Buy
                    </button>
                </div>
            </div>
        </div>
    );

};

export default PurchaseGroup;

