import React, { Component } from "react";
import { Link } from "react-router-dom";
import config from "../config";
import axios from "axios";

class EditForm extends Component {

  state = {
    plant: {}
  }

  componentDidMount() {
    let plantId = this.props.match.params.plantId;
    axios.get(`${ config.API_URL }/api/plants/${ plantId }`)
      .then(
        (response) => {
          this.setState(
            {
              plant: response.data
            }
          );
        }
      )
      .catch(
        () => {
          console.log("Detail fetch failed");
        }
      );
  }

  handleNameChange = (event) => {
    let text = event.target.value;
    let clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.name = text
    this.setState(
      {
        plant: clonePlant
      }
    );
  }

  handleDescChange = (event) => {
    let text = event.target.value;
    let clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.description = text;
    this.setState(
      {
      plant: clonePlant
      }
    );
  }

  handleSizeChange = (event) => {
    let text = event.target.value;
    let clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.size = text;
    this.setState(
      {
        plant: clonePlant
      }
    );
  }

  handlePriceChange = (event) => {
    let text = event.target.value;
    let clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.price = text;
    this.setState(
      {
        plant: clonePlant
      }
    );
  }

  handleLocationChange = (event) => {
    let text = event.target.value;
    let clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.location = text;
    this.setState(
      {
        plant: clonePlant
      }
    );
  }

  handleImageChange = (event) => {
    let image = event.target.files[0];
    let uploadForm = new FormData();
    uploadForm.append("imageUrl", image);
    axios.post(`${ config.API_URL }/api/upload`, uploadForm)
      .then(
        (response) => {
          let clonePlant = JSON.parse(JSON.stringify(this.state.plant));
          clonePlant.image = response.data.image;
          this.setState(
            {
              plant: clonePlant
            }
          );
          console.log(clonePlant);
        }
      )
      .catch(
        (err) => {
          console.log("Image upload failed", err);
        }
      );
  }

  render() {
    const { plant } = this.state;
    const { onEdit } = this.props;
    return (
      <div className="container row mt-5 ">
        <div className="mt-2 col-11 col-md-5 offset-1 offset-md-5">
          <h2 className="mt-5 mb-4"> Edit your plant </h2>
          <div className="card cardSmallWidth mb-5">
            <img className="mb-2 smallPicSize" src={ plant.image } alt={ plant.name }/>
            <div className="card-body">
              <input className="mb-2" onChange={ this.handleImageChange } type="file"/>
              <input className="mb-2"  type="text" onChange={ this.handleNameChange } value={ plant.name }/>
              <input className="mb-2"  type="text" onChange={ this.handleDescChange } value={ plant.description }/>
              <input className="mb-2 smallWidth"  type="number" onChange={this.handleSizeChange} value={ plant.size }/> cm <br/>
              <select  className="mb-2" onChange={ this.handleLocationChange } name="location" type="text" placeholder="Select">
                <option value="sun"> sun </option>
                <option value="shade"> shade </option>
                <option value="sun and shade"> sun and shade </option>
              </select> <br/>
              <input className="mb-4 smallWidth" name="price" type="number" min="1" onChange={ this.handlePriceChange } value={ plant.price }/> € 
              <div className="row justify-content-around">
                <button className="btn btn-sm btn-outline-dark" onClick={ () => { onEdit(plant) } }  > Save changes </button>
                <Link to={ `/plants/${plant._id}` }> 
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

export default EditForm;