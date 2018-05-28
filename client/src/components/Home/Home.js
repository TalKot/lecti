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
import src1 from '../img/hero-bg.png'
import src2 from '../img/group1.png'
import { Segment, Image, Card, Header, Icon, Message, Input, Form, TextArea, Button } from 'semantic-ui-react'
import Loder from '../Loader/Loader';
import swal from 'sweetalert';

class Home extends Component {
    state = {formStatus: false};

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

    getExperience = () => {
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
                        <h4>Easy To Work Platform</h4>
                        <p>We have provided simple and easy to use platform that all our foucs was to bring our best for you to use.</p>
                    </div>
                </div>
            </div>
        );
    }

    getImageProp = () => {
        return (
            <Segment style={{ backgroundColor: '#fafafa' }}>
                <Image src={src2} size='huge' centered />
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
                            Custom Purchase Group's Type Algorithem Result - {this.props.customPurchaseGroupsPerUser.type[0].toUpperCase() + this.props.customPurchaseGroupsPerUser.type.substring(1)}
                        </Header.Content>
                    </Header>

                    <Message visible>
                        <p>
                            We ran our alogithem and figure out that the most valuble purchase groups types for you are from the type above.<br />
                            If not, you can always mark below the checkbox, and we will provide differnt types for you to see.<br />
                            <input onChange={event => { this.onChangeRelevant(event.target.checked) }} type="checkbox" id="relevant" />
                            <label htmlFor="relevant">Make this type not relevant for me.</label>
                        </p>
                    </Message>
                </div>
            </div>
        );
    }

    handleChange = (e, { value }) => this.setState({ value });

    //will send the form data by email
    submitFormResults =async  () => {
        this.setState({formStatus:true});
        await axios.post('/api/newseller/', this.state);
        swal("Thank You!", `You will become a seller soon. Exicted?`, "success");
    }

    getContactSection = () => {
        const options = [
            { key: 'm', text: 'Male', value: 'male' },
            { key: 'f', text: 'Female', value: 'female' },
        ]

        const { value,formStatus } = this.state;

        return (
            <div>
                <Message
                info
                header='Want To Become A Seller?'
                content="All you have to do is fill the form below to contact Lecti's admin team.
                        One of the admins will contact you back to start the proccess of becoming a seller.
                        So, quickly! what are you waiting for?"
                />
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Select fluid label='Gender' onChange={this.handleChange} options={options} placeholder='Gender' />
                        <Form.Field size='small' control={TextArea} onChange={e=>this.setState({ firstName: e.target.value })} label='First name' placeholder='First name' />
                        <Form.Field size='small' control={TextArea} onChange={e=>this.setState({ lastName: e.target.value })} label='Last name' placeholder='Last name' />
                        <Form.Field size='small' control={TextArea} onChange={e=>this.setState({ email: e.target.value })} label='Email' placeholder='Email' />
                    </Form.Group>
                    <Form.Field  control={TextArea} onChange={e=>this.setState({ message: e.target.value })} label='Message' placeholder='Message' />
                </Form>
                <Button primary style={{marginTop:'20px'}} content='Confirm' label='Send Application' onClick={()=>this.submitFormResults()}/>
                {this.getStatus(formStatus)}
            </div>
        );

    }
    getStatus = (formStatus) =>{
        if (formStatus){
            return (
                
                <Message
                success
                header='Form Completed'
                content="You're all signed up for the newsletter"
                />
            );
        }
        
    }
    getIntro = () => {
        return (
            <div className="mySlides w3-display-container w3-center">
                <img src={src1} style={{ width: "100%" }} />
                <div className="w3-display-bottommiddle w3-container w3-text-white w3-padding-32 w3-hide-small">
                    <h1>Greetings {this.props.auth.displayName}!</h1>
                    <p><b>Lecti  - The best purchase group payments platform in the world!</b></p>
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
                    {this.getIntro()}
                </section>
                <section>
                    {this.getGreeting()} <hr /><br />
                </section>
                <section>
                    {this.getExperience()} <hr /><br />
                </section>
                <section>
                    {this.getContactSection()} <hr /><br />
                </section>
                <section>
                    {this.getImageProp()} <hr /><br />
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