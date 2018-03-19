import React from 'react';
import {Link} from 'react-router-dom';

export default () => {

    return(
        <footer className="page-footer">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h5 className="white-text">Lecti</h5>
                        <p className="grey-text text-lighten-4">The Best Purchase Group Buying Platform In The World.</p>
                    </div>
                    <div className="col l4 offset-l2 s12">
                        <h5 className="white-text">Links</h5>
                        <ul>
                            <li><Link to={'/profile'} className="text-lighten-3 white-text">Profile</Link></li>
                            <li><Link to={'/sales'} className="text-lighten-3 white-text">Sales</Link></li>
                            <li><Link to={'/cart'} className="text-lighten-3 white-text">Cart</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container">
                    © 2018 Copyright Text
                </div>
            </div>
        </footer>

    );
};
