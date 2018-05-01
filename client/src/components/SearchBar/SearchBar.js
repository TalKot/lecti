import React, { Component } from 'react';
import * as _ from 'lodash';
import { connect } from "react-redux";
import * as actions from "../../actions";
import { Input, Menu } from 'semantic-ui-react';

class SearchBar extends Component {

    
    state = { term: '' };
    
    render() {
        return (
            <input 
                icon='user'
                value={this.state.term}
                style={{margin:'0px 0px 0px 0px', border: 'none', height:'18px'}}
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
            search ? this.props.fetchPurchaseGroupsBySearch(search) : this.props.fetchPurchaseGroups("computers", 1);
        }, 700))()
    };
};

export default connect(null, actions)(SearchBar);
