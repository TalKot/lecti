// import {Link} from 'react-router-dom';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import PurchaseGroupSuggestions from './Suggestion/Suggestion';
import Loader from '../Loader/Loader';
import { Message, Pagination,Button, Icon,Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

class Suggestions extends Component {

    componentDidMount() {
        this.props.fetchSuggestionsPurchaseGroups();
    }

    render() {

        if (!this.props.suggestionsPurchaseGroups.length) {
            return (
                <Loader />
            );
        }

        return (
            <div style={{textAlign: 'center'}}>
                <Message
                    info
                    header='Was this what you wanted?'
                    content={`${this.props.suggestionsPurchaseGroups.length} results for Purchase Groups type - Suggestions`}
                />


                <div className="row">
                    {
                        this.props.suggestionsPurchaseGroups.map(purchaseGroupSuggestions => {

                            return <PurchaseGroupSuggestions
                                key={Math.random()}
                                purchaseGroupSuggestion={purchaseGroupSuggestions}
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
}


function mapStateToProps({suggestionsPurchaseGroups}) {
    return {suggestionsPurchaseGroups};
}

export default connect(mapStateToProps, actions)(Suggestions);

