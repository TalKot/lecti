import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from '../../actions';

class Landing extends Component {

    componentDidMount() {
        this.props.fetchCustomPurchaseGroups(this.props.auth);
        // console.log(this.props.customPurchaseGroupsPerUser.data)
    }


    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h1>
                    Greetings!
                    {
                        // this.props.customPurchaseGroupsPerUser
                    }
                </h1>
                <p>
                    Welcome the the best buying appliction in the world!<br/>
                    Use this service to buy smart and cheap as many items as you can.
                </p>
                <br/><br/>
                <h4>
                    Ahoi!
                </h4>
            </div>
        )
    }
};

function mapStateToProps({auth, customPurchaseGroups}) {
    return {
        auth,
        customPurchaseGroupsPerUser : customPurchaseGroups
    };
}

export default connect(mapStateToProps, actions)(Landing);