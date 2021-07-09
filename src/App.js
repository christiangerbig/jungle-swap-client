import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";
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
      headerHeight: 0,
      introHeight: 0,
      error: null
    };
    this.getElementsHeight = this.getElementsHeight.bind(this);
    // ---------- Plants -----------
    this.fetchAllPlants = this.fetchAllPlants.bind(this);
    this.fetchQueryPlants = this.fetchQueryPlants.bind(this);
    this.handleSearchPlant = this.handleSearchPlant.bind(this);
    this.handleCreatePlant = this.handleCreatePlant.bind(this);
    this.handleReadPlant = this.handleReadPlant.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleUpdatePlant = this.handleUpdatePlant.bind(this);    
    this.handleDeletePlant = this.handleDeletePlant.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    // ---------- Requests ----------
    this.handleFetchAllRequests = this.handleFetchAllRequests.bind(this);
    this.handleCheckRequests = this.handleCheckRequests.bind(this);
    this.resetNewRequestsReceived = this.resetNewRequestsReceived.bind(this);
    this.handleCreateRequest = this.handleCreateRequest.bind(this);
    this.handleReadRequest = this.handleReadRequest.bind(this);
    this.handleCreateReply = this.handleCreateReply.bind(this);
    this.handleUpdateRequest = this.handleUpdateRequest.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    // ---------- Authentification ----------
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  // ---------- Plants ----------

  // Get height of header and about elements
  getElementsHeight() {
    const headerHeight = Math.round(document.querySelector("#titleId").getBoundingClientRect().height);
    const introHeight = Math.round(document.querySelector("#aboutId").getBoundingClientRect().height);
    this.setState(
      {
      headerHeight,
      introHeight
      }
    );
  }

  // Fetch all plants
  fetchAllPlants() {
    axios.get(`${config.API_URL}/api/plants/fetch`)
      .then(
        (response) => this.setState({plants: response.data})
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
  fetchQueryPlants() {
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
  handleSearchPlant(event) {
    const query = event.target.value;
    this.setState(
      {query},
      () => (query) ? this.fetchQueryPlants() : this.fetchAllPlants()
    );
  }

  // Create plant
  handleCreatePlant(event) {
    event.preventDefault();
    const {name, description, size, plantImage, location, price} = event.target;
    const image = plantImage.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    axios.post(`${config.API_URL}/api/upload`, uploadForm)
      .then(
        (response) => {
          const {image, imagePublicId} = response.data;
          const newPlant = {
            name: name.value,
            description: description.value,
            size: size.value,
            image,
            imagePublicId,
            location: location.value,
            price: price.value
          };
          axios.post(
            `${config.API_URL}/api/plants/create`, 
            newPlant, 
            {withCredentials: true}
          )
            .then(
              (response) => this.setState(
                {plants: [response.data, ...this.state.plants]},
                () => {
                  this.props.history.push("/");
                  const {headerHeight, introHeight} = this.state;
                  scroll.scrollTo(headerHeight+introHeight);
                }
              )
            )
            .catch(
              (err) => this.setState({error: err.response.data.error})
            );
        }
      )
      .catch(
        (err) => this.setState({error: err.response.data.error})
      );
  }

  // Read plant
  handleReadPlant(plantId) {
    axios.get(
      `${config.API_URL}/api/plants/read/${plantId}`,
      {withCredentials: true}
    )
      .then(
        (response) => this.setState({plant: response.data})
      )
      .catch(
        () => console.log("Read plant failed")
      );
  }

  // Plant name changed
  handleNameChange(event) {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.name = event.target.value;
    this.setState({plant: clonePlant});
  }

  // Plant description changed
  handleDescriptionChange(event) {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.description = event.target.value;
    this.setState({plant: clonePlant});
  }

  // Plant size changed
  handleSizeChange(event) {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.size = event.target.value;
    this.setState({plant: clonePlant});
  }

  // Plant price changed
  handlePriceChange(event) {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.price = event.target.value;
    this.setState({plant: clonePlant});
  }

  // Plant location changed
  handleLocationChange(event) {
    const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
    clonePlant.location = event.target.value;
    this.setState({plant: clonePlant});
  }

  // Plant image changed
  handleImageChange(event) {
    const image = event.target.files[0];
    const {imagePublicId} = this.state.plant;
    const destroyImageData = {
      imagePublicId
    }
    axios.post(
      `${config.API_URL}/api/destroy`, 
      destroyImageData
    )
      .then(
        () => {
          const uploadForm = new FormData();
          uploadForm.append("image", image);
          axios.post(
            `${ config.API_URL }/api/upload`, 
            uploadForm
          )
            .then(
              (response) => {
                const clonePlant = JSON.parse(JSON.stringify(this.state.plant));
                const {imagePublicId, image} = response.data;
                clonePlant.imagePublicId = imagePublicId;
                clonePlant.image = image;
                this.setState({plant: clonePlant});
              }
            )
            .catch(
              (err) => console.log("Image upload failed", err)
            );
        }
      )
      .catch(
        (err) => console.log("Delete old image failed", err)
      );
  }

  // Update plant
  handleUpdatePlant(plant) {
    const {_id, name, description, size, image, imagePublicId, location, price} = plant;
    const updatedPlant = {
      name,
      description,
      size,
      image,
      imagePublicId,
      location,
      price
    };
    axios.patch(
      `${config.API_URL}/api/plants/update/${_id}`,
       updatedPlant
      )
      .then(
        () => {
          const updatedPlants = this.state.plants.map(
            (singlePlant) => {
              if (singlePlant._id === _id) {
                singlePlant.name = name;
                singlePlant.description = description;
                singlePlant.size = size;
                singlePlant.image = image;
                singlePlant.imagePublicId = imagePublicId;
                singlePlant.location = location;
                singlePlant.price = price;
              }
              return singlePlant;
            }
          );
          this.setState(
            {plants: updatedPlants},
            () => {
              this.props.history.push("/");
              const {headerHeight, introHeight} = this.state;
              scroll.scrollTo(headerHeight+introHeight);
            }
          );
        }
      )
      .catch(
        (err) => console.log("Update plant failed", err)
      );
  }

  // Delete Plant
  handleDeletePlant(plantId, imagePublicId) {
    const destroyImageData = {
      imagePublicId
    }
    axios.post(
      `${config.API_URL}/api/destroy`, 
      destroyImageData
    )
      .then(
        () => {
          axios.delete(`${config.API_URL}/api/plants/delete/${plantId}`)
            .then(
              () => {
                const filteredPlants = this.state.plants.filter(
                  (plant) => {
                    return plant._id !== plantId;
                  }
                );
                this.setState(
                  {plants: filteredPlants},
                  () => {
                    this.props.history.push("/");
                    const {headerHeight, introHeight} = this.state;
                    scroll.scrollTo(headerHeight+introHeight);
                  }
                );
              }
            )
            .catch(
              (err) => console.log("Delete plant failed", err)
            );
        }
      )
      .catch(
        (err) => console.log("Delete image failed", err)
      );
  }  

  // Plant payment
  handleCheckout(price) {
    axios.post(
      `${config.API_URL}/api/create-payment-intent`, 
      {}, 
      {withCredentials: true}
    )
      .then(
        () => this.setState(
          () => {
            this.props.history.push("/");
            const {headerHeight, introHeight} = this.state;
            scroll.scrollTo(headerHeight+introHeight);
          }
        )
      )
      .catch(
        (err) => console.log("Checkout failed", err)
      );
  }

  // ---------- Requests ----------

  // Fetch all requests
  handleFetchAllRequests() {
    axios.get(`${config.API_URL}/api/requests/fetch`)
      .then(
        (response) => this.setState({requests: response.data})
      )
      .catch(
        (err) => console.log("Fetching requests failed", err)
      );
  }

  // Check requests for logged in user
  handleCheckRequests() {
    const {loggedInUser} = this.state;
    if (loggedInUser) {
      axios.get(`${config.API_URL}/api/requests/fetch`)
        .then(
          (response) => {
            this.setState({requests: response.data});
            const currentRequests = this.state.requests.filter(
              (currentRequest) => {
                return currentRequest.seller._id === loggedInUser._id;
              } 
            );
            const currentRequestsNumber = currentRequests.length;
            // Save number of requests only once at the beginning
            if (this.state.initRequestsNumber) {
              this.setState(
                { 
                  currentRequestsNumber,
                  initRequestsNumber: false
                }
              );
            }
            // Check if there are new requests and update number of requests
            if ((this.state.currentRequestsNumber < currentRequestsNumber) && (this.state.initRequestsNumber === false) && (currentRequests[0].seller._id === loggedInUser._id)) {
              this.setState(
                { 
                  currentRequestsNumber,
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
  resetNewRequestsReceived() {
    this.setState({newRequestsReceived: false});
  }

  // Create request
  handleCreateRequest(event, plant) {
    event.preventDefault();
    const {message} = event.target;
    const newRequest = {
      seller: plant.creator._id,
      plant: plant._id,
      message: message.value
    };
    axios.post(
      `${config.API_URL}/api/requests/create`, 
      newRequest, 
      {withCredentials: true}
    )
      .then(
        (response) => this.setState(
          {requests: [response.data, ...this.state.requests]},
          () => this.props.history.push(`/plants/read/${plant._id}`)
        )
      )
      .catch(
        (err) => this.setState({error: err.response.data.error})
      );
  }

  // Read request
  handleReadRequest(requestId) {
    axios.get(
      `${config.API_URL}/api/requests/read/${requestId}`,
      {withCredentials: true}
    )
      .then(
        (response) => this.setState({request: response.data})
      )
      .catch(
        () => console.log("Read request failed")
      );
  }

  // Create reply
  handleCreateReply(event) {
    const cloneRequest = JSON.parse(JSON.stringify(this.state.request));
    cloneRequest.reply = event.target.value;
    this.setState({request: cloneRequest});
  }

  // Update request
  handleUpdateRequest(request) {
    const {_id, buyer, seller, plant, message, reply} = request;
    const updatedRequest = {
      buyer,
      seller,
      plant,
      message,
      reply
    };
    axios.patch(
      `${config.API_URL}/api/requests/update/${_id}`, 
      updatedRequest
    )
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
            {requests: updatedRequests},
            () => this.props.history.push(`/requests/read/${_id}`)
          );
        }
      )
      .catch(
        (err) => console.log("Update request failed", err)
      );
  }

  // Delete request
  handleDeleteRequest(requestId) {
    axios.delete(`${config.API_URL}/api/requests/delete/${requestId}`)
      .then(
        () => {
          const filteredRequests = this.state.requests.filter(
            (request) => {
              return request._id !== requestId;
            }
          );
          const currentRequestsNumber = filteredRequests.length;
          this.setState(
            { 
              requests: filteredRequests,
              currentRequestsNumber
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
  resetError() {
    this.setState({error: null});
  }

  // Signup
  handleSignUp(event) {
    event.preventDefault();
    const {username, email, password} = event.target;
    const newUser = {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value
    };
    axios.post(
      `${config.API_URL}/api/signup`, 
      newUser
    )
      .then(
        (response) => this.setState(
          {loggedInUser: response.data},
          () => this.props.history.push("/")
        )
      )
      .catch(
        (err) => this.setState({error: err.response.data.error})
      );
  }

  // Signin
  handleSignIn(event) {
    event.preventDefault();
    const {email, password} = event.target;
    const user = {
      email: email.value,
      password: password.value
    };
    axios.post(
      `${config.API_URL}/api/signin`, 
      user, 
      {withCredentials: true}
    )
      .then(
        (response) => this.setState(
          {loggedInUser: response.data},
          () => this.props.history.push("/")
        )
      )
      .catch(
        (err) => this.setState({ error: err.response.data.error })
      );
  }

  // Logout
  handleLogOut() {
    axios.post(
      `${config.API_URL}/api/logout`, 
      {}, 
      {withCredentials: true}
    )
      .then(
        () => this.setState(
          {loggedInUser: null},
          () => this.props.history.push("/")
        )
      )
      .catch(
        (err) => console.log("Logout failed", err)
      );
  }

  render() {
    const {fetchingUser, loggedInUser, plants, query, plant, requests, request, headerHeight, introHeight, error, currentRequestsNumber, newRequestsReceived} = this.state;
    if (fetchingUser) return (
      <div class="spinner-grow text-success m-5" role="status">
        <span class="visually-hidden"> Loading... </span>
      </div>
    );
    return (
      <div class="main">
        <NavBar onLogOut={this.handleLogOut} onCheckRequests={this.handleCheckRequests} newRequestsReceived={newRequestsReceived} user={loggedInUser} headerHeight={headerHeight} introHeight={introHeight}/>
        <Switch>
          {/* ---------- Plants ---------- */}
          <Route exact path="/" render={
            () => {
              return <Home onSearchPlant={this.handleSearchPlant} onGetElementsHeight={this.getElementsHeight} plants={plants} query={query} headerHeight={headerHeight}/>
            }
          }/>
          <Route path="/plants/create" render={
            (routeProps) => {
              return <CreatePlantForm onCreatePlant={this.handleCreatePlant} onResetError={this.resetError} user={loggedInUser} headerHeight={headerHeight} introHeight={introHeight} error={error} {...routeProps}/>
            }
          }/>
          <Route path="/plants/read/:plantId" render={
            (routeProps) => {
              return <PlantDetails onReadPlant={this.handleReadPlant} onDeletePlant={this.handleDeletePlant} plant={plant} user={loggedInUser} headerHeight={headerHeight} introHeight={introHeight} {...routeProps}/>
            }
          }/>
          <Route path="/plants/update" render={
            (routeProps) => {
              return <UpdatePlantForm onNameChange={this.handleNameChange} onDescriptionChange={this.handleDescriptionChange} onSizeChange={this.handleSizeChange} onPriceChange={this.handlePriceChange} onLocationChange={this.handleLocationChange} onImageChange={this.handleImageChange} onUpdatePlant={this.handleUpdatePlant} plant={plant} headerHeight={headerHeight} introHeight={introHeight} {...routeProps}/>
            }
          }/>
          <Route path="/plants/checkout/:plantId" render={
            (routeProps) => {
              return <CheckoutPage onCheckout={this.handleCheckout} headerHeight={headerHeight} introHeight={introHeight} {...routeProps}/>
            }
          }/>
          {/* ---------- Requests ---------- */}
          <Route path="/requests/fetch" render={
              (routeProps) => {
                return <RequestsPage onFetchAllRequests={this.handleFetchAllRequests} onResetNewRequestsReceived={this.resetNewRequestsReceived}  user={loggedInUser} requests={requests} currentRequestsNumber={currentRequestsNumber} {...routeProps}/>
              }
          }/>
          <Route path="/requests/create" render={
            (routeProps) => {
              return <CreateRequestForm onCreateRequest={this.handleCreateRequest} onResetError={this.resetError} user={loggedInUser} error={error} {...routeProps}/>
            }
          }/>
          <Route path="/requests/read/:requestId" render={
            (routeProps) => {
              return <RequestDetails onReadRequest={this.handleReadRequest} onDeleteRequest={this.handleDeleteRequest} request={request} user={loggedInUser} {...routeProps}/>
            }
          }/>
          <Route path="/requests/update" render={
            (routeProps) => {
              return <UpdateRequestForm onCreateReply={this.handleCreateReply} onUpdateRequest={this.handleUpdateRequest} request={request} {...routeProps}/>
            }
          }/>
          {/* ---------- Authentication ---------- */}
          <Route path="/signup" render={
            (routeProps) => {
              return <SignUp onSignUp={this.handleSignUp} onResetError={this.resetError} onResetNewRequestsReceived={this.resetNewRequestsReceived} error={error} {...routeProps}/>
            }
          }/>
          <Route path="/signin" render={
            (routeProps) => {
              return <SignIn onSignIn={this.handleSignIn} onResetError={this.resetError} onResetNewRequestsReceived={this.resetNewRequestsReceived} error={error} {...routeProps}/>
            }
          }/>
          <Route path="/logout" render={
            (routeProps) => {
              return <LogOut onLogOut={this.handleLogOut} onResetNewRequestsReceived={this.resetNewRequestsReceived} {...routeProps}/>
            }
          }/>

          <Route component={NotFound}/>
        </Switch>
        <KommunicateChat/>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(App);