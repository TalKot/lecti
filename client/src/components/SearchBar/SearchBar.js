import React, { Component } from 'react';
import * as _ from 'lodash';
import { connect } from "react-redux";
import * as actions from "../../actions";
import { Input, Menu } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class SearchBar extends Component {

    state = { term: '' };

    render() {
        return (
            <input
                icon='user'
                value={this.state.term}
                style={{ margin: '0px 0px 0px 0px', border: 'none', height: '18px', width: '100px' }}
                onChange={event => this.onInputChange(event.target.value)}
                placeholder="Search..."
            />
        );
    };

    onInputChange = async term => {
        await this.setState({ term });
        const search = this.state.term;

        //TODO : WHAT TO BRING BACK WHEN SEARCH IS EMPTY?
        (_.debounce(() => {
            this.props.searchActionPreform(search, this.props.history);
            search ? this.props.fetchPurchaseGroupsBySearch(search) : this.props.fetchPurchaseGroups("computers", 1);
        }, 700))()
    };
};

function mapStateToProps({ history }) {
    return { history };
}

export default connect(mapStateToProps, actions)(withRouter(SearchBar));
