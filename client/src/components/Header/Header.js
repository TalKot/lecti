import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class Header extends Component {

    renderContent() {
        switch (this.props.auth) {
            case null:
                return;
            case false:
                return [
                    <li key="1"><a href="/auth/google">Login With Google</a></li>,
                    <li key="2"><a href="/auth/facebook">Login With facebook</a></li>
                ];
            default:
                return [
                    <li key="5"><Link to={'/surveys'}>Surveys</Link></li>,
                    <li key="6"><Link to={'/history'}>History</Link></li>,
                    <li key="4"><Link to={'/profile'}>Profile</Link></li>,
                    <li key="2"><a href="/api/logout">Logout</a></li>
                ];
        }
    }

    render() {
        // console.log(this.props);
        return (
            <nav className="nav-extended">
                <div className="nav-wrapper">
                    <Link to='/'  className="left brand-logo" style={{marginLeft: "7px"}}>Lecti</Link>
                    <ul className="right">
                        {this.renderContent()}
                    </ul>
                </div>
                {/*<div className="nav-content">*/}
                    {/*<ul className="tabs tabs-transparent">*/}
                        {/*<li className="tab"><Link to={'/salesitems/computers'}>Computers</Link></li>*/}
                        {/*<li className="tab"><Link to={'/salesitems/shoes'}>Shoes</Link></li>*/}
                        {/*<li className="tab"><Link to={'/salesitems/shirts'}>Shirts</Link></li>*/}
                    {/*</ul>*/}
                {/*</div>*/}
            </nav>
        );
    }
}


function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);