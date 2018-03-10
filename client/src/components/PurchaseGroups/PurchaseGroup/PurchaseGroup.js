import React from 'react';
// import swal from 'sweetalert';
import {Link} from 'react-router-dom';
// import axios from "axios/index";

const PurchaseGroup = ({purchaseGroup, onAddPurchaseGroup, onAddPurchaseGroupToCart}) => {
    // let amount = 0;
    // const activeOrDisable = purchaseGroup.isActive ? "" : "disabled";

    return (
        <div className="col s6 m4">
            <div className="card">
                <div className="card-image small">
                    <Link to={`/purchasegroup/${purchaseGroup._id}`}><img src={purchaseGroup.picture}/></Link>
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
                {/*<div className="card-action">*/}
                    {/*<div className="row">*/}
                        {/*<label htmlFor="amount">Amount:</label>*/}
                        {/*<input type="number" onChange={e => amount = e.target.value}/>*/}

                        {/*<button className={`btn waves-effect waves-light left ${activeOrDisable}`} type="submit"*/}
                                {/*name="action"*/}
                                {/*onClick={() => {*/}
                                    {/*swal("Nice For You!", `You have purchased ${amount} amount of ${purchaseGroup.name}.`, "success");*/}
                                    {/*onAddPurchaseGroup(purchaseGroup._id, amount);*/}
                                {/*}}>Buy*/}
                        {/*</button>*/}
                        {/*<button className="btn waves-effect waves-light right red" type="submit" name="action"*/}
                                {/*onClick={() => {*/}
                                    {/*onAddPurchaseGroupToCart(purchaseGroup._id, amount)*/}
                                    {/*// swal("Nice For You!", `Product ${purchaseGroup.name} with ${amount} amount added to cart .`, "success");*/}
                                {/*}}>Cart*/}
                        {/*</button>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default PurchaseGroup;
