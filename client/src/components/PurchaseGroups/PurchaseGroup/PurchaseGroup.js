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
                    {purchaseGroup.potentialBuyers.length} Buyers
                 </a>
            </Card.Content>
        </Card>

    );
};

export default PurchaseGroup;
