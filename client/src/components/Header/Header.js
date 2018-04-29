import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from '../Payments/Payments';
import SearchBar from '../SearchBar/SearchBar';
import Types from '../../utils/types';
import { categories, subCategories } from '../../utils/types';
import logo from '../img/logo.png';
import { Button, Dropdown, Menu, Segment } from 'semantic-ui-react'


class Header extends Component {
    state = { activeItem: 'home' }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderContent(activeItem) {

        switch (this.props.auth) {
            case null:
                return;
            case false:
                return [
                    <Menu.Item>
                        <Button primary href="/auth/google">Sign Up With Google</Button>
                    </Menu.Item>,
                    <Menu.Item>
                        <Button primary href="/auth/facebook">Sign Up With Facebook</Button>
                    </Menu.Item>
                ];
            default:
                let headers = [
                    <Menu.Item key="2" name='Credits' active={activeItem === 'Credits'} onClick={this.handleItemClick}> Credits: {this.props.auth.credits}</Menu.Item>,
                    <Menu.Item key="3" name='Profile' href={`/profile/${this.props.auth._id}`} active={activeItem === 'Profile'} onClick={this.handleItemClick} />,
                    <Menu.Item key="4" name='Shopping Cart' href={'/cart'} active={activeItem === 'Shopping Cart'} onClick={this.handleItemClick}> <i className="material-icons">shopping_cart</i></Menu.Item>,
                    <Menu.Item key="5" name='Payments' active={activeItem === 'Payments'} onClick={this.handleItemClick}> <Payments /> </Menu.Item>,
                    <Menu.Item key="6" name='Logout' href={'/api/logout'} active={activeItem === 'Logout'} onClick={this.handleItemClick} />
                ];

                if (this.props.auth.isSeller) {
                    headers.splice(2, 0, <Menu.Item key="7" name='Sales' href={'/sales'} active={activeItem === 'Sales'} onClick={this.handleItemClick} />);
                }

                return headers;
        }
    }

    render() {
        const { activeItem } = this.state

        return (
            <div>
                <Menu size='huge'>
                    <Menu.Item>
                        <img src={logo} />
                    </Menu.Item>
                    <Menu.Menu position='right'>

                        {this.renderContent(activeItem)}
                    </Menu.Menu>

                </Menu>

                <Menu pointing secondary>
                    {
                        categories.map(({ name, value }) => {
                            return (
                                <Dropdown item key={value} text={name}>
                                    <Dropdown.Menu>
                                        {
                                            subCategories[value].map(({ name, value }) => {
                                                return <Dropdown.Item key={value}>{value}</Dropdown.Item>
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            );
                        })
                    }

                    <Menu.Menu position='right'>
                        <SearchBar />
                    </Menu.Menu>
                    
                </Menu>

            </div >


            // <nav className="nav-extended #1976d2 blue darken-2">
            //     <div className="nav-wrapper">
            //         <Link to='/home' className="left brand-logo" style={{ marginLeft: "7px" }}><img src={logo} /></Link>
            //         <ul className="right">
            //             {this.renderContent()}
            //         </ul>
            //     </div>
            //     <div className="nav-content">
            //         <ul className="tabs tabs-transparent">
            //             <li className="tab"><SearchBar /></li>
            //             {
            //                 Types.categories.map(type => {
            //                     return <li className="tab" key={type.value}><Link to={`/purchasegroups/${type.value}`}>{type.name}</Link></li>
            //                 })
            //             }
            //             <li className="tab right"><Link to={'/suggestions/'}>Suggestions</Link></li>
            //         </ul>
            //     </div>
            // </nav>

        );
    }
}


function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);