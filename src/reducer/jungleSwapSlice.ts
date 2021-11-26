import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import config from "../config";
import axios from "axios";
import { animateScroll as scroll } from "react-scroll";

const apiPath = `${config.API_URL}/api`;

export type LoggedInUser = User | null;
export type IntervalId = NodeJS.Timer | null;
export type Error = string | null;
export type PlantId = string | undefined;
export type ImagePublicId = string | undefined;
export type ImageUrl = string;
export type MessageId = string | undefined;

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

export interface UploadImageData {
  imageUrl?: ImageUrl;
  imagePublicId?: ImagePublicId;
}

export interface DestroyImageData {
  imagePublicId?: ImagePublicId;
}

interface InitialState {
  loggedInUser: LoggedInUser;
  isUserChange: boolean;
  isFetchingPlant: boolean;
  isFetchingPlants: boolean;
  isCreatingPlant: boolean;
  isUpdatingPlant: boolean;
  isDeletingPlant: boolean;
  isUploadingPlantImage: boolean;
  isDeletingPlantImage: boolean;
  plants: Plant[];
  plant: Plant | {};
  destroyImageData: DestroyImageData;
  isFetchingMessage: boolean;
  isFetchingMessages: boolean;
  isUpdatingMessage: boolean;
  isDeletingMessage: boolean;
  messages: Message[];
  message: Message | {};
  isCreatingMessage: boolean;
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

interface UpdatePlantParameters {
  plantId: PlantId;
  updatedPlant: Plant;
}

interface UpdateMessageParameters {
  messageId: MessageId;
  updatedMessage: Message;
}

// Initialize states
const initialState: InitialState = {
  loggedInUser: null,
  isUserChange: false,
  isFetchingPlant: false,
  isFetchingPlants: false,
  isCreatingPlant: false,
  isUpdatingPlant: false,
  isDeletingPlant: false,
  isUploadingPlantImage: false,
  isDeletingPlantImage: false,
  plants: [],
  plant: {},
  destroyImageData: {},
  isFetchingMessage: false,
  isFetchingMessages: false,
  isUpdatingMessage: false,
  isDeletingMessage: false,
  messages: [],
  message: {},
  isCreatingMessage: false,
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

// Error handling
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
      const response = await axios.post(
        `${apiPath}/cloudinary/upload`,
        uploadForm
      );
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
      await axios.post(`${apiPath}/cloudinary/destroy`, destroyImageData);
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
      const response = await axios.post(
        `${apiPath}/stripe/create-payment-intent`,
        {
          price: plant.price,
        }
      );
      return response.data;
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
  async (messageId: MessageId) => {
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
// Sign up
export const signUp = createAsyncThunk(
  "jungleSwap/signUp",
  async (newUser: User) => {
    try {
      const response = await axios.post(`${apiPath}/auth/signup`, newUser);
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
      const response = await axios.post(`${apiPath}/auth/signin`, user, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Log out
export const logOut = createAsyncThunk(
  "jungleSwap/logOut",
  async (user: User) => {
    try {
      await axios.post(`${apiPath}/auth/logout`, user, {
        withCredentials: true,
      });
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Check if user is logged in
export const checkUserLoggedIn = createAsyncThunk(
  "jungleSwap/checkUserLoggedIn",
  async () => {
    try {
      const response = await axios.get(`${apiPath}/auth/checkuser`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const jungleSwapSlice = createSlice({
  name: "jungleSwap",
  initialState,

  // ---------- Reducers ----------
  reducers: {
    // --------- User -----------
    setUser: (state, action: PayloadAction<User>) => {
      state.loggedInUser = action.payload;
    },

    // --------- Plants ----------
    setIsFetchingPlants: (state, action: PayloadAction<boolean>) => {
      state.isFetchingPlants = action.payload;
    },
    setPlants: (state, action: PayloadAction<Plant[]>) => {
      state.plants = action.payload;
    },
    setIsFetchingPlant: (state, action: PayloadAction<boolean>) => {
      state.isFetchingPlant = action.payload;
    },
    setIsCreatingPlant: (state, action: PayloadAction<boolean>) => {
      state.isCreatingPlant = action.payload;
    },
    setIsUpdatingPlant: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingPlant = action.payload;
    },
    setIsDeletingPlant: (state, action: PayloadAction<boolean>) => {
      state.isDeletingPlant = action.payload;
    },
    setPlant: (state, action: PayloadAction<Plant>) => {
      state.plant = action.payload;
    },
    addPlant: (state, action: PayloadAction<Plant>) => {
      state.plants.push(action.payload);
    },
    setIsUploadingPlantImage: (state, action: PayloadAction<boolean>) => {
      state.isUploadingPlantImage = action.payload;
    },
    setIsDeletingPlantImage: (state, action: PayloadAction<boolean>) => {
      state.isDeletingPlantImage = action.payload;
    },
    setDestroyImageData: (state, action: PayloadAction<DestroyImageData>) => {
      state.destroyImageData = action.payload;
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
      state.plants = state.plants.map((singlePlant: Plant): Plant => {
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
        (plant: Plant): boolean => plant._id !== action.payload
      );
    },
    setClientSecret: (state, action: PayloadAction<string>) => {
      state.clientSecret = action.payload;
    },

    // ---------- Messages ----------
    setIsFetchingMessages: (state, action: PayloadAction<boolean>) => {
      state.isFetchingMessages = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setIsFetchingMessage: (state, action: PayloadAction<boolean>) => {
      state.isFetchingMessage = action.payload;
    },
    setIsDeletingMessage: (state, action: PayloadAction<boolean>) => {
      state.isDeletingMessage = action.payload;
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
      state.messages = state.messages.filter((message: Message): boolean => {
        return message._id !== action.payload;
      });
    },
    setIsCreatingMessage: (state, action: PayloadAction<boolean>) => {
      state.isCreatingMessage = action.payload;
    },
    setIsUpdatingMessage: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingMessage = action.payload;
    },
    setStartAmountOfRequests: (state) => {
      state.amountOfRequests = (state.loggedInUser as any).amountOfRequests;
    },
    setStartAmountOfReplies: (state) => {
      state.amountOfReplies = (state.loggedInUser as any).amountOfReplies;
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
      state.amountOfRequests -= 1;
    },
    decreaseAmountOfReplies: (state) => {
      state.amountOfReplies -= 1;
    },

    // ---------- User ----------
    setLoggedInUser: (state, action: PayloadAction<LoggedInUser>) => {
      state.loggedInUser = action.payload;
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

  // ---------- Extra reducers ----------
  extraReducers: (builder) => {
    // --------- Plants ----------
    builder.addCase(fetchAllPlants.fulfilled, (state) => {
      state.isFetchingPlants = false;
    });
    builder.addCase(fetchAllPlants.rejected, (state) => {
      state.isFetchingPlants = false;
    });
    builder.addCase(fetchQueryPlants.fulfilled, (state) => {
      state.isFetchingPlants = false;
    });
    builder.addCase(fetchQueryPlants.rejected, (state) => {
      state.isFetchingPlants = false;
    });
    builder.addCase(createPlant.fulfilled, (state) => {
      state.isCreatingPlant = false;
    });
    builder.addCase(createPlant.rejected, (state) => {
      state.isCreatingPlant = false;
    });
    builder.addCase(readPlant.fulfilled, (state) => {
      state.isFetchingPlant = false;
    });
    builder.addCase(readPlant.rejected, (state) => {
      state.isFetchingPlant = false;
    });
    builder.addCase(updatePlant.fulfilled, (state) => {
      state.isUpdatingPlant = false;
    });
    builder.addCase(updatePlant.rejected, (state) => {
      state.isUpdatingPlant = false;
    });
    builder.addCase(deletePlant.fulfilled, (state) => {
      state.isDeletingPlant = false;
    });
    builder.addCase(deletePlant.rejected, (state) => {
      state.isDeletingPlant = false;
    });
    builder.addCase(uploadPlantImage.fulfilled, (state) => {
      state.isUploadingPlantImage = false;
    });
    builder.addCase(uploadPlantImage.rejected, (state) => {
      state.isUploadingPlantImage = false;
    });
    builder.addCase(deletePlantImage.fulfilled, (state) => {
      state.isDeletingPlantImage = false;
    });
    builder.addCase(deletePlantImage.rejected, (state) => {
      state.isDeletingPlantImage = false;
    });

    // ---------- Messages ----------
    builder.addCase(fetchAllMessages.fulfilled, (state) => {
      state.isFetchingMessages = false;
    });
    builder.addCase(fetchAllMessages.rejected, (state) => {
      state.isFetchingMessages = false;
    });
    builder.addCase(readMessage.fulfilled, (state) => {
      state.isFetchingMessage = false;
    });
    builder.addCase(readMessage.rejected, (state) => {
      state.isFetchingMessage = false;
    });
    builder.addCase(deleteMessage.fulfilled, (state) => {
      state.isDeletingMessage = false;
    });
    builder.addCase(deleteMessage.rejected, (state) => {
      state.isDeletingMessage = false;
    });
  },
});

// ---------- Slice actions ----------
export const {
  // ----------- User -----------
  setUser,

  // ----------- Plants ----------
  setIsFetchingPlants,
  setPlants,
  setIsFetchingPlant,
  setIsCreatingPlant,
  setIsUpdatingPlant,
  setIsDeletingPlant,
  setPlant,
  addPlant,
  setIsUploadingPlantImage,
  setIsDeletingPlantImage,
  setDestroyImageData,
  setPlantChanges,
  removePlant,
  setClientSecret,

  // ---------- Requests ----------
  setIsFetchingMessages,
  setMessages,
  setIsFetchingMessage,
  setIsDeletingMessage,
  setMessage,
  addMessage,
  setMessageChanges,
  removeMessage,
  setIsCreatingMessage,
  setIsUpdatingMessage,
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
  setIsUserChange,
  setError,

  // ---------- Pages handling ----------
  setHeaderContainerHeight,
  setAboutContainerHeight,
  scrollToAbout,
  scrollToPlants,
} = jungleSwapSlice.actions;

export default jungleSwapSlice.reducer;
