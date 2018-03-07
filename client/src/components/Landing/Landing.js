import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from '../../actions';
import PurchaseGroupSlim from '../PurchaseGroups/PurchaseGroupSlim/PurchaseGroupSlim'
import axios from "axios/index";

class Landing extends Component {

    componentDidMount() {
        this.props.fetchCustomPurchaseGroups(this.props.auth);
    }


    render() {

        console.log(this.props.customPurchaseGroupsPerUser);


        const onChangeRelevant = async status => {
            // if(status) {
            //     console.log (`${this.props.customPurchaseGroupsPerUser[0].type} switch on`);

                const options = {
                    type : this.props.customPurchaseGroupsPerUser[0].type,
                    status
                };


                // const {data} = await axios.get(`/api/purchaseGroup/getgroup/user/`);
            // }else{
            //     console.log (`${this.props.customPurchaseGroupsPerUser[0].type} switch off`);
            // }
            await axios.post(`/api/purchaseGroup/types/`,options);

        };


        if (!this.props.customPurchaseGroupsPerUser.length) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );

        }

        return (
            <div style={{textAlign: 'center'}}>
                <h1>
                    Greetings {this.props.auth.displayName}!
                </h1>
                <div className="row">

                    {
                        this.props.customPurchaseGroupsPerUser.map(purchaseGroup => {

                            return <PurchaseGroupSlim key={Math.random()} purchaseGroup={purchaseGroup}
                            />

                        })
                    }
                </div>

                <div>
                    <p>
                        <input onChange={(event)=> {
                            onChangeRelevant(event.target.checked)
                        }}
                               type="checkbox" id="relevant"/>
                        <label htmlFor="relevant">Type - {this.props.customPurchaseGroupsPerUser[0].type} is not
                            relevant for me.</label>
                    </p>
                </div>

                <p>
                    Welcome the the best buying application in the world!<br/>
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
        customPurchaseGroupsPerUser: customPurchaseGroups
    };
}

export default connect(mapStateToProps, actions)(Landing);