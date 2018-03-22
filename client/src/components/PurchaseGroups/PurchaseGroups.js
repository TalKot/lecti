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

    async componentDidMount() {
        let page = this.state ? this.state.page : 1;
        await this.props.fetchPurchaseGroups(this.props.match.params.item, page);
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

    getNextPageButton = () => {
        return (
            <button className="col" onClick={() => this.changeToNextPage()}>
                <i className="material-icons">navigate_next</i>
            </button>
        );
    }

    getPreviousPageButton = () => {
        if (Number(this.state.page) === 1) return;
        return (
            <button className="col" onClick={() => this.changeToPreviousPage()}>
                <i className="material-icons">navigate_before</i>
            </button>
        );
    }

    getPagesButtons = () => {
        if (this.state.page * 12 > this.props.pageCount) return;
        return (
            <div className="center row" style={{margin: "30px", display: "inline-block"}}>
                {this.getPreviousPageButton()}
                <div className="col">{this.state.page}</div>
                {this.getNextPageButton()}
            </div>
        );
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

                <h5>{this.props.pageCount} results for Purchase Groups type - {this.props.match.params.item}</h5>

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

                {this.getPagesButtons()}
            </div>
        );
    }

};

function mapStateToProps({purchaseGroups, pageCount}) {
    return {purchaseGroups, pageCount};
}

export default connect(mapStateToProps, actions)(PurchaseGroups);
