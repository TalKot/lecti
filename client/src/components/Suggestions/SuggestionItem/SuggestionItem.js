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
                <div className="card-panel #fff9c4 yellow lighten-4 center">
                    <span className="text-darken-2">Warning! This Purchase group is not active until some seller you manage to supply the items.</span>
                </div>


                <h1>
                    {this.props.match.params.id}
                </h1>
            </div>
        )};

};

export default SuggestionPurchaseGroupItem;
