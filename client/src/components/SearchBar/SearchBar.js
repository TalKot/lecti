import React, {Component} from 'react';
// import * as _ from 'lodash';
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

    // onInputChange = _.debounce((term) =>{
    //     this.setState({term});
    //     this.props.onSearchTermChange(term);
    // },300);

    onInputChange =async term => {
        await this.setState({term});
        const search = this.state.term;
        if(search){
            this.props.fetchPurchaseGroupsBySearch(search);
        }else {
            this.props.fetchPurchaseGroups(search);
        }

        // const {data} = await axios.get(`/api/purchaseGroup/search/${search}/`);
        // console.log(data);
        // this.props.onSearchTermChange(term);
    };
};

export default connect(null, actions)(SearchBar);
