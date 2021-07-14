import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import {Link} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";

const NavBar = ({user, newRequestsReceived, headerHeight, aboutHeight}) => {
  return (
    <div>
      <Navbar className="pl-5" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand href="/"> JungleSwap </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <div>
              <Link to="/" className="p-2" onClick={() => scroll.scrollTo(headerHeight + aboutHeight)}> All Plants </Link>
            </div>
            {
              user ? (
                <div>
                  <Link className="p-2" to="/plants/create"> Create Plant </Link>
                  <Link className={newRequestsReceived ? "p-2 alertColor" : "p-2"} to="/requests/fetch" title={newRequestsReceived ? "new message" : null}> Messages </Link>
                </div>
              ) : null
            }
            {
              user ? (
                <div>
                  <Link className="p-2" to="/logout" title={user.username}> Log out </Link>
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

export default NavBar;