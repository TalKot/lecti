import React, { Component } from 'react';
import * as _ from 'lodash';
// import axios from "axios/index";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { Input, Menu } from 'semantic-ui-react';

class SearchBar extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = { term: '' };
    // }
    state = { term: '' };
    render() {
        return (
            <Input loading icon='user' iconPosition='left' placeholder='Search...' />

            // <input icon='search'
            //     value={this.state.term}
            //     onChange={event => this.onInputChange(event.target.value)}
            //     placeholder="Search..."
            // />
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
