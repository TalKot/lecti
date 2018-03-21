import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from '../../actions';
import PurchaseGroup from '../PurchaseGroups/PurchaseGroup/PurchaseGroup';
import axios from "axios/index";

class Home extends Component {

    componentDidMount() {
        this.props.fetchCustomPurchaseGroups();

    }


    render() {

        // console.log(this.props.customPurchaseGroupsPerUser);


        const onChangeRelevant = async status => {
            const options = {
                type: this.props.customPurchaseGroupsPerUser[0].type,
                status
            };
            await axios.post(`/api/purchaseGroup/types/`, options);
        };


        if (!this.props.customPurchaseGroupsPerUser.length) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );

        }

        //self invoke function to increase attempts
        (() => {

            const options = {
                type: this.props.customPurchaseGroupsPerUser[0].type,
            };

            axios.post('/api/purchaseGroup/types/increase', options);
        })();


        return (
            <div style={{textAlign: 'center'}}>
                <h1>
                    Greetings {this.props.auth.displayName}!
                </h1>
                <div className="row">

                    {
                        this.props.customPurchaseGroupsPerUser.map(purchaseGroup => {

                            return <PurchaseGroup key={Math.random()} purchaseGroup={purchaseGroup}
                            />

                        })
                    }
                </div>

                <div>
                    <p>
                        <input onChange={(event) => {
                            onChangeRelevant(event.target.checked)
                        }}
                               type="checkbox" id="relevant"/>
                        <label htmlFor="relevant">Type - {this.props.customPurchaseGroupsPerUser[0].type} is not
                            relevant for me.</label>
                    </p>
                </div>
            </div>
        )
    }
};

function mapStateToProps({auth, customPurchaseGroups}) {
    return {
        auth,
        customPurchaseGroupsPerUser: customPurchaseGroups
    };
}

export default connect(mapStateToProps, actions)(Home);