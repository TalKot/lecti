import React, {Component} from 'react';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import PurchaseGroup from './PurchaseGroup/PurchaseGroup'
import {Link} from 'react-router-dom';

class PurchaseGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {page: 1};

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.item !== this.props.match.params.item) {
            nextProps.fetchPurchaseGroups(nextProps.match.params.item);
        }
    }

    componentDidMount() {
        let page = this.state ? this.state.page : 1;
        this.props.fetchPurchaseGroups(this.props.match.params.item, page);
    }

    changeToNextPage = () => {
        let page = this.state.page + 1;
        this.setState({page: page});
        this.props.fetchPurchaseGroups(this.props.match.params.item, page);
    };

    changeToPreviousPage = () => {
        let page = this.state.page - 1;
        this.setState({page: page});
        this.props.fetchPurchaseGroups(this.props.match.params.item, page);
    };


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
                            return <PurchaseGroup key={Math.random()} purchaseGroup={purchaseGroup}/>
                        })
                    }
                </div>

                <div className="fixed-action-btn">
                    <Link to="/new/purchasegroup" className="btn-floating btn-large red">
                        <i className="material-icons">add</i>
                    </Link>
                </div>

                <div className="row center">
                    <button onClick={() => this.changeToPreviousPage()}
                    >
                        <i className="material-icons">navigate_before</i>
                    </button>

                    {this.state.page}

                    <button onClick={() => this.changeToNextPage()}
                    >
                        <i className="material-icons">navigate_next</i>
                    </button>
                </div>

            </div>
        );
    }

};

function mapStateToProps({purchaseGroups}) {
    return {purchaseGroups};
}

export default connect(mapStateToProps, actions)(PurchaseGroups);
