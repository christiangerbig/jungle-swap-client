import React, { Component } from "react";
import { Link } from "react-router-dom";
import config from "../config";
import axios from "axios";

class UpdatePlantForm extends Component {

  state = { plant: {} };

  componentDidMount() {
    const { plantId } = this.props.match.params;
    axios.get(`${ config.API_URL }/api/plants/read/${ plantId }`)
      .then(
        (response) => this.setState({ plant: response.data })
      )
      .catch(
        () => console.log("Plant detail fetch failed")
      );
  }

  // Plant name changed
  handleNameChange = (event) => {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.name = event.target.value;
    this.setState({ plant: clonePlant });
  }

  // Plant description changed
  handleDescriptionChange = (event) => {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.description = event.target.value;
    this.setState({ plant: clonePlant });
  }

  // Plant size changed
  handleSizeChange = (event) => {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.size = event.target.value;
    this.setState({ plant: clonePlant });
  }

  // Plant price changed
  handlePriceChange = (event) => {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.price = event.target.value;
    this.setState({ plant: clonePlant });
  }

  // Plant location changed
  handleLocationChange = (event) => {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.location = event.target.value;
    this.setState({ plant: clonePlant });
  }

  // Plant image changed
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    axios.post(`${ config.API_URL }/api/upload`, uploadForm)
      .then(
        (response) => {
          const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
          clonePlant.image = response.data.image;
          this.setState({ plant: clonePlant });
        }
      )
      .catch(
        (err) => console.log("Image upload failed", err)
      );
  }

  render() {
    const { plant } = this.state;
    const { onUpdatePlant } = this.props;
    const { _id, name, description, size, image, price } = plant;
    return (
      <div className="container row mt-5 ">
        <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
          <h2 className="mt-5 mb-4"> Update your plant </h2>
          <div className="card cardSmallWidth mb-5">
            <img className="mb-2 smallPicSize" src={ image } alt={ name }/>
            <div className="card-body">
              <input className="mb-2" onChange={ this.handleImageChange } type="file"/>
              <input className="mb-2"  type="text" onChange={ this.handleNameChange } value={ name }/>
              <input className="mb-2"  type="text" onChange={ this.handleDescriptionChange } value={ description }/>
              <input className="mb-2 smallWidth"  type="number" onChange={this.handleSizeChange} value={ size }/> cm <br/>
              <select  className="mb-2" onChange={ this.handleLocationChange } name="location" type="text" placeholder="Select">
                <option value="sun"> sun </option>
                <option value="shade"> shade </option>
                <option value="sun and shade"> sun and shade </option>
              </select> <br/>
              <input className="mb-4 smallWidth" name="price" type="number" min="1" onChange={ this.handlePriceChange } value={ price }/> € 
              <div className="row justify-content-around">
                <button className="btn btn-sm btn-outline-dark" onClick={ () => onUpdatePlant(plant) }> Save changes </button>
                <Link to={ `/plants/${_id}` }> 
                  <button className="btn btn-sm mx-2"> Go back </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdatePlantForm;