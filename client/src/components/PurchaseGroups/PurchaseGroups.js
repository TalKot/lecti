import React, {Component} from 'react';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import PurchaseGroup from './PurchaseGroup/PurchaseGroup'

class PurchaseGroups extends Component {

    componentDidMount() {
        this.props.fetchPurchaseGroups(this.props.match.params.item);
    }

    render() {
        // console.log(this.props.purchaseGroups);


        if (!this.props.purchaseGroups.length) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        }
        else {

            return (
                <div style={{textAlign: 'center'}}>
                    <h1>
                        Purchase Groups type - {this.props.match.params.item}
                    </h1>

                    <div className="row">
                        {
                            this.props.purchaseGroups.map(purchaseGroup => {
                                return <PurchaseGroup key={Math.random()} {...purchaseGroup}/>
                            })
                        }
                    </div>
                </div>
            );
        }
    }
};

function mapStateToProps({purchaseGroups}) {
    return {purchaseGroups};
}

export default connect(mapStateToProps, actions)(PurchaseGroups);
