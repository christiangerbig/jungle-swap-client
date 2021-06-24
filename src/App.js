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
import KommunicateChat from "./components/Chat";

class App extends Component {

  state = {
    loggedInUser: null,
    error: null,
    plants: [],
    query: "",
    requests: [],
    fetchingUser: true
  }

  // Fetch initial plants data to be displayed
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

  // Search plant
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
  
  // Search changed
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

  // Signup
  handleSignUp = (event) => {
    event.preventDefault();
    const { username, email, password } = event.target;
    const user = {
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
              this.props.history.push("/");
            }
          );
        }
      )
      .catch(
        (err) => {
          this.setState(
            {
              error: err.response.data.error
            }
          );
        }
      );
  }

  // Signin
  handleSignIn = (event) => {
    event.preventDefault();
    const { email, password } = event.target;
    const user = {
      email: email.value,
      password: password.value
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
          this.setState(
            {
              error: err.response.data.error
            }
          );
        }
      );
  }

  // Clear error messages
  resetError = () => {
    this.setState(
      {
        error: null
      }
    );
  }

  // Logout
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

  // Create plant
  handleCreatePlant = (event) => {
    event.preventDefault();
    const  { name, description, size, plantImage, location, price } = event.target;
    const image = plantImage.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    axios.post(`${config.API_URL}/api/upload`, uploadForm)
      .then(
        (response) => {
          const newPlant = {
            name: name.value,
            description: description.value,
            size: size.value,
            image: response.data.image,
            location: location.value,
            price: price.value
          };
          axios.post(`${config.API_URL}/api/plants/create`, newPlant, { withCredentials: true })
            .then(
              (response) => {
                this.setState(
                  {
                    plants: [response.data, ...this.state.plants]
                  },
                  () => {
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

  // Update plant
  handleUpdatePlant = (plant) => {
    const { name, description, size, image, location, price } = plant;
    const updatedPlant = {
      name,
      description,
      size,
      image,
      location,
      price
    };
    axios.patch(`${config.API_URL}/api/plants/create/${plant._id}`, updatedPlant)
      .then(
        () => {
          const updatedPlants = this.state.plants.map(
            (singlePlant) => {
              if (plant._id === singlePlant._id) {
                const { name, description, size, image, location, price } = plant;
                singlePlant.name = name;
                singlePlant.description = description;
                singlePlant.size = size;
                singlePlant.image = image;
                singlePlant.location = location;
                singlePlant.price = price;
              }
              return singlePlant;
            }
          );
          this.setState(
            {
              plants: updatedPlants
            },
            () => {
              this.props.history.push("/");
            }
          );
        }
      )
      .catch(
        (err) => {
          console.log("Update plant failed", err);
        }
      );
  }

  // Delete Plant
  handleDeletePlant = (plantId) => {
    axios.delete(`${config.API_URL}/api/plants/delete/${plantId}`)
      .then(
        () => {
          const filteredPlants = this.state.plants.filter(
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
      )
  }  

  // Payment
  handleCheckout = (price) => {
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

  // Create request
  handleRequestSubmit = (event, plant) => {
    event.preventDefault();
    const { message } = event.target;
    const user = this.state.loggedInUser;
    const request = {
      buyer: user._id,
      seller: plant.creator,
      plant,
      message: message.value
    };
    axios.post(`${config.API_URL}/api/plants/request`, request, { withCredentials: true })
      .then(
        (response) => {
          this.setState(
            {
              requests: [response.data, ...this.state.requests]
            },
            () => {
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

  // My requests
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

  render() {
    const { plants, loggedInUser, error, query, requests } = this.state;
    if (this.state.fetchingUser) {
      <div class="spinner-grow text-success m-5" role="status">
        <span class="visually-hidden"> Loading... </span>
      </div>
    }
    return (
      <div class="main">
        <NavBar onLogOut={ this.handleLogOut } user={ loggedInUser }/>
        <Switch>
          <Route exact path="/" render={
            () => {
              return <Home onSearch={ this.handleChange } plants={ plants } query={ query }/>
            }
          }/>
          <Route path="/signin" render={
            (routeProps) => {
              return <SignIn onSignIn={ this.handleSignIn } onResetError={ this.resetError } error={ error } { ...routeProps }/>
            }
          }/>
          <Route path="/signup" render={
            (routeProps) => {
              return <SignUp onSignUp={ this.handleSignUp } onResetError={ this.resetError } error={ error } { ...routeProps }/>
            }
          }/>
          <Route path="/logout" render={
            (routeProps) => {
              return <LogOut onLogOut={ this.handleLogOut } { ...routeProps }/>
            }
          }/>
           <Route path="/plants/:plantId" render={
            (routeProps) => {
              return <PlantDetail onDeletePlant={ this.handleDeletePlant } user={ loggedInUser } { ...routeProps }/>
            }
          }/>
          <Route path="/add-form" render={
            () => {
              return <AddForm onCreatePlant={ this.handleSubmit } user={ loggedInUser }/>
            }
          }/>
          <Route path="/plant/:plantId/edit" render={
            (routeProps) => {
              return <EditForm onUpdatePlant={ this.handleUpdatePlant } { ...routeProps }/>
            }
          }/>
          <Route path="/plant/:plantId/checkout" render={
            (routeProps) => {
              return <CheckoutPage onCheckout={ this.handleCheckout } { ...routeProps }/>
            }
          }/>
          <Route path="/request-form" render={
            (routeProps) => {
              return <RequestForm onRequest={ this.handleRequestSubmit } user={ loggedInUser } { ...routeProps } />
            }
          }/>
          <Route path="/myrequests" render={
              (routeProps) => {
                return <RequestsPage onMyRequests={ this.handleMyRequests } user={ loggedInUser } requests={ requests } { ...routeProps }/>
              }
          }/>
          <Route component={ NotFound }/>
        </Switch>
        <KommunicateChat/>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(App);