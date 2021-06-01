import React, { Component } from 'react'
import {Link} from "react-router-dom";

export default class NotFound extends Component {
    render() {
        return (
            <div className="notFound">
                <div>

                    <h2>Oh-oh!<br></br>We think you got lost in the jungle!</h2>
                    <h3>404 Not Found</h3>
                    <Link to={"/"}>
                    <button className="btn btn-sm ml-2">Take me home</button>
                  </Link>
                </div>
            </div>
        )
    }
}
