import React, { Component } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Switch, withRouter } from "react-router-dom";
import config from "./config";
import axios from "axios";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AddForm from "./components/AddForm";
import EditForm from "./components/EditForm";
import PlantDetail from "./components/PlantDetail";
import CheckoutPage from "./components/CheckoutPage";
import LogOut from "./components/LogOut";
import RequestForm from "./components/RequestForm";
import RequestsPage from "./components/RequestsPage";
import NotFound from './components/NotFound';

class App extends Component {

  state = {
    loggedInUser: null,
    error: null,
    plants: [],
    query: "",
    requests: [],
    fetchingUser: true
  }


  // ------------ Fetch initial data to be displayed ---------------

  componentDidMount() {
    this.fetchAllPlants()
    if (!this.state.loggedInUser) {
      axios.get(`${config.API_URL}/api/user`, { withCredentials: true })
        .then(
          (response) => {
            this.setState(
              {
                loggedInUser: response.data,
                fetchingUser: false
              }
            );
          }
        )
        .catch(
          (err) => {
            this.setState(
              {
                fetchingUser: false
              }
            );
            console.log("Initializing fetching failed", err);
          }
        );
    }
  }

  fetchAllPlants = () => {
    axios.get(`${config.API_URL}/api/plants`)
      .then(
        (response) => {
          this.setState(
            {
              plants: response.data
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Fetching plants failed", err);
        }
      );
  }


  //--------------- Search form ---------------------------

  fetchQueryPlants = () => {
    axios.get(`${config.API_URL}/api/plants/search?q=${this.state.query}`)
      .then(
        (response) => {
          this.setState(
            {
              plants: response.data,
              ready: true
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Query fetching failed", err);
        }
      );
  }

  handleChange = (event) => {
    const query = event.target.value;
    this.setState(
      { query },
      () => {
        query ? (
          this.fetchQueryPlants()
        ) : (
          this.fetchAllPlants()
        )
      }
    );
  }


  //------------ Add Form ------------------

  handleSubmit = (event) => {
    event.preventDefault();
    const {name, description, size, price, plantImage, location} = event.target;
    let image = plantImage.files[0];
    let uploadForm = new FormData();
    uploadForm.append("imageUrl", image);
    axios.post(`${config.API_URL}/api/upload`, uploadForm)
      .then(
        (response) => {
          //1. Make an API call to the server side Route to create a new plant
          const newPlant = {
            name: name.value,
            description: description.value,
            size: size.value,
            price: price.value,
            image: response.data.image,
            location: location.value
          };
          axios.post(`${config.API_URL}/api/plants/create`, newPlant, { withCredentials: true })
            .then(
              (response) => {
                // 2. Once the server has successfully created a new plant, update your state that is visible to the user
                this.setState(
                  {
                    plants: [response.data, ...this.state.plants]
                  },
                  () => {
                    // 3. Once the state is update, redirect the user to the home page
                    this.props.history.push("/");
                  }
                );
              }
            )
            .catch(
              (err) => {
                console.log("Create plant failed", err);
              }
            );
        }
      )
      .catch(
        (err) => {
          console.log("Image upload failed", err);
        }
      );
  }


  //------------ Edit Plant ------------------

  handleEditPlant = (plant) => {
    const {name, description, size, price, image, location} = plant;
    const editedPlant = {
      name: name,
      description: description,
      size: size,
      price: price,
      image: image,
      location: location
    };
    axios.patch(`${config.API_URL}/api/plants/${plant._id}`, editedPlant)
      .then(
        () => {
          let newPlants = this.state.plants.map(
            (singlePlant) => {
              if (plant._id === singlePlant._id) {
                const { name, description, size, price, image, location } = plant;
                singlePlant.name = name;
                singlePlant.description = description;
                singlePlant.size = size;
                singlePlant.price = price;
                singlePlant.image = image;
                singlePlant.location = location;
              }
              return singlePlant;
            }
          );
          this.setState(
            {
              plants: newPlants
            },
            () => {
              this.props.history.push("/");
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Edit plant failed", err);
        }
      );
  }


  //-------------- Delete Plant ------------------

  handleDelete = (plantId) => {
    //1. Make an API call to the server side Route to delete that specific plant
    axios.delete(`${config.API_URL}/api/plants/${plantId}`)
      .then(
        () => {
          // 2. Once the server has successfully created a new plant, update your state that is visible to the user
          let filteredPlants = this.state.plants.filter(
            (plant) => {
              return plant._id !== plantId;
            }
          );
          this.setState(
            {
              plants: filteredPlants
            },
            () => {
              this.props.history.push("/");
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Delete plant failed", err);
        }
      );
  }


  // ---------------- Authentication ---------------------

  handleSignUp = (event) => {
    event.preventDefault();
    const { username, email, password } = event.target;
    let user = {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value
    };
    
    axios.post(`${config.API_URL}/api/signup`, user)
      .then(
        (response) => {
          this.setState(
            {
              loggedInUser: response.data
            },
            () => {
              this.props.history.push("/signin");
            }
          );
        }
      )
      .catch(
        (err) => {
          this.setState(
            {
              error: err.response.data.errorMessage
            }
          );
        }
      );
  }

  handleSignIn = (event) => {
    event.preventDefault();
    let user = {
      email: event.target.email.value,
      password: event.target.password.value
    };
    axios.post(`${config.API_URL}/api/signin`, user, { withCredentials: true })
      .then(
        (response) => {
          this.setState(
            {
              loggedInUser: response.data
            },
            () => {
              this.props.history.push("/");
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Sihn in failed", err);
        }
      );
  }

  handleLogOut = () => {
    axios.post(`${config.API_URL}/api/logout`, {}, { withCredentials: true })
      .then(
        () => {
          this.setState(
            {
              loggedInUser: null
            },
            () => {
              this.props.history.push("/");
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Logout failed", err);
        }
      );
  }


  // -------------------- Payment -----------------------

  handleCheckout = () => {
    axios.post(`${config.API_URL}/api/create-payment-intent`, {}, { withCredentials: true })
      .then(
        () => {
          this.setState(
            () => {
              this.props.history.push("/");
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Checkout failed", err);
        }
      );
  }


  // ------------------------- Request Form --------------------

  handleRequestSubmit = (event, plant) => {
    event.preventDefault();
    //console.log("PLANT:", plant);
    let message = event.target.message.value;
    let user = this.state.loggedInUser;
    //1. Make an API call to the server side Route to create a new plant
    const request = {
      buyer: user._id,
      seller: plant.creator,
      plant: plant,
      message: message
    };
    axios.post(`${config.API_URL}/api/plants/request`, request, { withCredentials: true })
      .then(
        (response) => {
          // 2. Once the server has successfully created a new plant, update your state that is visible to the user
          this.setState(
            {
              requests: [response.data, ...this.state.requests]
            },
            () => {
              // 3. Once the state is update, redirect the user to the home page
              this.props.history.push("/");
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Create request failed", err);
        }
      );
  }


  // ----------------- My requests ---------------------

  handleMyRequests = () => {
    axios.get(`${config.API_URL}/api/myrequests`)
      .then(
        (response) => {
          console.log("Response -- handleMyRequests():", response.data);
          this.setState(
            {
              requests: response.data
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Fetching requests failed", err);
        }
      );
  }


  // -------------- Render ------------------

  render() {
    const { plants, loggedInUser, error, query, requests } = this.state;
    if (this.state.fetchingUser) {
      <div class="spinner-grow text-success m-5" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    }
    return (
      <div class="main">
        <NavBar onLogOut={this.handleLogOut} user={loggedInUser}/>
        <Switch>
          <Route exact path="/" render={
            () => {
              return <Home onSearch={this.handleChange} plants={plants} query={query} />
            }
          } />
          <Route path="/plants/:plantId" render={
            (routeProps) => {
              return <PlantDetail onDelete={this.handleDelete} user={loggedInUser} {...routeProps} />
            }
          } />
          <Route path="/signin" render={
            (routeProps) => {
              return <SignIn onSignIn={this.handleSignIn} {...routeProps} />
            }
          } />
          <Route path="/signup" render={
            (routeProps) => {
              return <SignUp onSignUp={this.handleSignUp} error={error} {...routeProps} />
            }
          } />
          <Route path="/logout" render={
            (routeProps) => {
              return <LogOut onLogOut={this.handleLogOut} {...routeProps} />
            }
          } />
          <Route path="/add-form" render={
            () => {
              return <AddForm onAdd={this.handleSubmit} user={loggedInUser} />
            }
          } />
          <Route path="/plant/:plantId/edit" render={
            (routeProps) => {
              return <EditForm onEdit={this.handleEditPlant} {...routeProps} />
            }
          } />
          <Route path="/plant/:plantId/checkout" render={
            (routeProps) => {
              return <CheckoutPage onCheckout={this.handleCheckout} {...routeProps} />
            }
          } />
          <Route path="/request-form" render={
            (routeProps) => {
              return <RequestForm onRequest={this.handleRequestSubmit} user={loggedInUser} {...routeProps} />
            }
          } />
          <Route path="/myrequests" render={
              (routeProps) => {
                return <RequestsPage onMyRequests={ this.handleMyRequests } user={ loggedInUser } requests={ requests } { ...routeProps }/>
              }
          }/>
          {
           <Route component={NotFound} />
          }
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);