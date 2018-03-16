import React, {Component} from 'react';
import * as _ from 'lodash';
// import axios from "axios/index";
import {connect} from "react-redux";
import * as actions from "../../actions";

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {term: ''};
    }

    render() {
        return (
            <div className="search-bar">
                {/*<i className="material-icons">search</i>*/}
                <input
                    value={this.state.term}
                    onChange={event => this.onInputChange(event.target.value)}/>
            </div>
        );
    };

    onInputChange = async term => {
        await this.setState({term});
        const search = this.state.term;

        //TODO : WHAT TO BRING BACK WHEN SEARCH IS EMPTY?
        (_.debounce(() => {
            search ? this.props.fetchPurchaseGroupsBySearch(search) : this.props.fetchPurchaseGroups(search);
        }, 700))()
    };
};

export default connect(null, actions)(SearchBar);
