import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ScrollTo } from "react-scroll-to";

class NavBar extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        <Navbar className="pl-5" variant="dark" expand="lg" fixed="top">
          <Navbar.Brand href="/"> JungleSwap </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {
              <ScrollTo>
                {({ scroll }) => (
                  <div>
                    <Link to="/" className="p-2" onClick={ () => scroll({ y: 1700, smooth: true }) }> All Plants </Link>
                  </div>
                )}
              </ScrollTo>
            }
            {
              (user) ? (
                <div>
                  <Link className="p-2" to="/plants/create"> Create Plant </Link>
                  <Link className="p-2" to="/requests/fetch"> Messages </Link>
                </div>
              ) : (
                null
              )
            }
            {
              (user) ? (
                <div>
                  <Link className="p-2" to="/logout"> Log out </Link>
                </div>
              ) : (
                <div>
                  <Link className="p-2" to="/signin"> Sign in </Link>
                  <Link className="p-2" to="/signup"> Sign up </Link>
                </div>
              )
            }
          </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;