import React, {Component} from 'react';
// import axios from "axios/index";


class SuggestionPurchaseGroupItem extends Component {

    // componentDidMount() {
    //     const purchaseGroupID  = this.props.match.params.item;
    //     axios.post(`/api/purchaseGroup/viewed/${purchaseGroupID}/`);
    // }


    render() {
        return (
            <div>
                <h1>
                    {this.props.match.params.id}
                </h1>
            </div>
        )};

};

export default SuggestionPurchaseGroupItem;
