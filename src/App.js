import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import config from "./config";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import LogOut from "./components/LogOut";
import CreatePlantForm from "./components/CreatePlantForm";
import PlantDetails from "./components/PlantDetails";
import UpdatePlantForm from "./components/UpdatePlantForm";
import CheckoutPage from "./components/CheckoutPage";
import RequestsPage from "./components/RequestsPage";
import CreateRequestForm from "./components/CreateRequestForm";
import RequestDetails from "./components/RequestDetails";
import UpdateRequestForm from "./components/UpdateRequestForm";
import NotFound from "./components/NotFound";
import KommunicateChat from "./components/Chat";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetchingUser: true,
      loggedInUser: null,
      plants: [],
      query: "",
      plant: {},
      requests: [],
      request: {},
      currentRequestsNumber: 0,
      initRequestsNumber: true,
      newRequestsReceived: false,
      error: null
    };
  }

  // ---------- Plants ----------

  // Fetch all plants
  fetchAllPlants = () => {
    axios.get(`${config.API_URL}/api/plants/fetch`)
      .then(
        (response) => this.setState({ plants: response.data})
      )
      .catch(
        (err) => console.log("Fetching plants failed", err)
      );
  }

  componentDidMount() {
    this.fetchAllPlants();
    if (!this.state.loggedInUser) {
      axios.get(`${config.API_URL}/api/user`, { withCredentials: true })
        .then(
          (response) => this.setState(
            {
              loggedInUser: response.data,
              fetchingUser: false
            }
          )
        )
        .catch(
          (err) => {
            this.setState({ fetchingUser: false });
            console.log("Initializing fetching failed", err);
          }
        );
    }
  }

  // Fetch query plants
  fetchQueryPlants = () => {
    axios.get(`${config.API_URL}/api/plants/search?q=${this.state.query}`)
      .then(
        (response) => this.setState(
          {
            plants: response.data,
            ready: true
          }
        )
      )
      .catch(
        (err) => console.log("Query fetching failed", err)
      );
  }
  
  // Search plant
  handleSearchPlant = (event) => {
    const query = event.target.value;
    this.setState(
      { query },
      () => (query) ? this.fetchQueryPlants() : this.fetchAllPlants()
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
              (response) => this.setState(
                { plants: [response.data, ...this.state.plants] },
                () => this.props.history.push("/")
              )
            )
            .catch(
              (err) => this.setState({ error: err.response.data.error })
            );
        }
      )
      .catch(
        (err) => this.setState({ error: err.response.data.error })
      );
  }

  // Read plant
  handleReadPlant = (plantId) => {
    axios.get(
      `${config.API_URL}/api/plants/read/${plantId}`,
      { withCredentials: true }
    )
      .then(
        (response) => this.setState({ plant: response.data })
      )
      .catch(
        () => console.log("Read plant failed")
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

  // Update plant
  handleUpdatePlant = (plant) => {
    const { _id, name, description, size, image, location, price } = plant;
    const updatedPlant = {
      name,
      description,
      size,
      image,
      location,
      price
    };
    axios.patch(`${config.API_URL}/api/plants/update/${_id}`, updatedPlant)
      .then(
        () => {
          const updatedPlants = this.state.plants.map(
            (singlePlant) => {
              if (singlePlant._id === _id) {
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
            { plants: updatedPlants },
            () => this.props.history.push("/")
          );
        }
      )
      .catch(
        (err) => console.log("Update plant failed", err)
      );
  }

  // Delete Plant
  handleDeletePlant = (plantId) => {
    axios.delete(`${config.API_URL}/api/plants/delete/${plantId}`)
      .then(
        () => {
          const filteredPlants = this.state.plants.filter(
            (plant) => {
              return (plant._id !== plantId)
            }
          );
          this.setState(
            { plants: filteredPlants },
            () => {
              this.props.history.push("/");
              scroll.scrollTo(1520);
            }
          );
        }
      )
      .catch(
        (err) => console.log("Delete plant failed", err)
      );
  }  

  // Payment
  handleCheckout = (price) => {
    axios.post(`${config.API_URL}/api/create-payment-intent`, {}, { withCredentials: true })
      .then(
        () => this.setState(() => this.props.history.push("/"))
      )
      .catch(
        (err) => console.log("Checkout failed", err)
      );
  }

  // ---------- Requests ----------

  // Fetch all requests
  handleFetchAllRequests = () => {
    axios.get(`${config.API_URL}/api/requests/fetch`)
      .then(
        (response) => this.setState({ requests: response.data })
      )
      .catch(
        (err) => console.log("Fetching requests failed", err)
      );
  }

  // Check requests for logged in user
  handleCheckRequests = () => {
    const { loggedInUser } = this.state;
    if (loggedInUser) {
      axios.get(`${config.API_URL}/api/requests/fetch`)
        .then(
          (response) => {
            this.setState({ requests: response.data });
            const currentRequests = this.state.requests.filter(
              (currentRequest) => {
                return (currentRequest.seller._id === loggedInUser._id) 
              } 
            );
            const currentRequestsNumber = currentRequests.length;
            // Save number of requests only once at the beginning
            if (this.state.initRequestsNumber) {
              this.setState(
                { 
                  currentRequestsNumber: currentRequestsNumber,
                  initRequestsNumber: false
                }
              );
            }
            // Check if there are new requests and update number of requests
            if ((this.state.currentRequestsNumber < currentRequestsNumber) && (this.state.initRequestsNumber === false) && (currentRequests[0].seller._id === loggedInUser._id)) {
              this.setState(
                { 
                  currentRequestsNumber: currentRequestsNumber,
                  newRequestsReceived: true
                }
              );
            }
          }
        )
        .catch(
          (err) => console.log("Checking requests failed", err)
        );
    }
  }

  // Reset state for new received requests
  resetNewRequestsReceived = () => this.setState({ newRequestsReceived: false })

  // Create request
  handleCreateRequest = (event, plant) => {
    event.preventDefault();
    const { message } = event.target;
    const newRequest = {
      seller: plant.creator._id,
      plant: plant._id,
      message: message.value
    };
    axios.post(`${config.API_URL}/api/requests/create`, newRequest, { withCredentials: true })
      .then(
        (response) => this.setState(
          { requests: [response.data, ...this.state.requests] },
          () => this.props.history.push(`/plants/read/${plant._id}`)
        )
      )
      .catch(
        (err) => this.setState({ error: err.response.data.error })
      );
  }

  // Read request
  handleReadRequest = (requestId) => {
    axios.get(
      `${config.API_URL}/api/requests/read/${requestId}`,
      { withCredentials: true }
    )
      .then(
        (response) => this.setState({ request: response.data })
      )
      .catch(
        () => console.log("Read request failed")
      );
  }

  // Create reply
  handleCreateReply = (event) => {
    const cloneRequest = JSON.parse(JSON.stringify(this.state.request));
    cloneRequest.reply = event.target.value;
    this.setState({ request: cloneRequest });
  }

  // Update request
  handleUpdateRequest = (request) => {
    const { _id, buyer, seller, plant, message, reply } = request;
    const updatedRequest = {
      buyer,
      seller,
      plant,
      message,
      reply
    };
    axios.patch(`${config.API_URL}/api/requests/update/${_id}`, updatedRequest)
      .then(
        () => {
          const updatedRequests = this.state.requests.map(
            (singleRequest) => {
              if (singleRequest._id === _id) {
                singleRequest.buyer = buyer;
                singleRequest.seller = seller;
                singleRequest.plant = plant;
                singleRequest.message = message;
                singleRequest.reply = reply;
              }
              return singleRequest;
            }
          );
          this.setState(
            { requests: updatedRequests },
            () => this.props.history.push(`/requests/read/${_id}`)
          );
        }
      )
      .catch(
        (err) => console.log("Update request failed", err)
      );
  }

  // Delete request
  handleDeleteRequest = (requestId) => {
    axios.delete(`${config.API_URL}/api/requests/delete/${requestId}`)
      .then(
        () => {
          const filteredRequests = this.state.requests.filter(
            (request) => {
              return (request._id !== requestId)
            }
          );
          const currentRequestsNumber = filteredRequests.length;
          this.setState(
            { 
              requests: filteredRequests,
              currentRequestsNumber: currentRequestsNumber
            },
            () => this.props.history.push("/requests/fetch")
          );
        }
      )
      .catch(
        (err) => console.log("Delete requestfailed", err)
      );
  }

  // ---------- Authentification ----------

    // Clear error messages
    resetError = () => this.setState({ error: null })

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
          (response) => this.setState(
            { loggedInUser: response.data },
            () => this.props.history.push("/")
          )
        )
        .catch(
          (err) => this.setState({ error: err.response.data.error })
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
          (response) => this.setState(
            { loggedInUser: response.data },
            () => this.props.history.push("/")
          )
        )
        .catch(
          (err) => this.setState({ error: err.response.data.error })
        );
    }
  
    // Logout
    handleLogOut = () => {
      axios.post(`${config.API_URL}/api/logout`, {}, { withCredentials: true })
        .then(
          () => this.setState(
            { loggedInUser: null },
            () => this.props.history.push("/")
          )
        )
        .catch(
          (err) => console.log("Logout failed", err)
        );
    }

  render() {
    const { fetchingUser, loggedInUser, plants, query, plant, requests, request, currentRequestsNumber, newRequestsReceived, error } = this.state;
    if (fetchingUser) {
      return (
        <div class="spinner-grow text-success m-5" role="status">
          <span class="visually-hidden"> Loading... </span>
        </div>
      );
    }
    return (
      <div class="main">
        <NavBar onLogOut={ this.handleLogOut } onCheckRequests={this.handleCheckRequests} newRequestsReceived={ newRequestsReceived } user={ loggedInUser }/>
        <Switch>
          <Route exact path="/" render={
            () => {
              return <Home onSearchPlant={ this.handleSearchPlant } plants={ plants } query={ query }/>
            }
          }/>
          <Route path="/signup" render={
            (routeProps) => {
              return <SignUp onSignUp={ this.handleSignUp } onResetError={ this.resetError } onResetNewRequestsReceived={ this.resetNewRequestsReceived } error={ error } { ...routeProps }/>
            }
          }/>
          <Route path="/signin" render={
            (routeProps) => {
              return <SignIn onSignIn={ this.handleSignIn } onResetError={ this.resetError } onResetNewRequestsReceived={ this.resetNewRequestsReceived } error={ error } { ...routeProps }/>
            }
          }/>
          <Route path="/logout" render={
            (routeProps) => {
              return <LogOut onLogOut={ this.handleLogOut } onResetNewRequestsReceived={ this.resetNewRequestsReceived } { ...routeProps }/>
            }
          }/>
          <Route path="/plants/create" render={
            (routeProps) => {
              return <CreatePlantForm onCreatePlant={ this.handleCreatePlant } onResetError={ this.resetError } user={ loggedInUser } error={ error } { ...routeProps }/>
            }
          }/>
          <Route path="/plants/read/:plantId" render={
            (routeProps) => {
              return <PlantDetails onReadPlant={ this.handleReadPlant } onDeletePlant={ this.handleDeletePlant } plant={ plant } user={ loggedInUser } { ...routeProps }/>
            }
          }/>
          <Route path="/plants/update" render={
            (routeProps) => {
              return <UpdatePlantForm onNameChange={ this.handleNameChange } onDescriptionChange={ this.handleDescriptionChange } onSizeChange={ this.handleSizeChange } onPriceChange={ this.handlePriceChange } onLocationChange={ this.handleLocationChange } onImageChange={ this.handleImageChange } onUpdatePlant={ this.handleUpdatePlant } plant={ plant } { ...routeProps }/>
            }
          }/>
          <Route path="/plants/checkout/:plantId" render={
            (routeProps) => {
              return <CheckoutPage onCheckout={ this.handleCheckout } { ...routeProps }/>
            }
          }/>
          <Route path="/requests/fetch" render={
              (routeProps) => {
                return <RequestsPage onFetchAllRequests={ this.handleFetchAllRequests } onResetNewRequestsReceived={ this.resetNewRequestsReceived }  user={ loggedInUser } requests={ requests } currentRequestsNumber={ currentRequestsNumber } { ...routeProps }/>
              }
          }/>
          <Route path="/requests/create" render={
            (routeProps) => {
              return <CreateRequestForm onCreateRequest={ this.handleCreateRequest } onResetError={ this.resetError } user={ loggedInUser } error={ error } { ...routeProps }/>
            }
          }/>
          <Route path="/requests/read/:requestId" render={
            (routeProps) => {
              return <RequestDetails onReadRequest={ this.handleReadRequest } onDeleteRequest={ this.handleDeleteRequest } request={ request } user={ loggedInUser } { ...routeProps }/>
            }
          }/>
          <Route path="/requests/update" render={
            (routeProps) => {
              return <UpdateRequestForm onCreateReply={ this.handleCreateReply } onUpdateRequest={ this.handleUpdateRequest } request={ request } { ...routeProps }/>
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