import React from 'react';
import {Link} from 'react-router-dom';

const Suggestion = ({purchaseGroupSuggestion}) => {

    return (
        <div className="col s6 m4">
            <div className="card">
                <Link to={`/suggestions/${purchaseGroupSuggestion._id}`} className="card">
                    <div className="card-content">
                        <b>{purchaseGroupSuggestion.name}</b>,<br/>
                        <div className="row">
                            <div className="col left">
                                Original Price: {purchaseGroupSuggestion.originalPrice}<br/>
                                Group Price: {purchaseGroupSuggestion.priceForGroup}
                            </div>
                            <div className="col right">
                                Total Amount: {purchaseGroupSuggestion.totalAmount}<br/>
                                Total Sales: {purchaseGroupSuggestion.sales}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Suggestion;
