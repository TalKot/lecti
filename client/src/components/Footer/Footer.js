import React, { Component } from 'react'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Footer extends Component {
  state = { activeItem: 'Home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    if (!this.props.auth) {
      return (
        <Grid style={{ marginTop: '20px' }}>
          <Grid.Column stretched width={12}>
            <Segment>
              The Best Purchase Group Buying Platform In The World.
          </Segment>
          </Grid.Column>

          <Grid.Column width={1}>
            <Menu fluid vertical tabular='right'>
              <Menu.Item name='Home' active={activeItem === 'Home'} onClick={this.handleItemClick}><Link to={`/`}>Home</Link></Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid>
      );
    }

    const { activeItem } = this.state

    return (
      <Grid style={{ marginTop: '20px' }}>
        <Grid.Column stretched width={12}>
          <Segment>
            The Best Purchase Group Buying Platform In The World.
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          <Menu fluid vertical tabular='right'>
            <Menu.Item name='Profile' active={activeItem === 'Profile'} onClick={this.handleItemClick}><Link to={`/profile/${this.props.auth._id}`}>Profile</Link></Menu.Item>
            <Menu.Item name='Sales' active={activeItem === 'Sales'} onClick={this.handleItemClick} ><Link to={`/sales`}>Sales</Link></Menu.Item>
            <Menu.Item name='Cart' active={activeItem === 'Cart'} onClick={this.handleItemClick} ><Link to={`/cart`}>Cart</Link></Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid>
    )
  }
}


function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Footer);