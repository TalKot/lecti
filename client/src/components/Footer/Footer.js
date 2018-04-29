// import React from 'react';
// import {Link} from 'react-router-dom';
// export default () => {
//     return(
//         <footer className="page-footer #1976d2 blue darken-2">
//             <div className="container">
//                 <div className="row">
//                     <div className="col l6 s12">
//                         <h5 className="white-text">Lecti</h5>
//                         <p className="grey-text text-lighten-4">The Best Purchase Group Buying Platform In The World.</p>
//                     </div>
//                     <div className="col l4 offset-l2 s12">
//                         <h5 className="white-text">Links</h5>
//                         <ul>
//                             <li><Link to={'/profile'} className="text-lighten-3 white-text">Profile</Link></li>
//                             <li><Link to={'/sales'} className="text-lighten-3 white-text">Sales</Link></li>
//                             <li><Link to={'/cart'} className="text-lighten-3 white-text">Cart</Link></li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//             <div className="footer-copyright">
//                 <div className="container">
//                     © 2018 Copyright Text
//                 </div>
//             </div>
//         </footer>

//     );
// };


import React, { Component } from 'react'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Footer extends Component {
  state = { activeItem: 'bio' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    if (!this.props.auth) {
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      );
    }

    const { activeItem } = this.state

    return (
      <Grid>
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