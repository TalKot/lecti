import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions';
import PurchaseGroup from '../PurchaseGroups/PurchaseGroup/PurchaseGroup';
import axios from "axios/index";
import { Slide } from 'react-slideshow-image';
import * as _ from 'lodash';
import img1 from '../img/col-1-img.png'
import img2 from '../img/col-2-img.png'
import img3 from '../img/col-3-img.png'

class Home extends Component {

    componentDidMount() {
        this.props.fetchCustomPurchaseGroups();
    }

    onChangeRelevant = async status => {
        const options = {
            type: this.props.customPurchaseGroupsPerUser.type,
            status
        };
        await axios.post(`/api/purchaseGroup/types/`, options);
    };

    getGreeting = () => {
        return (
            <section>
                <h1>
                    Greetings {this.props.auth.displayName}!
            </h1>
                <div className="row">
                    {
                        this.props.customPurchaseGroupsPerUser.purchaseGroups.purchaseGroup.map(purchaseGroup =>
                            <PurchaseGroup key={Math.random()} purchaseGroup={purchaseGroup} />
                        )
                    }
                </div>

                <div>
                    <p>
                        <input onChange={event => { this.onChangeRelevant(event.target.checked) }} type="checkbox" id="relevant" />
                        <label htmlFor="relevant">Type - {this.props.customPurchaseGroupsPerUser.type} is notrelevant for me.</label>
                    </p>
                </div>
            </section>
        );
    }
    render() {
        if (_.isEmpty(this.props.customPurchaseGroupsPerUser) || !this.props.auth) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );

        }

        //self invoke function to increase attempts
        (() => {
            const options = {
                type: this.props.customPurchaseGroupsPerUser.type,
            };
            axios.post('/api/purchaseGroup/types/increase', options);
        })();

        return (
            <div style={{ textAlign: 'center' }}>
                {this.getGreeting()}
                <section>
                    <div className="row">
                        <div className="col s4">
                            <div className="center promo promo-example">
                                <img src={img3} />
                                <h4>Speeds up development</h4>
                                <p>We did most of the heavy lifting for you to provide a default stylings that incorporate our custom components.</p>
                            </div>
                        </div>

                        <div className="col s4">
                            <div className="center promo promo-example">
                                <img src={img2} />
                                <h4>User Experience Focused</h4>
                                <p>By utilizing elements and principles of Material Design, we were able to create a framework that focuses on User Experience.</p>
                            </div>
                        </div>


                        <div className="col s4">
                            <div className="center promo promo-example">
                                <img src={img1} />
                                <h4>Easy To Work with The Platform</h4>
                                <p>We have provided detailed documentation as well as specific code examples to help new users get started.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        )
    }
};

function mapStateToProps({ auth, customPurchaseGroups }) {
    return {
        auth,
        customPurchaseGroupsPerUser: customPurchaseGroups
    };
}

export default connect(mapStateToProps, actions)(Home);