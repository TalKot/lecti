import React, {Component} from 'react';
import axios from "axios/index";


class PurchaseGroupItem extends Component {

    componentDidMount() {
        // const purchaseGroupID  = this.props.match.params.item;
        // axios.post(`/api/purchaseGroup/viewed/${purchaseGroupID}/`);
    }

    notify(){
        const purchaseGroupID  = this.props.match.params.item;
        axios.post(`/api/purchaseGroup/viewed/${purchaseGroupID}/`);
    }

    render() {
        this.notify();
        return (
        <div>
            <h1>
                {this.props.match.params.item}
            </h1>
        </div>
    )};

};

export default PurchaseGroupItem;
