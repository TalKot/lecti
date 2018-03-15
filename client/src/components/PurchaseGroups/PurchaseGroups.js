import React, {Component} from 'react';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import PurchaseGroup from './PurchaseGroup/PurchaseGroup'
import {Link} from 'react-router-dom';
class PurchaseGroups extends Component {

    componentDidMount() {
        this.props.fetchPurchaseGroups(this.props.match.params.item);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.item !== this.props.match.params.item) {
            nextProps.fetchPurchaseGroups(nextProps.match.params.item);
        }
    }

    render() {

        if (!this.props.purchaseGroups.length) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        }

        return (
            <div style={{textAlign: 'center'}}>
                <h1>
                    Purchase Groups type - {this.props.match.params.item}
                </h1>

                <div className="row">
                    {
                        this.props.purchaseGroups.map(purchaseGroup => {
                            return <PurchaseGroup key={Math.random()} purchaseGroup={purchaseGroup}
                                                  // onAddPurchaseGroup={this.props.onAddPurchaseGroup}
                                                  // onAddPurchaseGroupToCart={this.props.onAddPurchaseGroupToCart}
                            />
                        })
                    }
                </div>

                <div className="fixed-action-btn">
                    <Link to="/new/purchasegroup" className="btn-floating btn-large red">
                        <i className="material-icons">add</i>
                    </Link>
                </div>

            </div>
        );
    }

};

function mapStateToProps({purchaseGroups}) {
    return {purchaseGroups};
}

export default connect(mapStateToProps, actions)(PurchaseGroups);
