import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from '../Payments/Payments';
import SearchBar from '../SearchBar/SearchBar';
import Types from '../../utils/types';
import { Button, Icon, Dropdown, Menu, Segment, Image, Input } from 'semantic-ui-react'
import logo from '../img/logo.png';
import lecti from '../img/logo.png';

class Header extends Component {

    state = { activeItem: 'home' }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderContent(activeItem) {

        switch (this.props.auth) {
            case null:
                return;
            case false:
                return [
                    <Menu.Item key="1">
                        <Button color='google plus' href="/auth/google">
                            <Icon name='google plus' /> Google Plus
                        </Button>
                    </Menu.Item>,
                    <Menu.Item key="2">
                        <Button color='facebook' href="/auth/facebook">
                            <Icon name='facebook' /> Facebook
                        </Button>
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
            <div style={{ marginBottom: '20px' }}>
                <Menu size='huge'>
                    <Menu.Item key="234532" style={{ backgroundColor: 'black' }}>
                        <Link to={'/home'}>
                            <Image src={lecti} size='tiny' verticalAlign='top' />
                        </Link>
                    </Menu.Item>
                    <Menu.Menu position='right' key="1234125">
                        {this.renderContent(activeItem)}
                    </Menu.Menu>
                </Menu>
                <Menu pointing secondary>
                    {
                        Types.categories.map(({ name, value }) => {
                            if (name === 'search') {
                                return (
                                    <Menu.Item key={value} name={name}><SearchBar /> </Menu.Item>
                                );
                            }
                            else if (value === 'other') {
                                return (
                                    <Menu.Item key={value} name={name}>
                                        <Link style={{ color: 'black' }} to={`/purchasegroups/${value}`}>{name}</Link>
                                    </Menu.Item>
                                );
                            } else {
                                return (
                                    <Dropdown item key={value} text={name}>
                                        <Dropdown.Menu>
                                            {

                                                Types.subCategories[value].map(({ name, value }) => {
                                                    return <Menu.Item key={value} name={name} active={activeItem === { value }} onClick={this.handleItemClick} ><Link to={`/purchasegroups/${value}`}>{name}</Link></Menu.Item>;
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                );
                            }
                        })
                    }
                </Menu>
            </div >
        );
    }
}


function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);