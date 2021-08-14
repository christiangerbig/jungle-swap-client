import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import config from "../config";
import axios from "axios";
import { animateScroll as scroll } from "react-scroll";

const initialState = {
  isFetchingUser: true,
  loggedInUser: null,
  isUserChange: false,
  plants: [],
  plant: {},
  requests: [],
  request: {},
  amountOfRequests: 0,
  isNewRequest: false,
  intervalId: null,
  minutesCounter: 0,
  headerContainerHeight: 0,
  aboutContainerHeight: 0,
  clientSecret: "",
  error: null
}

const rootPath = `${config.API_URL}/api`;

// --------- Plants ---------
// Fetch all plants
export const fetchAllPlants = createAsyncThunk(
  "jungleSwap/fetchAllPlants",
  async (options, { dispatch }) => {
    try {
      const response = await axios.get(`${rootPath}/plants/fetch`);
      dispatch(setPlants(response.data));
    }
    catch (err) {
      console.log("Fetching plants failed", err);
    }
  }
);

// Fetch query plants
export const fetchQueryPlants = createAsyncThunk(
  "jungleSwap/fetchQueryPlants",
  async (query, { dispatch }) => {
    try {
      const response = axios.get(`${rootPath}/plants/search?q=${query}`);
      dispatch(setPlants(response.data));
    }
    catch (err) {
      console.log("Fetching query plants failed", err);
    }
  }
);

// Create plant
export const createPlant = createAsyncThunk(
  "jungleSwap/createPlant",
  async ({ uploadForm, plant, history }, { dispatch }) => {
    const { name, description, size, location, price } = plant;
    try {
      const responseImage = await axios.post(
        `${rootPath}/upload`,
        uploadForm
      );
      const { imageUrl, imagePublicId } = responseImage.data;
      const newPlant = {
        name,
        description,
        size,
        imageUrl,
        imagePublicId,
        location,
        price
      };
      try {
        const responsePlant = await axios.post(
          `${rootPath}/plants/create`,
          newPlant,
          { withCredentials: true }
        );
        dispatch(addPlant(responsePlant.data));
        history.push("/");
      }
      catch (err) {
        dispatch(setError(err.responsePlant.data.error));
      }
    }
    catch (err) {
      dispatch(setError(err.responseInmage.data.error));
    }
  }
);

// Read plant
export const readPlant = createAsyncThunk(
  "jungleSwap/readPlant",
  async (plantId, { dispatch }) => {
    try {
      const response = await axios.get(
        `${rootPath}/plants/read/${plantId}`,
        { withCredentials: true }
      );
      dispatch(setPlant(response.data));
    }
    catch {
      console.log("Read plant failed");
    }
  }
);

// Plant image change
export const imageChange = createAsyncThunk(
  "jungleSwap/imageChange",
  async ({ destroyImageData, image, plant }, { dispatch }) => {
    try {
      await axios.post(
        `${rootPath}/destroy`,
        destroyImageData
      );
      try {
        const uploadForm = new FormData();
        uploadForm.append("image", image);
        const response = await axios.post(
          `${rootPath}/upload`,
          uploadForm
        );
        const { imagePublicId, imageUrl } = response.data;
        const clonePlant = JSON.parse(JSON.stringify(plant));
        clonePlant.imagePublicId = imagePublicId;
        clonePlant.imageUrl = imageUrl;
        dispatch(setPlant(clonePlant));
      }
      catch (err) {
        console.log("Image upload failed", err);
      }
    }
    catch (err) {
      console.log("Delete old image failed", err);
    }
  }
);

// Update plant
export const updatePlant = createAsyncThunk(
  "jungleSwap/updatePlant",
  async ({ plantId, updatedPlant, history }, { dispatch }) => {
    try {
      const response = await axios.patch(
        `${rootPath}/plants/update/${plantId}`,
        updatedPlant
      );
      dispatch(setPlantChanges(response.data));
      history.push("/");
      dispatch(scrollToPlants());
    }
    catch (err) {
      console.log("Update plant failed", err);
    }
  }
);

// Delete Plant
export const deletePlant = createAsyncThunk(
  "jungleSwap/deletePlant",
  async ({ imagePublicId, plantId, history }, { dispatch }) => {
    try {
      const destroyImageData = {
        imagePublicId
      }
      await axios.post(
        `${rootPath}/destroy`,
        destroyImageData
      );
      try {
        await axios.delete(`${rootPath}/plants/delete/${plantId}`);
        dispatch(removePlant(plantId));
        history.push("/");
        dispatch(scrollToPlants());
      }
      catch (err) {
        console.log("Delete plant failed", err);
      }
    }
    catch (err) {
      console.log("Delete image failed", err);
    }
  }
);

// Create plant payment
export const createPayment = createAsyncThunk(
  "jungleSwap/createPayment",
  async (plant, { dispatch }) => {
    try {
      const response = await axios.post(
        `${rootPath}/create-payment-intent`,
        { price: plant.price }
      );
      dispatch(setClientSecret(response.data.clientSecret));
    }
    catch (err) {
      console.log("Create payment failed", err);
    }
  }
);

// Pay plant
export const payPlant = createAsyncThunk(
  "jungleSwap/payPlant",
  async ({ history }, { dispatch }) => {
    try {
      await axios.post(
        `${rootPath}/create-payment-intent`,
        {},
        { withCredentials: true }
      );
      history.push("/");
      dispatch(scrollToPlants());
    }
    catch (err) {
      console.log("Checkout failed", err);
    }
  }
);

// --------- Requests ----------
// Fetch all requests
export const fetchAllRequests = createAsyncThunk(
  "jungleSwap/fetchAllRequests",
  async (options, { dispatch }) => {
    try {
      const response = await axios.get(`${rootPath}/requests/fetch`);
      dispatch(setRequests(response.data));
    }
    catch (err) {
      console.log("Fetching requests failed", err);
    }
  }
);

// Create request
export const createRequest = createAsyncThunk(
  "jungleSwap/createRequest",
  async ({ newRequest, history }, { dispatch }) => {
    try {
      const response = await axios.post(
        `${rootPath}/requests/create`,
        newRequest,
        { withCredentials: true }
      );
      dispatch(addRequest(response.data));
      history.push(`/plants/read/${response.data.plant._id}`);
    }
    catch (err) {
      dispatch(setError(err.response.data.error));
    }
  }
);

// Read request
export const readRequest = createAsyncThunk(
  "jungleSwap/readRequest",
  async (requestId, { dispatch }) => {
    try {
      const response = await axios.get(
        `${rootPath}/requests/read/${requestId}`,
        { withCredentials: true }
      );
      dispatch(setRequest(response.data));
    }
    catch {
      console.log("Read request failed");
    }
  }
);

// Update request
export const updateRequest = createAsyncThunk(
  "jungleSwap/updateRequest",
  async ({ requestId, updatedRequest, history }, { dispatch }) => {
    try {
      const response = await axios.patch(
        `${rootPath}/requests/update/${requestId}`,
        updatedRequest
      );
      dispatch(setRequestChanges(response.data));
      history.push(`/requests/read/${requestId}`);
    }
    catch (err) {
      console.log("Update request failed", err);
    }
  }
);

// Delete request
export const deleteRequest = createAsyncThunk(
  "jungleSwap/deleteRequest",
  async ({ requestId, history }, { dispatch }) => {
    try {
      await axios.delete(`${rootPath}/requests/delete/${requestId}`);
      dispatch(removeRequest(requestId));
      history.push("/requests/fetch");
    }
    catch (err) {
      console.log("Delete request failed", err);
    }
  }
);

// ---------- User authentification ----------
// Read user
export const readUser = createAsyncThunk(
  "jungleSwap/readUserData",
  async (options, { dispatch }) => {
    try {
      const response = await axios.get(
        `${rootPath}/user`,
        { withCredentials: true }
      );
      dispatch(setLoggedInUser(response.data));
      dispatch(setIsFetchingUser(false));
    }
    catch (err) {
      console.log("Initializing fetching failed", err);
      dispatch(setIsFetchingUser(false));
    }
  }
);

// Sign up
export const signUp = createAsyncThunk(
  "jungleSwap/signUp",
  async ({ newUser, history }, { dispatch }) => {
    try {
      const response = await axios.post(
        `${rootPath}/signup`,
        newUser
      );
      dispatch(setLoggedInUser(response.data));
      dispatch(setIsUserChange(true));
      history.push("/");
    }
    catch (err) {
      dispatch(setError(err.response.data.error));
    }
  }
);

// Sign in
export const signIn = createAsyncThunk(
  "jungleSwap/signIn",
  async ({ user, history }, { dispatch }) => {
    try {
      const response = await axios.post(
        `${rootPath}/signin`,
        user,
        { withCredentials: true }
      );
      dispatch(setLoggedInUser(response.data));
      dispatch(setIsUserChange(true));
      history.push("/");
    }
    catch (err) {
      dispatch(setError(err.response.data.error));
    }
  }
);

// LogOut
export const logOut = createAsyncThunk(
  "jungleSwap/logOut",
  async ({ intervalId, history }, { dispatch }) => {
    try {
      await axios.post(
        `${rootPath}/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(setLoggedInUser(null));
      clearInterval(intervalId);
      dispatch(setIntervalId(null));
      dispatch(setMinutesCounter(0));
      dispatch(setIsNewRequest(false));
      history.push("/");
      scroll.scrollToTop();
    }
    catch (err) {
      console.log("Logout failed", err);
    }
  }
);


// ---------- Slices -----------
export const jungleSwapSlice = createSlice({
  name: "jungleSwap",
  initialState,
  reducers: {

    // --------- Plants ----------
    setPlants: (state, action) => {
      state.plants = action.payload;
    },
    setPlant: (state, action) => {
      state.plant = action.payload;
    },
    addPlant: (state, action) => {
      state.plants.push(action.payload);
    },
    setPlantChanges: (state, action) => {
      const { _id, name, description, size, imageUrl, imagePublicId, location, price } = action.payload;
      state.plants = state.plants.map(
        singlePlant => {
          if (singlePlant._id === _id) {
            singlePlant.name = name;
            singlePlant.description = description;
            singlePlant.size = size;
            singlePlant.imageUrl = imageUrl;
            singlePlant.imagePublicId = imagePublicId;
            singlePlant.location = location;
            singlePlant.price = price;
          }
          return singlePlant;
        }
      );
    },
    removePlant: (state, action) => {
      state.plants = state.plants.filter(plant => plant._id !== action.payload);
    },
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
    },

    // ---------- Requests ----------
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setRequest: (state, action) => {
      state.request = action.payload;
    },
    addRequest: (state, action) => {
      state.requests.push(action.payload);
    },
    setRequestChanges: (state, action) => {
      const { _id, buyer, seller, plant, message, reply } = action.payload;
      state.requests = state.requests.map(
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
    },
    removeRequest: (state, action) => {
      state.requests = state.requests.filter(request => request._id !== action.payload);
    },
    setAmountOfRequests: (state, action) => {
      state.amountOfRequests = action.payload;
    },
    setIsNewRequest: (state, action) => {
      state.isNewRequest = action.payload;
    },
    setIntervalId: (state, action) => {
      state.intervalId = action.payload;
    },
    setMinutesCounter: (state, action) => {
      state.minutesCounter = action.payload;
    },
    increaseMinutesCounter: (state, action) => {
      let minutesCounter = state.minutesCounter;
      minutesCounter += 1;
      state.minutesCounter = minutesCounter;
    },
    decreaseAmountOfRequests: (state, action) => {
      let amountOfRequests = state.amountOfRequests;
      amountOfRequests -= 1;
      state.amountOfRequests = amountOfRequests;
    },


    // ---------- User authentification ----------
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    setIsFetchingUser: (state, action) => {
      state.isFetchingUser = action.payload;
    },
    setIsUserChange: (state, action) => {
      state.isUserChange = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // ---------- HTML elements ----------
    setHeaderContainerHeight: (state, action) => {
      state.headerContainerHeight = action.payload;
    },
    setAboutContainerHeight: (state, action) => {
      state.aboutContainerHeight = action.payload;
    },
    scrollToAbout: (state, action) => {
      scroll.scrollTo(state.headerContainerHeight);
    },
    scrollToPlants: (state, action) => {
      scroll.scrollTo((state.headerContainerHeight + state.aboutContainerHeight));
    },

  }
});

export const {

  // ----------- Plants ----------
  setPlants,
  setPlant,
  addPlant,
  setPlantChanges,
  removePlant,
  setPaymentPromise,
  setClientSecret,

  // ---------- Requests ----------
  setRequests,
  setRequest,
  addRequest,
  setRequestChanges,
  removeRequest,
  setAmountOfRequests,
  setIsNewRequest,
  setIntervalId,
  setMinutesCounter,
  increaseMinutesCounter,
  decreaseAmountOfRequests,

  // ---------- User authentification ----------
  setLoggedInUser,
  setIsFetchingUser,
  setIsUserChange,
  setError,

  // ---------- HTML elements ----------
  setHeaderContainerHeight,
  setAboutContainerHeight,
  scrollToAbout,
  scrollToPlants,

} = jungleSwapSlice.actions;

export default jungleSwapSlice.reducer;