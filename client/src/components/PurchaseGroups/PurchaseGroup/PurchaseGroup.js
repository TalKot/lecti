import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react'
import src from '../../img/hero-bg.png';


const PurchaseGroup = ({ purchaseGroup }) => {
    return (
        <Card >
            <Link to={`/purchasegroup/${purchaseGroup._id}`}>
                <Image src={purchaseGroup.picture} style={{maxHeight: '290px', maxWidth: '290px', margin : 'auto'}}/>
            </Link>
            <Card.Content>
                <Card.Header>{purchaseGroup.name}</Card.Header>
                <Card.Meta>Discount - {purchaseGroup.discount}%</Card.Meta>
                <Card.Description>
                    Original vs. Group Price: {purchaseGroup.originalPrice} / {purchaseGroup.priceForGroup} <br />
                    Total Amount vs. Sales: {purchaseGroup.totalAmount} / {purchaseGroup.sales}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <a>
                    <Icon name='user' />
                    {purchaseGroup.sales} Buyers
                 </a>
            </Card.Content>
        </Card>

    );
    // return (
    //     <div className="col s6 m4">
    //         <div className="card z-depth-3">
    //             <div className="card-image small" style={{height: "200px", width: "300px", textAlign: 'center'}}>
    //                 <Link to={`/purchasegroup/${purchaseGroup._id}`}>
    //                     <img src={purchaseGroup.picture} alt={purchaseGroup.picture}
    //                          style={{height: "200px", width: "300px", textAlign: 'center'}}
    //                     />
    //                 </Link>
    //             </div>
    //             <div className="card-content">
    //                 <b>{purchaseGroup.name}</b>,<br/>
    //                 <div className="row">
    //                     <div className="col left">
    //                         Original Price: {purchaseGroup.originalPrice}<br/>
    //                         Group Price: {purchaseGroup.priceForGroup}
    //                     </div>
    //                     <div className="col right">
    //                         Total Amount: {purchaseGroup.totalAmount}<br/>
    //                         Total Sales: {purchaseGroup.sales}
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );

};

export default PurchaseGroup;
