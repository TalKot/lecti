import React, {Component} from 'react';
import img1 from '../img/col-1-img.png'
import img2 from '../img/col-2-img.png'
import img3 from '../img/col-3-img.png'

class Landing extends Component {

    render() {

        return (
            <div style={{ textAlign: 'center' }}>
            
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


export default Landing;