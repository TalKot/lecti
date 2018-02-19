import React from 'react';

const PurchaseGroup = (item) => {
    return (
        <div className="row">

            <div className="col s12 m7" style={{height: '300px', width: '300px'}}>
                <div className="card small">
                    <div className="card-image" style={{height: '150px', width: '250px'}}>
                        <img src={item.picture}/>
                    </div>
                    <div className="card-content">
                        <p>
                            <b>{item.name}</b>,
                            originalPrice: {item.originalPrice},
                            priceForGroup: {item.priceForGroup},
                            totalAmount: {item.totalAmount}
                        </p>
                    </div>
                    <div className="card-action">
                        <button className="btn waves-effect waves-light" type="submit" name="action"
                        onClick={(item)=>{console.log(item)}} >Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );

};

export default PurchaseGroup;