import React, {Component} from 'react';


class PurchaseGroupItem extends Component {

    componentDidMount() {
        // this.props.fetchPurchaseGroups(this.props.match.params.item);
    }

    render() {
        return (
        <div>
            <h1>
                {this.props.match.params.item}
            </h1>
        </div>
    )};

};

export default PurchaseGroupItem;
