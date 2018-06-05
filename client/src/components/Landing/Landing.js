import React, {Component} from 'react';
import img1 from '../img/col-1-img.png'
import img2 from '../img/col-2-img.png'
import img3 from '../img/col-3-img.png'
import Carousel from "../Home/Carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

class Landing extends Component {

    getCustomAvatar = () => {
        return (
            <div>
            </div>
        );
    };
    getUserExperience = () => {
        return (
            <div className="row">
                <div className="col s4">
                    <div className="center promo promo-example">
                        <img src={img3}/>
                        <h4>Speeds up development</h4>
                        <p>We did most of the heavy lifting for you to provide a default stylings that incorporate our
                            custom components.</p>
                    </div>
                </div>

                <div className="col s4">
                    <div className="center promo promo-example">
                        <img src={img2}/>
                        <h4>User Experience Focused</h4>
                        <p>By utilizing elements and principles of Material Design, we were able to create a framework
                            that focuses on User Experience.</p>
                    </div>
                </div>
                <div className="col s4">
                    <div className="center promo promo-example">
                        <img src={img1}/>
                        <h4>Easy To Work Platform</h4>
                        <p>We have provided simple and easy to use platform that all our foucs was to bring our best for
                            you to use.</p>
                    </div>
                </div>
            </div>
        );
    };

    // getCarouselImages = () => {
    //     return (
    //         <div>
    //             <Carousel style={{width:'100%', height:'300px'}}/>
    //         </div>
    //     );
    // };

    render() {

        return (
            <div className='HomeDiv' style={{textAlign: 'center'}}>
                {/*<section>*/}
                    {/*{this.getCustomAvatar()}*/}
                    {/*<hr/><br/>*/}
                {/*</section>*/}
                <section>
                    {this.getUserExperience()}
                    <hr/>
                    <br/>
                </section>
                <section>
                    {this.getCarouselImages()}
                    <hr/>
                    <br/>
                </section>
            </div>
        )
    }
};


export default Landing;