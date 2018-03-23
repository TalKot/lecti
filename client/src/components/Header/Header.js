import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Payments from '../Payments/Payments';
import SearchBar from '../SearchBar/SearchBar';
import Types from '../../utils/types';

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
                let headers = [
                    <li key="2" style={{margin: '0 10px'}}>
                        Credits: {this.props.auth.credits}
                    </li>,
                    <li key="7"><Link to={`/profile/${this.props.auth._id}`}>Profile</Link></li>,
                    <li key="8"><Link to={'/cart'}><i className="material-icons">shopping_cart</i></Link></li>,
                    <li key="9"><Payments /></li>,
                    <li key="10"><a href="/api/logout">Logout</a></li>,
                ];

                if (this.props.auth.isSeller){
                    headers.splice(2, 0, <li key="6"><Link to={'/sales'}>Sales</Link></li>);
                }

                return headers;
        }
    }

    render() {
        return (
            <nav className="nav-extended #1976d2 blue darken-2">
                <div className="nav-wrapper">
                    <Link to='/home' className="left brand-logo" style={{marginLeft: "7px"}}>Lecti</Link>
                    <ul className="right">
                        {this.renderContent()}
                    </ul>
                </div>
                <div className="nav-content">
                    <ul className="tabs tabs-transparent">
                        <li className="tab"><SearchBar /></li>
                        {
                            Types.map(type=> {
                                return <li className="tab" key={type.value}><Link to={`/purchasegroups/${type.value}`}>{type.name}</Link></li>
                            })
                        }
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