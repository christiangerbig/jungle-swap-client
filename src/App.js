import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
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

const App = () => {
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
  const [headerContainerHeight, setHeaderContainerHeight] = useState(0);
  const [aboutContainerHeight, setAboutContainerHeight] = useState(0);
  const [error, setError] = useState(null);

  const history = useHistory();
  const rootPath = `${config.API_URL}/api`;

  // Get height of header and about elements
  const handleGetElementsHeight = () => {
    setHeaderContainerHeight(Math.round(document.querySelector("#titleId").getBoundingClientRect().height));
    setAboutContainerHeight(Math.round(document.querySelector("#aboutId").getBoundingClientRect().height));
  }

  // Clear error message
  const handleClearError = () => setError(null)

  // ---------- Plants ----------

  // Fetch all plants
  const handleFetchAllPlants = () => {
    axios.get(`${rootPath}/plants/fetch`)
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
        axios.get(`${rootPath}/user`, { withCredentials: true })
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
      return () => intervalId && clearInterval(intervalId);
    },
    []
  );

  // Search plant
  const handleSearchPlant = event => setQuery(event.target.value)

  // Handle plant search result
  useEffect(
    () => {
      // Fetch query plants
      const handleFetchQueryPlants = () => {
        axios.get(`${rootPath}/plants/search?q=${query}`)
          .then(
            response => setPlants(response.data)
          )
          .catch(
            err => console.log("Query fetching failed", err)
          );
      }
      query ? handleFetchQueryPlants() : handleFetchAllPlants()
    },
    [query]
  );

  // Create plant
  const handleCreatePlant = event => {
    event.preventDefault();
    const { name, description, size, plantImage, location, price } = event.target;
    const image = plantImage.files[0];
    const uploadForm = new FormData();
    uploadForm.append("image", image);
    axios.post(`${rootPath}/upload`, uploadForm)
      .then(
        response => {
          const { image, imagePublicId } = response.data;
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
            `${rootPath}/plants/create`,
            newPlant,
            { withCredentials: true }
          )
            .then(
              response => {
                setPlants([response.data, ...plants]);
                history.push("/");
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
      `${rootPath}/plants/read/${plantId}`,
      { withCredentials: true }
    )
      .then(
        response => setPlant(response.data)
      )
      .catch(
        () => console.log("Read plant failed")
      );
  }

  // Plant values changed
  const handlePlantEntryChange = ({ target }, itemNumber) => {
    const clonePlant = JSON.parse(JSON.stringify(plant));
    // eslint-disable-next-line default-case
    switch (itemNumber) {
      case 0:
        clonePlant.name = target.value;
        break;
      case 1:
        clonePlant.description = target.value;
        break;
      case 2:
        clonePlant.size = target.value;
        break;
      case 3:
        clonePlant.location = target.value;
        break;
      case 4:
        clonePlant.price = target.value;
    }
    setPlant(clonePlant);
  }

  // Plant image changed
  const handleImageChange = ({ target }, plant) => {
    const image = target.files[0];
    const { imagePublicId } = plant;
    const destroyImageData = {
      imagePublicId
    }
    axios.post(
      `${rootPath}/destroy`,
      destroyImageData
    )
      .then(
        () => {
          const uploadForm = new FormData();
          uploadForm.append("image", image);
          axios.post(
            `${rootPath}/upload`,
            uploadForm
          )
            .then(
              response => {
                const clonePlant = JSON.parse(JSON.stringify(plant));
                const { imagePublicId, image } = response.data;
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
  const handleUpdatePlant = ({ _id, name, description, size, image, imagePublicId, location, price }) => {
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
      `${rootPath}/plants/update/${_id}`,
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
          history.push("/");
          scroll.scrollTo(headerContainerHeight + aboutContainerHeight);
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
      `${rootPath}/destroy`,
      destroyImageData
    )
      .then(
        () => {
          axios.delete(`${rootPath}/plants/delete/${plantId}`)
            .then(
              () => {
                setPlants(plants.filter(plant => plant._id !== plantId));
                history.push("/");
                scroll.scrollTo(headerContainerHeight + aboutContainerHeight);
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
      `${rootPath}/create-payment-intent`,
      {},
      { withCredentials: true }
    )
      .then(
        () => history.push("/")
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
        axios.get(`${rootPath}/requests/fetch`)
          .then(
            response => {
              setRequests(response.data);
              setAmountOfRequests(requests.filter(currentRequest => currentRequest.seller._id === loggedInUser._id).length);
              setIntervalId(
                setInterval(
                  () => setMinutesCounter(minutesCounter => minutesCounter += 1),
                  10000 // every minute
                )
              );
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
      axios.get(`${rootPath}/requests/fetch`)
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
    axios.get(`${rootPath}/requests/fetch`)
      .then(
        response => setRequests(response.data)
      )
      .catch(
        err => console.log("Fetching requests failed", err)
      );
  }

  // Create request
  const handleCreateRequest = (event, { _id, creator }) => {
    event.preventDefault();
    const { message } = event.target;
    const newRequest = {
      seller: creator._id,
      plant: _id,
      message: message.value
    };
    axios.post(
      `${rootPath}/requests/create`,
      newRequest,
      { withCredentials: true }
    )
      .then(
        response => {
          setRequests([response.data, ...requests]);
          history.push(`/plants/read/${_id}`);
        }
      )
      .catch(
        err => setError(err.response.data.error)
      );
  }

  // Read request
  const handleReadRequest = requestId => {
    axios.get(
      `${rootPath}/requests/read/${requestId}`,
      { withCredentials: true }
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
  const handleUpdateRequest = ({ _id, buyer, seller, plant, message, reply }) => {
    const updatedRequest = {
      buyer,
      seller,
      plant,
      message,
      reply
    };
    axios.patch(
      `${rootPath}/requests/update/${_id}`,
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
          history.push(`/requests/read/${_id}`);
        }
      )
      .catch(
        err => console.log("Update request failed", err)
      );
  }

  // Delete request
  const handleDeleteRequest = requestId => {
    axios.delete(`${rootPath}/requests/delete/${requestId}`)
      .then(
        () => {
          setRequests(requests.filter(request => request._id !== requestId));
          setAmountOfRequests(amountOfRequests => amountOfRequests -= 1);
          history.push("/requests/fetch");
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
    const { username, email, password } = event.target;
    const newUser = {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value
    };
    axios.post(
      `${rootPath}/signup`,
      newUser
    )
      .then(
        response => {
          setLoggedInUser(response.data);
          setIsUserChange(true);
          history.push("/");
        }
      )
      .catch(
        err => setError(err.response.data.error)
      );
  }

  // Signin
  const handleSignIn = event => {
    event.preventDefault();
    const { email, password } = event.target;
    const user = {
      email: email.value,
      password: password.value
    };
    axios.post(
      `${rootPath}/signin`,
      user,
      { withCredentials: true }
    )
      .then(
        response => {
          setLoggedInUser(response.data);
          setIsUserChange(true);
          history.push("/");
        }
      )
      .catch(
        err => setError(err.response.data.error)
      );
  }

  // Logout
  const handleLogOut = () => {
    axios.post(
      `${rootPath}/logout`,
      {},
      { withCredentials: true }
    )
      .then(
        () => {
          setLoggedInUser(null);
          clearInterval(intervalId);
          history.push("/");
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
        headerContainerHeight={headerContainerHeight}
        aboutContainerHeight={aboutContainerHeight}
      />
      <Switch>
        <Route exact path="/">
          <Home
            onSearchPlant={handleSearchPlant}
            onGetElementsHeight={handleGetElementsHeight}
            plants={plants}
            query={query}
            headerContainerHeight={headerContainerHeight}
          />
        </Route>
        <Route path="/plants/create">
          <CreatePlantForm
            onCreatePlant={handleCreatePlant}
            onClearError={handleClearError}
            user={loggedInUser}
            headerContainerHeight={headerContainerHeight}
            aboutContainerHeight={aboutContainerHeight}
            error={error}
          />
        </Route>
        <Route path="/plants/read/:plantId">
          <PlantDetails
            onReadPlant={handleReadPlant}
            onDeletePlant={handleDeletePlant}
            plant={plant}
            user={loggedInUser}
            headerContainerHeight={headerContainerHeight}
            aboutContainerHeight={aboutContainerHeight}
          />
        </Route>
        <Route path="/plants/update">
          <UpdatePlantForm
            onImageChange={handleImageChange}
            onPlantEntryChange={handlePlantEntryChange}
            onUpdatePlant={handleUpdatePlant}
            plant={plant}
            headerContainerHeight={headerContainerHeight}
            aboutContainerHeight={aboutContainerHeight}
          />
        </Route>
        <Route path="/plants/checkout">
          <CheckoutPage
            onCheckout={handleCheckout}
            headerContainerHeight={headerContainerHeight}
            aboutContainerHeight={aboutContainerHeight}
          />
        </Route>

        <Route path="/requests/fetch">
          <RequestsPage
            onFetchAllRequests={handleFetchAllRequests}
            onClearNewRequest={handleClearNewRequest}
            user={loggedInUser}
            requests={requests}
            amountOfRequests={amountOfRequests}
          />
        </Route>
        <Route path="/requests/create">
          <CreateRequestForm
            onCreateRequest={handleCreateRequest}
            onClearError={handleClearError}
            user={loggedInUser}
            error={error}
          />
        </Route>
        <Route path="/requests/read/:requestId">
          <RequestDetails
            onReadRequest={handleReadRequest}
            onDeleteRequest={handleDeleteRequest}
            request={request}
            user={loggedInUser}
          />
        </Route>
        <Route path="/requests/update">
          <UpdateRequestForm
            onCreateReply={handleCreateReply}
            onUpdateRequest={handleUpdateRequest}
            request={request}
          />
        </Route>

        <Route path="/signup">
          <SignUp
            onSignUp={handleSignUp}
            onClearError={handleClearError}
            onClearNewRequest={handleClearNewRequest}
            error={error}
          />
        </Route>
        <Route path="/signin">
          <SignIn
            onSignIn={handleSignIn}
            onClearError={handleClearError}
            onClearNewRequest={handleClearNewRequest}
            error={error}
          />
        </Route>
        <Route path="/logout">
          <LogOut
            onLogOut={handleLogOut}
            onClearNewRequest={handleClearNewRequest}
          />
        </Route>

        <Route component={NotFound} />
      </Switch>
      <KommunicateChat />
      <Footer />
    </div>
  );
}

export default withRouter(App);