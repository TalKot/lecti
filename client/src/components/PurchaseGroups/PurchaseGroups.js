import React, {Component} from 'react';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import PurchaseGroup from './PurchaseGroup/PurchaseGroup'
import {Link} from 'react-router-dom';
import Loader from '../Loader/Loader';
import {Card, Message, Pagination, Grid } from 'semantic-ui-react'
import {withRouter} from 'react-router-dom';


class PurchaseGroups extends Component {

    state = {page: 1};

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.item !== this.props.match.params.item) {
            nextProps.fetchPurchaseGroups(nextProps.match.params.item);
        }
    }

    async componentDidMount() {
        let page = this.state ? this.state.page : 1;
        await this.props.fetchPurchaseGroups(this.props.match.params.item, page);
    }

    handlePaginationChange = (e, {activePage}) => {
        this.setState({activePage});
        this.props.fetchPurchaseGroups(this.props.match.params.item, activePage);
    }

    getWelcomeMessage = () => {

        if (this.props.match.params.item !== 'others') {
            return (
                <Message
                    info
                    header='Was this what you wanted?'
                    content={`${this.props.pageCount} results for Purchase Groups type - ${this.props.match.params.item[0].toUpperCase() + this.props.match.params.item.substring(1)}`}
                />
            )
        } else {
            return (
                <Message
                    info
                    header='Was this what you wanted?'
                    content={`Results for Purchase Groups type - ${this.props.match.params.item[0].toUpperCase() + this.props.match.params.item.substring(1)}`}
                />
            )
        }

    }

    render() {

        if (!this.props.purchaseGroups.length) {
            return (
                <Loader/>
            );
        }

        return (
            <div style={{textAlign: 'center'}}>

                {this.getWelcomeMessage()}

                <Grid>
                    <Card.Group>
                        {
                            this.props.purchaseGroups.map(purchaseGroup => {
                                return <PurchaseGroup key={Math.random()} purchaseGroup={purchaseGroup}/>
                            })
                        }
                    </Card.Group>
                </Grid>
                <div className="fixed-action-btn">
                    <Link to="/new/purchasegroup" className="btn-floating btn-large red">
                        <i className="material-icons">add</i>
                    </Link>
                </div>

                <Pagination
                    defaultActivePage={1}
                    totalPages={Math.ceil(this.props.pageCount / 12)}
                    onPageChange={this.handlePaginationChange}
                    style={{marginTop: '25px', marginRight: '135px'}}
                />
            </div>
        );
    }

};

function mapStateToProps({purchaseGroups, pageCount, searchValue, history, purchasGroupsBySearch}) {
    return {purchaseGroups, pageCount, searchValue, history, purchasGroupsBySearch};
}

export default connect(mapStateToProps, actions)(withRouter(PurchaseGroups));
