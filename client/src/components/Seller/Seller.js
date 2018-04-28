import React, {Component} from 'react';
import axios from 'axios';
import PurchaseGroup from '../PurchaseGroups/PurchaseGroup/PurchaseGroup'
import swal from 'sweetalert';
import {Link} from 'react-router-dom';

class Seller extends Component {

    async componentDidMount() {
        await this.getSellerCommentsFromAPI();
    }

    getSellerCommentsFromAPI = async ()=>{
        const sellerID = this.props.match.params.id;
        const {data} = await axios.get(`/api/seller/${sellerID}`);
        this.setState({seller: data});
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
                                        Rating - <b> {comment.rating}</b><br/>
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

    changeRating = async (value) => {
        await this.setState({rating: value});
    };

    changeRatingText = async (comment) => {
        await this.setState({comment: comment});
    };

    sendRating = async () => {
        let options = {
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
            good: 0,
            normal: 0,
            bad: 0
        };

        this.state.seller.comments.forEach(comment => {
            if (comment.rating === 1) {
                results.bad = results.bad + 1
            } else if (comment.rating === 3) {
                results.normal = results.normal + 1
            } else {
                results.good = results.good + 1
            }
        });

        return (
            <div>
                <p>
                    <b>{results.bad}</b> marked this seller as "bad"<br/>
                    <b>{results.normal}</b> marked this seller as "medium"<br/>
                    <b>{results.good}</b> marked this seller as "good"<br/>
                </p>
            </div>
        );
    };


    render() {

        if (!this.state) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        }
        // console.log(this.state.seller);

        return (
            <div style={{textAlign: 'center'}}>
                <div className="row" style={{textAlign: 'center', margin: '0'}}>
                    <div className="col s8 m5">
                        <div className="card">
                            <div className="card-image">
                                <img src={this.state.seller.photoURL} alt={this.state.seller.photoURL}/>
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

                                    <i className='material-icons medium' id="happy" style={{margin: "10px", cursor: 'pointer'}}
                                       onClick={async () => {
                                           document.getElementById("happy").style.color = "blue";
                                           document.getElementById("medium").style.color = "black";
                                           document.getElementById("sad").style.color = "black";

                                           await this.changeRating(5)
                                       }}
                                    >sentiment_very_satisfied</i>

                                    <i className="material-icons medium"  id="medium" style={{margin: "10px", cursor: 'pointer'}}
                                       onClick={async () => {
                                           document.getElementById("medium").style.color = "blue";
                                           document.getElementById("happy").style.color = "black";
                                           document.getElementById("sad").style.color = "black";
                                           await this.changeRating(3)
                                       }}
                                    >sentiment_neutral</i>

                                    <i className="material-icons medium" id="sad" style={{margin: "10px", cursor: 'pointer'}}
                                       onClick={async () => {
                                           document.getElementById("sad").style.color = "blue";
                                           document.getElementById("medium").style.color = "black";
                                           document.getElementById("happy").style.color = "black";
                                           await this.changeRating(1);
                                       }}
                                    >sentiment_very_dissatisfied</i>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input id="comment"
                                                   type="text"
                                                   placeholder="Comment.."
                                                   onChange={
                                                       async (e) => {
                                                           await this.changeRatingText(e.target.value);
                                                       }
                                                   }
                                            />
                                            <button className="btn waves-effect waves-light"
                                                    onClick={this.sendRating}>Submit
                                                <i className="material-icons right">send</i>
                                            </button>
                                        </div>
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

