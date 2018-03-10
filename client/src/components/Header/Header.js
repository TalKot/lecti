import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Payments from '../Payments/Payments';
import SearchBar from '../SearchBar/SearchBar'
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
                    <li key="2" style={{margin: '0 10px'}}>
                        Credits: {this.props.auth.credits}
                    </li>,
                    <li key="3"><Link to={'/surveys'}>Surveys</Link></li>,
                    <li key="4"><Link to={'/becomeseller'}>Become a seller</Link></li>,
                    <li key="5"><Link to={'/#'}>Add Group</Link></li>,
                    <li key="6"><Link to={'/sales'}>Sales</Link></li>,
                    <li key="7"><Link to={'/profile'}>Profile</Link></li>,
                    <li key="8"><Link to={'/cart'}><i className="material-icons">shopping_cart</i></Link></li>,
                    <li key="9"><Payments /></li>,
                    <li key="10"><a href="/api/logout">Logout</a></li>,
                ];
        }
    }

    render() {
        return (
            <nav className="nav-extended">
                <div className="nav-wrapper">
                    <Link to='/' className="left brand-logo" style={{marginLeft: "7px"}}>Lecti</Link>
                    <ul className="right">
                        {this.renderContent()}
                    </ul>
                </div>
                <div className="nav-content">
                    <ul className="tabs tabs-transparent">
                        <li className="tab"><SearchBar /></li>
                        <li className="tab"><Link to={'/purchasegroups/computers'}>Computers</Link></li>
                        <li className="tab"><Link to={'/purchasegroups/shoes'}>Shoes</Link></li>
                        <li className="tab"><Link to={'/purchasegroups/shirts'}>Shirts</Link></li>
                        <li className="tab right"><Link to={'/suggestions/'}>Suggestions</Link></li>
                    </ul>
                </div>
            </nav>
        );
    }
}


function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(Header);