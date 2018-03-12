import React, {Component} from 'react';
import axios from 'axios';

class Seller extends Component {

    async componentDidMount() {
        const sellerID = this.props.match.params.id;
        const {data} = await axios.get(`/api/seller/${sellerID}`);
        this.setState({ seller: data });
    }

    render() {

        if (!this.state) {
            return (
                <h1>Loading...</h1>
            )
        }
        console.log(this.state.seller);

        return (
            <h1>seller!!!</h1>
        );


    }
}

export default Seller;

