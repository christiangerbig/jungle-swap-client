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

export interface DestroyImageData {
  imagePublicId: ImagePublicId;
}

export type LoggedInUser = User | null;
export type IntervalId = NodeJS.Timer | null;
export type Error = string | null;
export type PlantId = string | undefined;
export type ImagePublicId = string | undefined;
type MessageId = string | undefined;

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

const rejectWithValue = (data: any): void | PromiseLike<void> => {
  throw new Error(data);
};

// --------- Plants ---------
// Fetch all plants
export const fetchAllPlants = createAsyncThunk(
  "jungleSwap/fetchAllPlants",
  async () => {
    try {
      const response = await axios.get(`${apiPath}/plants/fetch`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Fetch query plants
export const fetchQueryPlants = createAsyncThunk(
  "jungleSwap/fetchQueryPlants",
  async (query: string) => {
    try {
      const response = await axios.get(`${apiPath}/plants/search?q=${query}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Upload plant image
export const uploadPlantImage = createAsyncThunk(
  "jungleSwap/uploadPlantImage",
  async (uploadForm: FormData) => {
    try {
      const response = await axios.post(`${apiPath}/upload`, uploadForm);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Create plant
export const createPlant = createAsyncThunk(
  "jungleSwap/createPlant",
  async (newPlant: Plant) => {
    try {
      const response = await axios.post(`${apiPath}/plants/create`, newPlant, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Read plant
export const readPlant = createAsyncThunk(
  "jungleSwap/readPlant",
  async (plantId: PlantId) => {
    try {
      const response = await axios.get(`${apiPath}/plants/read/${plantId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Update plant
interface UpdatePlantParameters {
  plantId: PlantId;
  updatedPlant: Plant;
}

export const updatePlant = createAsyncThunk(
  "jungleSwap/updatePlant",
  async ({ plantId, updatedPlant }: UpdatePlantParameters) => {
    try {
      const response = await axios.patch(
        `${apiPath}/plants/update/${plantId}`,
        updatedPlant
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Delete plant image
export const deletePlantImage = createAsyncThunk(
  "jungleSwap/deletePlantImage",
  async (destroyImageData: DestroyImageData) => {
    try {
      await axios.post(`${apiPath}/destroy`, destroyImageData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Delete Plant
export const deletePlant = createAsyncThunk(
  "jungleSwap/deletePlant",
  async (plantId: PlantId) => {
    try {
      await axios.delete(`${apiPath}/plants/delete/${plantId}`);
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Create plant payment
export const createPayment = createAsyncThunk(
  "jungleSwap/createPayment",
  async (plant: Plant) => {
    try {
      const response = await axios.post(`${apiPath}/create-payment-intent`, {
        price: plant.price,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Pay plant
export const payPlant = createAsyncThunk(
  "jungleSwap/payPlant",
  async (): Promise<void> => {
    try {
      await axios.post(
        `${apiPath}/create-payment-intent`,
        {},
        { withCredentials: true }
      );
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// --------- Messages ----------
// Fetch all messages
export const fetchAllMessages = createAsyncThunk(
  "jungleSwap/fetchAllMessages",
  async () => {
    try {
      const response = await axios.get(`${apiPath}/messages/fetch`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Create messages
export const createMessage = createAsyncThunk(
  "jungleSwap/createMessage",
  async (newMessage: Message) => {
    try {
      const response = await axios.post(
        `${apiPath}/messages/create`,
        newMessage,
        { withCredentials: true }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Read message
export const readMessage = createAsyncThunk(
  "jungleSwap/readMessage",
  async (messageId: string) => {
    try {
      const response = await axios.get(
        `${apiPath}/messages/read/${messageId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
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
  async ({ messageId, updatedMessage }: UpdateMessageParameters) => {
    try {
      const response = await axios.patch(
        `${apiPath}/messages/update/${messageId}`,
        updatedMessage
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Delete message
export const deleteMessage = createAsyncThunk(
  "jungleSwap/deleteMessage",
  async (messageId: MessageId) => {
    try {
      await axios.delete(`${apiPath}/messages/delete/${messageId}`);
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// ---------- User authentification ----------
// Read user
export const readUser = createAsyncThunk(
  "jungleSwap/readUserData",
  async () => {
    try {
      const response = await axios.get(`${apiPath}/user`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Sign up
export const signUp = createAsyncThunk(
  "jungleSwap/signUp",
  async (newUser: User) => {
    try {
      const response = await axios.post(`${apiPath}/signup`, newUser);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Sign in
export const signIn = createAsyncThunk(
  "jungleSwap/signIn",
  async (user: User) => {
    try {
      const response = await axios.post(`${apiPath}/signin`, user, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// LogOut
export const logOut = createAsyncThunk(
  "jungleSwap/logOut",
  async (user: User) => {
    try {
      await axios.post(`${apiPath}/logout`, user, { withCredentials: true });
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
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
      state.loggedInUser &&
        (state.amountOfRequests = (state.loggedInUser as any).amountOfRequests);
    },
    setStartAmountOfReplies: (state) => {
      state.loggedInUser &&
        (state.amountOfReplies = (state.loggedInUser as any).amountOfReplies);
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
