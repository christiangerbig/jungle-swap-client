import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import config from "../config";
import axios from "axios";
import { animateScroll as scroll } from "react-scroll";

const apiPath = `${config.API_URL}/api`;

export interface User {
  _id?: string;
  username?: string;
  email: string;
  password: string;
  amountOfRequests?: number;
  amountOfReplies?: number;
}

export interface MessageCounters {
  amountOfRequests?: number;
  amountOfReplies?: number;
}

export interface Plant {
  _id?: string;
  name?: string;
  description?: string;
  size?: number;
  imageUrl?: string;
  imagePublicId?: string;
  location?: string;
  price?: number;
  creator?: string | User | undefined;
}

export interface Message {
  _id?: string;
  buyer?: string | User | undefined;
  seller?: string | User | undefined;
  plant?: string | Plant | undefined;
  request?: string;
  reply?: string;
  messageState?: boolean;
}

export type LoggedInUser = User | null;
export type IntervalId = NodeJS.Timer | null;
export type Error = string | null;

interface SliceState {
  isFetchingUser: boolean;
  loggedInUser: LoggedInUser;
  isUserChange: boolean;
  plants: Plant[];
  plant: Plant | {};
  messages: Message[];
  message: Message | {};
  amountOfRequests: number;
  amountOfReplies: number;
  isNewRequest: boolean;
  isNewReply: boolean;
  intervalId: IntervalId;
  delayCounter: number;
  headerContainerHeight: number;
  aboutContainerHeight: number;
  clientSecret: string;
  error: Error;
}

const initialState: SliceState = {
  isFetchingUser: true,
  loggedInUser: null,
  isUserChange: false,
  plants: [],
  plant: {},
  messages: [],
  message: {},
  amountOfRequests: 0,
  amountOfReplies: 0,
  isNewRequest: false,
  isNewReply: false,
  intervalId: null,
  delayCounter: 0,
  headerContainerHeight: 0,
  aboutContainerHeight: 0,
  clientSecret: "",
  error: null,
};

// --------- Plants ---------
// Fetch all plants
export const fetchAllPlants = createAsyncThunk(
  "jungleSwap/fetchAllPlants",
  async (_options, { dispatch }): Promise<void> => {
    try {
      const response = await axios.get(`${apiPath}/plants/fetch`);
      dispatch(setPlants(response.data));
    } catch (err) {
      console.log("Fetching plants failed", err);
    }
  }
);

// Fetch query plants
export const fetchQueryPlants = createAsyncThunk(
  "jungleSwap/fetchQueryPlants",
  async (query: string, { dispatch }): Promise<void> => {
    try {
      const response = await axios.get(`${apiPath}/plants/search?q=${query}`);
      dispatch(setPlants(response.data));
    } catch (err) {
      console.log("Fetching query plants failed", err);
    }
  }
);

// Create plant
interface CreatePlantParameters {
  uploadForm: any;
  plant: Plant;
  history: any;
}

export const createPlant = createAsyncThunk(
  "jungleSwap/createPlant",
  async (
    { uploadForm, plant, history }: CreatePlantParameters,
    { dispatch }
  ): Promise<void> => {
    const { name, description, size, location, price } = plant;
    try {
      const response = await axios.post(`${apiPath}/upload`, uploadForm);
      const { imageUrl, imagePublicId } = response.data;
      const newPlant: Plant = {
        name,
        description,
        size,
        imageUrl,
        imagePublicId,
        location,
        price,
      };
      try {
        const response = await axios.post(
          `${apiPath}/plants/create`,
          newPlant,
          { withCredentials: true }
        );
        dispatch(addPlant(response.data));
        history.push("/");
        scroll.scrollToBottom();
      } catch (err: any) {
        dispatch(setError(err.response.data.error));
      }
    } catch (err: any) {
      dispatch(setError(err.response.data.error));
    }
  }
);

// Read plant
export const readPlant = createAsyncThunk(
  "jungleSwap/readPlant",
  async (plantId: string, { dispatch }): Promise<void> => {
    try {
      const response = await axios.get(`${apiPath}/plants/read/${plantId}`, {
        withCredentials: true,
      });
      dispatch(setPlant(response.data));
    } catch {
      console.log("Read plant failed");
    }
  }
);

// Plant image change
interface DestroyImageData {
  imagePublicId: string | undefined;
}

interface ImageChangeParameters {
  destroyImageData: DestroyImageData;
  image: string;
  plant: Plant;
}

export const imageChange = createAsyncThunk(
  "jungleSwap/imageChange",
  async (
    { destroyImageData, image, plant }: ImageChangeParameters,
    { dispatch }
  ): Promise<void> => {
    try {
      await axios.post(`${apiPath}/destroy`, destroyImageData);
      try {
        const uploadForm = new FormData();
        uploadForm.append("image", image);
        const response = await axios.post(`${apiPath}/upload`, uploadForm);
        const { imagePublicId, imageUrl } = response.data;
        const clonePlant = JSON.parse(JSON.stringify(plant));
        clonePlant.imagePublicId = imagePublicId;
        clonePlant.imageUrl = imageUrl;
        dispatch(setPlant(clonePlant));
      } catch (err) {
        console.log("Image upload failed", err);
      }
    } catch (err) {
      console.log("Delete old image failed", err);
    }
  }
);

// Update plant
interface UpdatePlantParameters {
  plantId: string | undefined;
  updatedPlant: Plant;
  history: any;
}

export const updatePlant = createAsyncThunk(
  "jungleSwap/updatePlant",
  async (
    { plantId, updatedPlant, history }: UpdatePlantParameters,
    { dispatch }
  ): Promise<void> => {
    try {
      const response = await axios.patch(
        `${apiPath}/plants/update/${plantId}`,
        updatedPlant
      );
      dispatch(setPlantChanges(response.data));
      history.push("/");
      dispatch(scrollToPlants());
    } catch (err) {
      console.log("Update plant failed", err);
    }
  }
);

// Delete Plant
interface DeletePlantParameters {
  imagePublicId: string | undefined;
  plantId: string | undefined;
  history: any;
}

export const deletePlant = createAsyncThunk(
  "jungleSwap/deletePlant",
  async (
    { imagePublicId, plantId, history }: DeletePlantParameters,
    { dispatch }
  ): Promise<void> => {
    try {
      const destroyImageData = {
        imagePublicId,
      };
      await axios.post(`${apiPath}/destroy`, destroyImageData);
      try {
        await axios.delete(`${apiPath}/plants/delete/${plantId}`);
        dispatch(removePlant(plantId));
        history.push("/");
        dispatch(scrollToPlants());
      } catch (err) {
        console.log("Delete plant failed", err);
      }
    } catch (err) {
      console.log("Delete image failed", err);
    }
  }
);

// Create plant payment
export const createPayment = createAsyncThunk(
  "jungleSwap/createPayment",
  async (plant: Plant, { dispatch }): Promise<void> => {
    try {
      const response = await axios.post(`${apiPath}/create-payment-intent`, {
        price: plant.price,
      });
      dispatch(setClientSecret(response.data.clientSecret));
    } catch (err) {
      console.log("Create payment failed", err);
    }
  }
);

// Pay plant
export const payPlant = createAsyncThunk(
  "jungleSwap/payPlant",
  async (history: any, { dispatch }): Promise<void> => {
    try {
      await axios.post(
        `${apiPath}/create-payment-intent`,
        {},
        { withCredentials: true }
      );
      history.push("/");
      dispatch(scrollToPlants());
    } catch (err) {
      console.log("Checkout failed", err);
    }
  }
);

// --------- Messages ----------
// Fetch all messages
export const fetchAllMessages = createAsyncThunk(
  "jungleSwap/fetchAllMessages",
  async (isUserChange: boolean, { dispatch }): Promise<void> => {
    try {
      const response = await axios.get(`${apiPath}/messages/fetch`);
      dispatch(setMessages(response.data));
      isUserChange && dispatch(setStartAmountOfRequests());
      isUserChange && dispatch(setStartAmountOfReplies());
    } catch (err) {
      console.log("Fetching messages failed", err);
    }
  }
);

// Create messages
interface CreateMessageParameters {
  newMessage: Message;
  history: any;
}

export const createMessage = createAsyncThunk(
  "jungleSwap/createMessage",
  async (
    { newMessage, history }: CreateMessageParameters,
    { dispatch }
  ): Promise<void> => {
    try {
      const response = await axios.post(
        `${apiPath}/messages/create`,
        newMessage,
        { withCredentials: true }
      );
      dispatch(addMessage(response.data));
      history.push(`/plants/read/${response.data.plant._id}`);
    } catch (err: any) {
      dispatch(setError(err.response.data.error));
    }
  }
);

// Read message
export const readMessage = createAsyncThunk(
  "jungleSwap/readMessage",
  async (messageId: string, { dispatch }): Promise<void> => {
    try {
      const response = await axios.get(
        `${apiPath}/messages/read/${messageId}`,
        { withCredentials: true }
      );
      dispatch(setMessage(response.data));
    } catch {
      console.log("Read message failed");
    }
  }
);

// Update message
interface UpdateMessageParameters {
  messageId: string | undefined;
  updatedMessage: Message;
}

export const updateMessage = createAsyncThunk(
  "jungleSwap/updateMessage",
  async (
    { messageId, updatedMessage }: UpdateMessageParameters,
    { dispatch }
  ) => {
    try {
      const response = await axios.patch(
        `${apiPath}/messages/update/${messageId}`,
        updatedMessage
      );
      dispatch(setMessageChanges(response.data));
    } catch (err) {
      console.log("Update message failed", err);
    }
  }
);

// Delete message
interface DeleteMessageParameters {
  messageId: string | undefined;
  history: any;
}

export const deleteMessage = createAsyncThunk(
  "jungleSwap/deleteMessage",
  async (
    { messageId, history }: DeleteMessageParameters,
    { dispatch }
  ): Promise<void> => {
    try {
      await axios.delete(`${apiPath}/messages/delete/${messageId}`);
      dispatch(removeMessage(messageId));
      dispatch(decreaseAmountOfReplies());
      history && history.push("/replies/fetch");
    } catch (err) {
      console.log("Delete message failed", err);
    }
  }
);

// ---------- User authentification ----------
// Read user
export const readUser = createAsyncThunk(
  "jungleSwap/readUserData",
  async (_options, { dispatch }): Promise<void> => {
    try {
      const response = await axios.get(`${apiPath}/user`, {
        withCredentials: true,
      });
      dispatch(setLoggedInUser(response.data));
      dispatch(setIsFetchingUser(false));
    } catch (err) {
      console.log("Initializing fetching failed", err);
      dispatch(setIsFetchingUser(false));
    }
  }
);

// Sign up
interface SignUpParameters {
  newUser: User;
  history: any;
}

export const signUp = createAsyncThunk(
  "jungleSwap/signUp",
  async (
    { newUser, history }: SignUpParameters,
    { dispatch }
  ): Promise<void> => {
    try {
      const response = await axios.post(`${apiPath}/signup`, newUser);
      dispatch(setLoggedInUser(response.data));
      dispatch(setIsUserChange(true));
      history.push("/");
    } catch (err: any) {
      dispatch(setError(err.response.data.error));
    }
  }
);

// Sign in
interface SignInParameters {
  user: User;
  history: any;
}

export const signIn = createAsyncThunk(
  "jungleSwap/signIn",
  async ({ user, history }: SignInParameters, { dispatch }): Promise<void> => {
    try {
      const response = await axios.post(`${apiPath}/signin`, user, {
        withCredentials: true,
      });
      const loadedUser = response.data;
      dispatch(setLoggedInUser(loadedUser));
      dispatch(setAmountOfRequests(loadedUser.amountOfRequests));
      dispatch(setAmountOfReplies(loadedUser.amountOfReplies));
      dispatch(setIsUserChange(true));
      history.push("/");
    } catch (err: any) {
      dispatch(setError(err.response.data.error));
    }
  }
);

// LogOut
interface LogOutParameters {
  user: User | null;
  intervalId: NodeJS.Timer;
  history: any;
}

export const logOut = createAsyncThunk(
  "jungleSwap/logOut",
  async (
    { user, intervalId, history }: LogOutParameters,
    { dispatch }
  ): Promise<void> => {
    try {
      await axios.post(`${apiPath}/logout`, user, { withCredentials: true });
      dispatch(setLoggedInUser(null));
      clearInterval(intervalId);
      dispatch(setIntervalId(null));
      dispatch(setDelayCounter(0));
      dispatch(setIsNewRequest(false));
      history.push("/");
      scroll.scrollToTop();
    } catch (err) {
      console.log("Logout failed", err);
    }
  }
);

export const jungleSwapSlice = createSlice({
  name: "jungleSwap",
  initialState,
  // ---------- Reducers -----------
  reducers: {
    // --------- User -----------
    setUser: (state, action: PayloadAction<User>) => {
      state.loggedInUser = action.payload;
    },

    // --------- Plants ----------
    setPlants: (state, action: PayloadAction<Plant[]>) => {
      state.plants = action.payload;
    },
    setPlant: (state, action: PayloadAction<Plant>) => {
      state.plant = action.payload;
    },
    addPlant: (state, action: PayloadAction<Plant>) => {
      state.plants.push(action.payload);
    },
    setPlantChanges: (state, action: PayloadAction<Plant>) => {
      const {
        _id,
        name,
        description,
        size,
        imageUrl,
        imagePublicId,
        location,
        price,
      } = action.payload;
      state.plants = state.plants.map((singlePlant: Plant) => {
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
      });
    },
    removePlant: (state, action: PayloadAction<string | undefined>) => {
      state.plants = state.plants.filter(
        (plant: Plant) => plant._id !== action.payload
      );
    },
    setClientSecret: (state, action: PayloadAction<string>) => {
      state.clientSecret = action.payload;
    },

    // ---------- Messages ----------
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessageChanges: (state, action: PayloadAction<Message>) => {
      const { _id, buyer, seller, plant, request, reply, messageState } =
        action.payload;
      state.messages = state.messages.map((singleMessage) => {
        if (singleMessage._id === _id) {
          singleMessage.buyer = buyer;
          singleMessage.seller = seller;
          singleMessage.plant = plant;
          singleMessage.request = request;
          singleMessage.reply = reply;
          singleMessage.messageState = messageState;
        }
        return singleMessage;
      });
    },
    removeMessage: (state, action: PayloadAction<string | undefined>) => {
      state.messages = state.messages.filter((message: Message) => {
        return message._id !== action.payload;
      });
    },
    setStartAmountOfRequests: (state) => {
      state.loggedInUser && (state.amountOfRequests = (state.loggedInUser as any).amountOfRequests);
    },
    setStartAmountOfReplies: (state) => {
      state.loggedInUser && (state.amountOfReplies = (state.loggedInUser as any).amountOfReplies);
    },
    setAmountOfRequests: (state, action: PayloadAction<number>) => {
      state.amountOfRequests = action.payload;
    },
    setAmountOfReplies: (state, action: PayloadAction<number>) => {
      state.amountOfReplies = action.payload;
    },
    setIsNewRequest: (state, action: PayloadAction<boolean>) => {
      state.isNewRequest = action.payload;
    },
    setIsNewReply: (state, action: PayloadAction<boolean>) => {
      state.isNewReply = action.payload;
    },
    setIntervalId: (state, action: PayloadAction<IntervalId>) => {
      state.intervalId = action.payload;
    },
    setDelayCounter: (state, action: PayloadAction<number>) => {
      state.delayCounter = action.payload;
    },
    increaseDelayCounter: (state) => {
      state.delayCounter += 1;
    },
    decreaseAmountOfRequests: (state) => {
      state.amountOfRequests && (state.amountOfRequests -= 1);
    },
    decreaseAmountOfReplies: (state) => {
      state.amountOfReplies && (state.amountOfReplies -= 1);
    },

    // ---------- User authentification ----------
    setLoggedInUser: (state, action: PayloadAction<LoggedInUser>) => {
      state.loggedInUser = action.payload;
    },
    setIsFetchingUser: (state, action: PayloadAction<boolean>) => {
      state.isFetchingUser = action.payload;
    },
    setIsUserChange: (state, action: PayloadAction<boolean>) => {
      state.isUserChange = action.payload;
    },
    setError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
    },

    // ---------- Pages handling ----------
    setHeaderContainerHeight: (state, action: PayloadAction<number>) => {
      state.headerContainerHeight = action.payload;
    },
    setAboutContainerHeight: (state, action: PayloadAction<number>) => {
      state.aboutContainerHeight = action.payload;
    },
    scrollToAbout: (state) => {
      scroll.scrollTo(state.headerContainerHeight);
    },
    scrollToPlants: (state) => {
      scroll.scrollTo(state.headerContainerHeight + state.aboutContainerHeight);
    },
  },
});

export const {
  // ----------- User -----------
  setUser,

  // ----------- Plants ----------
  setPlants,
  setPlant,
  addPlant,
  setPlantChanges,
  removePlant,
  setClientSecret,

  // ---------- Requests ----------
  setMessages,
  setMessage,
  addMessage,
  setMessageChanges,
  removeMessage,
  setStartAmountOfRequests,
  setStartAmountOfReplies,
  setAmountOfRequests,
  setAmountOfReplies,
  setIsNewRequest,
  setIsNewReply,
  setIntervalId,
  setDelayCounter,
  increaseDelayCounter,
  decreaseAmountOfRequests,
  decreaseAmountOfReplies,

  // ---------- User authentification ----------
  setLoggedInUser,
  setIsFetchingUser,
  setIsUserChange,
  setError,

  // ---------- Pages handling ----------
  setHeaderContainerHeight,
  setAboutContainerHeight,
  scrollToAbout,
  scrollToPlants,
} = jungleSwapSlice.actions;

export default jungleSwapSlice.reducer;
