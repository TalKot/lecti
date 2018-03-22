// import {Link} from 'react-router-dom';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import PurchaseGroupSuggestions from './Suggestion/Suggestion';

class Suggestions extends Component {

    componentDidMount() {
        this.props.fetchSuggestionsPurchaseGroups();
    }

    render() {

        if (!this.props.suggestionsPurchaseGroups.length) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        }

        console.log(this.props.suggestionsPurchaseGroups);

        if (!this.props.suggestionsPurchaseGroups.length) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        }

        return (
            <div style={{textAlign: 'center'}}>
                <h1>
                    Purchase Groups type - Suggestions!
                </h1>

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
            </div>
        );
    }
}


function mapStateToProps({suggestionsPurchaseGroups}) {
    return {suggestionsPurchaseGroups};
}

export default connect(mapStateToProps, actions)(Suggestions);

