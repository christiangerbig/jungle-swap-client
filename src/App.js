import React, {useState, useEffect} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import {animateScroll as scroll} from "react-scroll";
import config from "./config";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.min.css";

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

const App = props => {
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isUserChange, setIsUserChange] = useState(false);
  const [plants, setPlants] = useState([]);
  const [query, setQuery] = useState("");
  const [plant, setPlant] = useState({});
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState({});
  const [amountOfRequests, setAmountOfRequests] = useState(0);
  const [isNewRequest, setIsNewRequest] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [minutesCounter, setMinutesCounter] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [aboutHeight, setAboutHeight] = useState(0);
  const [error, setError] = useState(null);
   
  // Get height of header and about elements
  const handleGetElementsHeight = () => {
    setHeaderHeight(Math.round(document.querySelector("#titleId").getBoundingClientRect().height));
    setAboutHeight(Math.round(document.querySelector("#aboutId").getBoundingClientRect().height));
  }

  // Clear error message
  const handleClearError = () => setError(null)

  // ---------- Plants ----------

  // Fetch all plants
  const handleFetchAllPlants = () => {
    axios.get(`${config.API_URL}/api/plants/fetch`)
      .then(
        response => setPlants(response.data)
      )
      .catch(
        err => console.log("Fetching plants failed", err)
      );
  }

  // Load plants and user data as soon as page loads
  useEffect(
    () => {
      handleFetchAllPlants();
      if (!loggedInUser) {
        axios.get(`${config.API_URL}/api/user`, {withCredentials: true})
          .then(
            response => {
              setLoggedInUser(response.data);
              setIsFetchingUser(false);
            }
          )
          .catch(
            err => {
              setIsFetchingUser(false);
              console.log("Initializing fetching failed", err);
            }
          );
      }
      return () => {
        if (intervalId) clearInterval(intervalId);
      }
    },
    []
  );

  // Fetch query plants
  const handleFetchQueryPlants = () => {
    axios.get(`${config.API_URL}/api/plants/search?q=${query}`)
      .then(
        response => setPlants(response.data)
      )
      .catch(
        err => console.log("Query fetching failed", err)
      );
  }

  // Search plant
  const handleSearchPlant = event => setQuery(event.target.value)

  // Handle plant search result
  useEffect(
    () => query ? handleFetchQueryPlants() : handleFetchAllPlants(),
    [query]
  );

  // Create plant
  const handleCreatePlant = event => {
    event.preventDefault();
    const {name, description, size, plantImage, location, price} = event.target;
    const image = plantImage.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    axios.post(`${config.API_URL}/api/upload`, uploadForm)
      .then(
        response => {
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
              response => {
                setPlants([response.data, ...plants]);
                props.history.push("/");
              } 
            )
            .catch(
              err => setError(err.response.data.error)
            );
        }
      )
      .catch(
        err => setError(err.response.data.error)
      );
  }

  // Read plant
  const handleReadPlant = plantId => {
    axios.get(
      `${config.API_URL}/api/plants/read/${plantId}`,
      {withCredentials: true}
    )
      .then(
        response => setPlant(response.data)
      )
      .catch(
        () => console.log("Read plant failed")
      );
  }

  // Plant name changed
  const handleNameChange = event => {
    const clonePlant = JSON.parse(JSON.stringify(plant));
    clonePlant.name = event.target.value;
    setPlant(clonePlant);
  }

  // Plant description changed
  const handleDescriptionChange = event => {
    const clonePlant = JSON.parse(JSON.stringify(plant));
    clonePlant.description = event.target.value;
    setPlant(clonePlant);
  }

  // Plant size changed
  const handleSizeChange = event => {
    const clonePlant = JSON.parse(JSON.stringify(plant));
    clonePlant.size = event.target.value;
    setPlant(clonePlant);
  }

  // Plant price changed
  const handlePriceChange = event => {
    const clonePlant = JSON.parse(JSON.stringify(plant));
    clonePlant.price = event.target.value;
    setPlant(clonePlant);
  }

  // Plant location changed
  const handleLocationChange = event => {
    const clonePlant = JSON.parse(JSON.stringify(plant));
    clonePlant.location = event.target.value;
    setPlant(clonePlant);
  }

  // Plant image changed
  const handleImageChange = event => {
    const image = event.target.files[0];
    const {imagePublicId} = plant;
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
              response => {
                const clonePlant = JSON.parse(JSON.stringify(plant));
                const {imagePublicId, image} = response.data;
                clonePlant.imagePublicId = imagePublicId;
                clonePlant.image = image;
                setPlant(clonePlant);
              }
            )
            .catch(
              err => console.log("Image upload failed", err)
            );
        }
      )
      .catch(
        err => console.log("Delete old image failed", err)
      );
  }

  // Update plant
  const handleUpdatePlant = plant => {
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
          setPlants(
            plants.map(
              singlePlant => {
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
            )
          );
          props.history.push("/");
          scroll.scrollTo(headerHeight + aboutHeight);
        }
      )
      .catch(
        err => console.log("Update plant failed", err)
      );
  }

  // Delete Plant
  const handleDeletePlant = (plantId, imagePublicId) => {
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
                setPlants(plants.filter(plant => plant._id !== plantId));
                props.history.push("/");
                scroll.scrollTo(headerHeight + aboutHeight);
              }
            )
            .catch(
              err => console.log("Delete plant failed", err)
            );
        }
      )
      .catch(
        err => console.log("Delete image failed", err)
      );
  }  

  // Plant payment
  const handleCheckout = () => {
    axios.post(
      `${config.API_URL}/api/create-payment-intent`, 
      {}, 
      {withCredentials: true}
    )
      .then(
        () => props.history.push("/")
      )
      .catch(
        err => console.log("Checkout failed", err)
      );
  }

  // ---------- Requests ----------

  // Start request check if user changes
  useEffect(
    () => {
      if (isUserChange) {
        setIsUserChange(false);
        axios.get(`${config.API_URL}/api/requests/fetch`)
          .then(
            response => {
              setRequests(response.data);
              setAmountOfRequests(requests.filter(currentRequest => currentRequest.seller._id === loggedInUser._id).length);
              const interval = setInterval(
                () => setMinutesCounter(minutesCounter => minutesCounter += 1), 
                10000 // every minute
              );
              setIntervalId(interval);
            }
          )
          .catch(
            err => console.log("Checking requests failed", err)
          );
      }
    },
    [isUserChange]
  );

  // Check new requests for logged in user every minute
  useEffect(
    () => {
      axios.get(`${config.API_URL}/api/requests/fetch`)
        .then(
          response => {
            setRequests(response.data);
            const currentAmountOfRequests = requests.filter(currentRequest => currentRequest.seller._id === loggedInUser._id).length;
            if (amountOfRequests < currentAmountOfRequests) {
              setAmountOfRequests(currentAmountOfRequests);
              setIsNewRequest(true);
            }
          }
        )
        .catch(
          err => console.log("Checking requests failed", err)
        );
    },
    [minutesCounter]
  );

  // Clear state for new received requests
  const handleClearNewRequest = () => setIsNewRequest(false)
  
  // Fetch all requests
  const handleFetchAllRequests = () => {
    axios.get(`${config.API_URL}/api/requests/fetch`)
      .then(
        response => setRequests(response.data)
      )
      .catch(
        err => console.log("Fetching requests failed", err)
      );
  }

  // Create request
  const handleCreateRequest = (event, plant) => {
    event.preventDefault();
    const {message} = event.target;
    const {_id, creator} = plant;
    const newRequest = {
      seller: creator._id,
      plant: _id,
      message: message.value
    };
    axios.post(
      `${config.API_URL}/api/requests/create`, 
      newRequest, 
      {withCredentials: true}
    )
      .then(
        response => {
          setRequests([response.data, ...requests]);
          props.history.push(`/plants/read/${plant._id}`);
        }
      )
      .catch(
        err => setError(err.response.data.error)
      );
  }

  // Read request
  const handleReadRequest = requestId => {
    axios.get(
      `${config.API_URL}/api/requests/read/${requestId}`,
      {withCredentials: true}
    )
      .then(
        response => setRequest(response.data)
      )
      .catch(
        () => console.log("Read request failed")
      );
  }

  // Create reply
  const handleCreateReply = event => {
    const cloneRequest = JSON.parse(JSON.stringify(request));
    cloneRequest.reply = event.target.value;
    setRequest(cloneRequest);
  }

  // Update request
  const handleUpdateRequest = request => {
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
          setRequests(
            requests.map(
              singleRequest => {
                if (singleRequest._id === _id) {
                  singleRequest.buyer = buyer;
                  singleRequest.seller = seller;
                  singleRequest.plant = plant;
                  singleRequest.message = message;
                  singleRequest.reply = reply;
                }
                return singleRequest;
              }
            )
          );
          props.history.push(`/requests/read/${_id}`);
        }
      )
      .catch(
        err => console.log("Update request failed", err)
      );
  }

  // Delete request
  const handleDeleteRequest = requestId => {
    axios.delete(`${config.API_URL}/api/requests/delete/${requestId}`)
      .then(
        () => {
          setRequests(requests.filter(request => request._id !== requestId));
          setAmountOfRequests(amountOfRequests => amountOfRequests -= 1);
          props.history.push("/requests/fetch");
        }
      )
      .catch(
        err => console.log("Delete request failed", err)
      );
  }

  // ---------- Authentification ----------

  // Signup
  const handleSignUp = event => {
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
        response => {
          setLoggedInUser(response.data);
          setIsUserChange(true);
          props.history.push("/");
        }
      )
      .catch(
        err => setError(err.response.data.error)
      );
  }

  // Signin
  const handleSignIn = event => {
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
        response => {
          setLoggedInUser(response.data);
          setIsUserChange(true);
          props.history.push("/");
        }
      )
      .catch(
        err => setError(err.response.data.error)
      );
  }

  // Logout
  const handleLogOut = () => {
    axios.post(
      `${config.API_URL}/api/logout`, 
      {}, 
      {withCredentials: true}
    )
      .then(
        () => {
          setLoggedInUser(null);
          clearInterval(intervalId);
          props.history.push("/");
        }
      )
      .catch(
        err => console.log("Logout failed", err)
      );
  }

  if (isFetchingUser) return (
    <div class="spinner-grow text-success m-5" role="status">
      <span class="visually-hidden"> Loading... </span>
    </div>
  );
  
  return (
    <div class="main">
      <NavBar 
        onLogOut={handleLogOut} 
        isNewRequest={isNewRequest} 
        user={loggedInUser} 
        headerHeight={headerHeight} 
        aboutHeight={aboutHeight}
      />
      <Switch>

        <Route exact path="/" render={
          () => {
            return (
              <Home 
                onSearchPlant={handleSearchPlant} 
                onGetElementsHeight={handleGetElementsHeight} 
                plants={plants} query={query} 
                headerHeight={headerHeight}
              />
            );
          }
        }/>
        <Route path="/plants/create" render={
          routeProps => {
            return (
              <CreatePlantForm 
                onCreatePlant={handleCreatePlant} 
                onClearError={handleClearError} 
                user={loggedInUser} 
                headerHeight={headerHeight} 
                aboutHeight={aboutHeight} 
                error={error} {...routeProps}
              />
            );
          }
        }/>
        <Route path="/plants/read/:plantId" render={
          routeProps => {
            return (
              <PlantDetails 
                onReadPlant={handleReadPlant} 
                onDeletePlant={handleDeletePlant} 
                plant={plant} user={loggedInUser} 
                headerHeight={headerHeight} 
                aboutHeight={aboutHeight} 
                {...routeProps}
              />
            );
          }
        }/>
        <Route path="/plants/update" render={
          routeProps => {
            return (
              <UpdatePlantForm 
                onNameChange={handleNameChange} 
                onDescriptionChange={handleDescriptionChange} 
                onSizeChange={handleSizeChange} 
                onPriceChange={handlePriceChange} 
                onLocationChange={handleLocationChange} 
                onImageChange={handleImageChange} 
                onUpdatePlant={handleUpdatePlant} 
                plant={plant} headerHeight={headerHeight} 
                aboutHeight={aboutHeight} 
                {...routeProps}
              />
            );
          }
        }/>
        <Route path="/plants/checkout" render={
          routeProps => {
            return (
              <CheckoutPage 
                onCheckout={handleCheckout} 
                headerHeight={headerHeight} 
                aboutHeight={aboutHeight} 
                {...routeProps}
              />
            );
          }
        }/>

        <Route path="/requests/fetch" render={
            routeProps => {
              return (
                <RequestsPage 
                  onFetchAllRequests={handleFetchAllRequests} 
                  onClearNewRequest={handleClearNewRequest}  
                  user={loggedInUser} requests={requests} 
                  amountOfRequests={amountOfRequests} 
                  {...routeProps}
                />
              );
            }
        }/>
        <Route path="/requests/create" render={
          routeProps => {
            return (
              <CreateRequestForm 
                onCreateRequest={handleCreateRequest} 
                onClearError={handleClearError} 
                user={loggedInUser} 
                error={error} 
                {...routeProps}
              />
            );
          }
        }/>
        <Route path="/requests/read/:requestId" render={
          routeProps => {
            return (
              <RequestDetails 
                onReadRequest={handleReadRequest} 
                onDeleteRequest={handleDeleteRequest} 
                request={request} 
                user={loggedInUser} 
                {...routeProps}
              />
            );
          }
        }/>
        <Route path="/requests/update" render={
          routeProps => {
            return (
              <UpdateRequestForm 
                onCreateReply={handleCreateReply} 
                onUpdateRequest={handleUpdateRequest} 
                request={request} 
                {...routeProps} 
              />
            );
          }
        }/>

        <Route path="/signup" render={
          routeProps => {
            return (
              <SignUp 
                onSignUp={handleSignUp} 
                onClearError={handleClearError} 
                onClearNewRequest={handleClearNewRequest} 
                error={error} 
                {...routeProps}
                />
            );
          }
        }/>
        <Route path="/signin" render={
          routeProps => {
            return (
              <SignIn 
                onSignIn={handleSignIn} 
                onClearError={handleClearError} 
                onClearNewRequest={handleClearNewRequest} 
                error={error} 
                {...routeProps}
              />
            );
          }
        }/>
        <Route path="/logout" render={
          routeProps => {
            return (
              <LogOut 
                onLogOut={handleLogOut} 
                onClearNewRequest={handleClearNewRequest} 
                {...routeProps}
              />
            );
          }
        }/>

        <Route component={NotFound}/>
      </Switch>
      <KommunicateChat/>
      <Footer/>
    </div>
  );
}

export default withRouter(App);