import React, { Component } from 'react';
import axios from 'axios';
import PurchaseGroup from '../PurchaseGroups/PurchaseGroup/PurchaseGroup'
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { Rating, Message, Button,Form, TextArea } from 'semantic-ui-react'
import Loader from '../Loader/Loader';


class Seller extends Component {

    async componentDidMount() {
        await this.getSellerCommentsFromAPI();
    }

    handleRate = (e, { rating, maxRating }) => {
        this.setState({ rating, maxRating })
    }
    
    getSellerCommentsFromAPI = async () => {
        const sellerID = this.props.match.params.id;
        const { data } = await axios.get(`/api/seller/${sellerID}`);
        this.setState({ seller: data });
    }

    getSellerPurchaseGroups() {
        return (
            <div className="row">
                {
                    this.state.seller.purchaseGroupsSell.map(purchaseGroup => {
                        return <PurchaseGroup key={Math.random()} purchaseGroup={purchaseGroup}
                        />
                    })
                }
            </div>
        );
    }

    getSellerComments() {
        return (
            <div className="row">
                {
                    this.state.seller.comments.map((comment, key) => {
                        if (key > 2) return;
                        return (
                            <div className="col s12 m4 left" key={Math.random()}>
                                <div className="card">
                                    <div className="card-content">
                                        <span className="card-title"><Link
                                            to={`/profile/${comment.user._id}`}>{comment.user.displayName}</Link> comment:</span>
                                        Rating - <b> {comment.rating}</b><br />
                                        <p>{comment.comment}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    changeRating = async value => {
        await this.setState({ rating: value });
    };

    changeRatingText = async comment => {
        await this.setState({ comment: comment });
    };

    sendRating = async () => {
        const options = {
            seller: this.props.match.params.id,
            comment: this.state.comment,
            rating: this.state.rating
        };
        await axios.post('/api/comment/add', options);
        this.getSellerCommentsFromAPI();
        swal("Thank You!", `Your comment has been submitted.`, "success");
    };

    getRatingSummary = () => {

        let results = {
            one: 0,
            two: 0,
            three: 0,
            four: 0,
            five: 0
        };

        this.state.seller.comments.forEach(comment => {
            if (comment.rating === 1) {
                results.one += 1
            } else if (comment.rating === 2) {
                results.two += 1
            } else if (comment.rating === 3) {
                results.three += 1
            }  else if (comment.rating === 4) {
                results.four += 1
            }  else {
                results.five += 1
            }  
        
        });

        return (
            <div>
                <p>
                    <b>{results.one}</b> marked this seller as "one star"<br />
                    <b>{results.two}</b> marked this seller as "two stars"<br />
                    <b>{results.three}</b> marked this seller as "three stars"<br />
                    <b>{results.four}</b> marked this seller as "four stars"<br />
                    <b>{results.five}</b> marked this seller as "five stars"<br />
                </p>
            </div>
        );
    };


    render() {

        if (!this.state) {
            return (
                <Loader />
            );
        }

        return (
            <div style={{ textAlign: 'center' }}>
                <div className="row" style={{ textAlign: 'center', margin: '0' }}>
                    <div className="col s8 m5">
                        <div className="card">
                            <div className="card-image">
                                <img src={this.state.seller.photoURL} alt={this.state.seller.photoURL} />
                                <span className="card-title">{this.state.seller.displayName}</span>
                            </div>
                            <div className="card-content">
                                <h6>Email - {this.state.seller.email}</h6>
                                <h6>Gender - {this.state.seller.gender}</h6>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row">

                            <div className="col s3 m6">
                                <div className="card-panel">
                                    <h4>Rating System</h4>

                                    <Message positive>
                                        <Message.Header>Rate The Seller!</Message.Header>
                                        <p><b>Please</b>, take a minute or two to rate this seller behaviour for other buyers to know.</p>
                                    </Message>
                                    <div>
                                        <Rating maxRating={5} onRate={this.handleRate} defaultRating={3} icon='star' size='massive' />
                                        <br />
                                        <br />
                                    </div>
                                    <div>
                                        
                                        <Form>
                                            <TextArea onChange={async e => {await this.changeRatingText(e.target.value)}}
                                            placeholder='Tell us more' />
                                        </Form> <br/>
                                        <Button positive onClick={this.sendRating}>Rate Seller</Button>
                                    </div>

                                </div>
                            </div>

                            <div className="col s3 m6">
                                <div className="card-panel">
                                    <h4>Rating Summary</h4>
                                    {this.getRatingSummary()}
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                <h5>Total Comments({this.state.seller.comments.length})</h5>
                {this.getSellerComments()}
                <h5>Items for sale({this.state.seller.purchaseGroupsSell.length})</h5>
                {this.getSellerPurchaseGroups()}
            </div>
        );
    }
}

export default Seller;

