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
import src1 from '../img/group1.png'
import { Segment, Image, Card, Header, Icon, Message } from 'semantic-ui-react'
import Loder from '../Loader/Loader';

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
    getMiddleSection = () => {
        return (
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
        );
    }
    getImageProp = () => {
        return (
            <Segment style={{ backgroundColor: '#fafafa' }}>
                <Image src={src1} size='huge' centered />
                <p>
                    <h3>This is this week's recommened purchase group.</h3>
                    Condition:<br />
                    New without box: A brand-new, unused, and unworn item (including handmade items) that is not in original packaging or may be missing original packaging materials (such as the original box or bag).<br />
                    The original tags may not be attached. For example, new shoes (with absolutely no signs of wear) that are no longer in their original box fall into this category.<br />
                </p>
            </Segment>
        );
    };

    getGreeting = () => {
        return (
            <div style={{ marginLeft: "50px" }}>
                
                <h1>Greetings {this.props.auth.displayName}!</h1>
                <Card.Group>
                    {
                        this.props.customPurchaseGroupsPerUser.purchaseGroups.purchaseGroup.map(purchaseGroup =>
                            <PurchaseGroup key={Math.random()} purchaseGroup={purchaseGroup} />
                        )
                    }
                </Card.Group> <br />
                <div>
                    <Header as='h2' icon textAlign='center'>
                        <Icon name='users' circular />
                        <Header.Content>
                            Custom Purchase Group's Type Algorithem Result - {this.props.customPurchaseGroupsPerUser.type}
                        </Header.Content>
                    </Header>

                    <Message visible>
                        <p>
                            We ran our alogithem and figure out that the most valuble purchase groups types for you are from the type above.<br />
                            If not, you can always mark below the checkbox, and we will provide differnt types for you to see.<br/>
                            <input onChange={event => { this.onChangeRelevant(event.target.checked) }} type="checkbox" id="relevant" />
                            <label htmlFor="relevant">Make this type not relevant for me.</label>
                        </p>
                    </Message>
                </div>
            </div>
        );
    }


    render() {
        if (_.isEmpty(this.props.customPurchaseGroupsPerUser) || !this.props.auth) {
            return (
                <Loder />
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
                <section>
                    {this.getGreeting()} <br />
                </section>
                <section>
                    {this.getMiddleSection()} <br />
                </section>
                <section>
                    {this.getImageProp()} <br />
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