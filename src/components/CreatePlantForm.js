import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";

class CreatePlantForm extends Component {

  componentDidMount() {
    this.props.onResetError();
    scroll.scrollToTop();
  }

  render() {
    const {user, error, onCreatePlant} = this.props;
    if (!user) return (<Redirect to={"/signup"}/>);
    return (
      <div className="container row mt-5 fullscreen">
        <div className="mt-5 col-11 col-md-5 offset-1 offset-md-6">
          <h2 className="mb-5"> Create a plant </h2>
          <form onSubmit={onCreatePlant}>
            <input className="mb-4" name="name" type="text" placeholder="Enter name"/>
            <input className="mb-4" name="description" type="text" placeholder="Enter description"/>
            <input className="mb-4 smallWidth" name="size" type="number" min="1" placeholder="Size"/> cm <br/>
            <select className="mb-4 p-1" name="location" type="text">
              <option> Select location </option>
              <option value="sun"> sun </option>
              <option value="shade"> shade </option>
              <option value="sun and shade"> sun and shade </option>
            </select>
            <br/>
            <input className="mb-4 smallWidth" name="price" type="number" min="1" placeholder="Price"/> € <br/>
            <input className="mb-4" name="plantImage" type="file"/>
            {
              (error) ? <p className="warningColor"> {error} </p> : null            
            }
            <div className="col-12">
              <button className="btn btn-sm btn-outline-dark" type="submit" > Create </button>
              <Link to={"/"} onClick={() => scroll.scrollTo(1520)}> <button className="btn btn-sm mx-5"> Go back </button> </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreatePlantForm;