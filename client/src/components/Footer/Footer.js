import React, {Component} from 'react'
import {Grid, Menu, Segment, Button} from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Footer extends Component {
    state = {activeItem: 'Home'}

    handleItemClick = (e, {name}) => this.setState({activeItem: name});
    getSocialMediaLinks = () => {
        return (
            <div style={{margin: ' 10px 10px 0px 100px'}}>
                The Best Purchase Group Buying Platform In The World.
                <Button circular color='facebook' icon='facebook' href='https://www.facebook.com/Lecti-2096383947304229' target="_blank" />
                <Button circular color='twitter' icon='twitter' href='https://twitter.com/Lecti3' target="_blank"/>
                <Button circular color='linkedin' icon='linkedin' href='https://www.linkedin.com/in/lecti-ltd-044089165' target="_blank" />
                <Button circular color='google plus' icon='google plus' href='https://plus.google.com/u/1/111288502224844859394' target="_blank" />
            </div>

        );
    }



    render() {
        const {activeItem} = this.state;

        if (!this.props.auth) {
            return (
                <Grid stretched style={{marginTop: '20px', width: '100%'}}>
                    <Grid.Column stretched width={12}>
                        <Segment>
                            {this.getSocialMediaLinks()}
                        </Segment>
                    </Grid.Column>

                    <Grid.Column width={3}>
                        <Menu fluid vertical tabular='right'>
                            <Menu.Item name='Home' active={activeItem === 'Home'} onClick={this.handleItemClick}><Link
                                to={`/`}>Home</Link></Menu.Item>
                        </Menu>
                    </Grid.Column>
                </Grid>
            );
        }


        return (
            <Grid style={{marginTop: '20px'}}>
                <Grid.Column stretched width={12}>
                    <Segment>
                        {this.getSocialMediaLinks()}
                    </Segment>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Menu fluid vertical tabular='right'>
                        <Menu.Item name='Profile' active={activeItem === 'Profile'} onClick={this.handleItemClick}><Link
                            to={`/profile/${this.props.auth._id}`}>Profile</Link></Menu.Item>
                        <Menu.Item name='Sales' active={activeItem === 'Sales'} onClick={this.handleItemClick}><Link
                            to={`/sales`}>Sales</Link></Menu.Item>
                        <Menu.Item name='Cart' active={activeItem === 'Cart'} onClick={this.handleItemClick}><Link
                            to={`/cart`}>Cart</Link></Menu.Item>
                    </Menu>
                </Grid.Column>
            </Grid>
        )
    }
}


function mapStateToProps({auth}) {
    return {auth};
}

export default connect(mapStateToProps)(Footer);