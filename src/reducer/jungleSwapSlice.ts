import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import config from "../config";
import axios from "axios";
import { animateScroll as scroll } from "react-scroll";
import {
  User,
  Plant,
  PlantId,
  Message,
  MessageId,
  DestroyImageData,
  IntervalId,
} from "../typeDefinitions";

type ErrorMessage = string | null;

interface InitialState {
  // ----- User authentication -----
  isUserChange: boolean;
  loggedInUser: User | null;

  // ----- Plants -----
  isCreatingPlant: boolean;
  isFetchingPlants: boolean;
  isFetchingPlant: boolean;
  isUpdatingPlant: boolean;
  isDeletingPlant: boolean;
  plant: Plant | {};
  plants: Plant[];
  filteredPlants: Plant[];

  // ----- Images -----
  isUploadingPlantImage: boolean;
  isDeletingPlantImage: boolean;
  destroyImageData: DestroyImageData | null;

  // ----- Payment -----
  clientSecret: string;

  // ----- Messages -----
  isCreatingMessage: boolean;
  isFetchingMessages: boolean;
  isFetchingMessage: boolean;
  isUpdatingMessage: boolean;
  isDeletingMessage: boolean;
  messages: Message[];
  message: Message | {};

  // ----- Requests/Replies check -----
  isNewRequest: boolean;
  isNewReply: boolean;
  amountOfRequests: number;
  amountOfReplies: number;

  // ----- Interval counter -----
  intervalId: IntervalId;
  delayCounter: number;

  // ----- Pages handling -----
  titleSectionHeight: number;
  aboutSectionHeight: number;

  // ----- Error handling -----
  errorMessage: ErrorMessage;
}

interface UpdatePlantParameters {
  plantId: PlantId;
  updatedPlant: Plant;
}

interface UpdateMessageParameters {
  messageId: MessageId;
  updatedMessage: Message;
}

const apiPath = `${config.API_URL}/api`;

const initialState: InitialState = {
  // ----- User authentication -----
  isUserChange: false,
  loggedInUser: null,

  // ----- Plants -----
  isCreatingPlant: false,
  isFetchingPlants: false,
  isFetchingPlant: false,
  isUpdatingPlant: false,
  isDeletingPlant: false,
  plant: {},
  plants: [],
  filteredPlants: [],

  // ----- Images -----
  isUploadingPlantImage: false,
  isDeletingPlantImage: false,
  destroyImageData: null,

  // ----- Payment -----
  clientSecret: "",

  // ----- Messages -----
  isCreatingMessage: false,
  isFetchingMessages: false,
  isFetchingMessage: false,
  isUpdatingMessage: false,
  isDeletingMessage: false,
  messages: [],
  message: {},

  // ----- Requests/Replies check -----
  isNewRequest: false,
  isNewReply: false,
  amountOfRequests: 0,
  amountOfReplies: 0,

  // ----- Interval counter -----
  intervalId: null,
  delayCounter: 0,

  // ----- Pages handling -----
  titleSectionHeight: 0,
  aboutSectionHeight: 0,

  // ----- Error handling -----
  errorMessage: null,
};

const rejectWithValue = (data: any): void | PromiseLike<void> => {
  throw new Error(data);
};

// ----- User authentification -----
export const signUp = createAsyncThunk(
  "jungleSwap/signUp",
  async (newUser: User): Promise<User | any> => {
    try {
      const response = await axios.post(`${apiPath}/auth/sign-up`, newUser);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const signIn = createAsyncThunk(
  "jungleSwap/signIn",
  async (user: User): Promise<User | any> => {
    try {
      const response = await axios.post(`${apiPath}/auth/sign-in`, user, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const logOut = createAsyncThunk(
  "jungleSwap/logOut",
  async (user: User): Promise<void | any> => {
    try {
      await axios.post(`${apiPath}/auth/log-out`, user, {
        withCredentials: true,
      });
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const checkUserLoggedIn = createAsyncThunk(
  "jungleSwap/checkUserLoggedIn",
  async (): Promise<User | any> => {
    try {
      const response = await axios.get(`${apiPath}/auth/check-user`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// ----- Plants -----
export const createPlant = createAsyncThunk(
  "jungleSwap/createPlant",
  async (newPlant: Plant): Promise<Plant | any> => {
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

export const fetchAllPlants = createAsyncThunk(
  "jungleSwap/fetchAllPlants",
  async (): Promise<Plant[] | any> => {
    try {
      const response = await axios.get(`${apiPath}/plants/fetch-all`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const fetchQueryPlants = createAsyncThunk(
  "jungleSwap/fetchQueryPlants",
  async (query: string): Promise<Plant[] | any> => {
    try {
      const response = await axios.get(`${apiPath}/plants/search?q=${query}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const fetchPlant = createAsyncThunk(
  "jungleSwap/fetchPlant",
  async (plantId: PlantId): Promise<Plant | any> => {
    try {
      const response = await axios.get(`${apiPath}/plants/fetch/${plantId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const updatePlant = createAsyncThunk(
  "jungleSwap/updatePlant",
  async ({
    plantId,
    updatedPlant,
  }: UpdatePlantParameters): Promise<Plant | any> => {
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

export const deletePlant = createAsyncThunk(
  "jungleSwap/deletePlant",
  async (plantId: PlantId): Promise<void | any> => {
    try {
      await axios.delete(`${apiPath}/plants/delete/${plantId}`);
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// ----- Images -----
export const uploadPlantImage = createAsyncThunk(
  "jungleSwap/uploadPlantImage",
  async (uploadForm: FormData): Promise<any> => {
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

export const deletePlantImage = createAsyncThunk(
  "jungleSwap/deletePlantImage",
  async (destroyImageData: DestroyImageData): Promise<void | any> => {
    try {
      await axios.post(`${apiPath}/cloudinary/destroy`, destroyImageData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// ----- Payment -----
export const createPayment = createAsyncThunk(
  "jungleSwap/createPayment",
  async (plant: Plant): Promise<any> => {
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

// ----- Messages -----
export const createMessage = createAsyncThunk(
  "jungleSwap/createMessage",
  async (newMessage: Message): Promise<Message | any> => {
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

export const fetchAllMessages = createAsyncThunk(
  "jungleSwap/fetchAllMessages",
  async (): Promise<Message[] | any> => {
    try {
      const response = await axios.get(`${apiPath}/messages/fetch-all`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const fetchMessage = createAsyncThunk(
  "jungleSwap/fetchMessage",
  async (messageId: MessageId): Promise<Message | any> => {
    try {
      const response = await axios.get(
        `${apiPath}/messages/fetch/${messageId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const updateMessage = createAsyncThunk(
  "jungleSwap/updateMessage",
  async ({
    messageId,
    updatedMessage,
  }: UpdateMessageParameters): Promise<Message | any> => {
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

export const deleteMessage = createAsyncThunk(
  "jungleSwap/deleteMessage",
  async (messageId: MessageId): Promise<void | any> => {
    try {
      await axios.delete(`${apiPath}/messages/delete/${messageId}`);
    } catch (err: any) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const jungleSwapSlice = createSlice({
  name: "jungleSwap",
  initialState,

  reducers: {
    // ----- User authentication ------
    setIsUserChange: (state, action: PayloadAction<boolean>) => {
      state.isUserChange = action.payload;
    },
    setLoggedInUser: (state, action: PayloadAction<User | null>) => {
      state.loggedInUser = action.payload;
    },

    // ----- Plants ------
    setIsCreatingPlant: (state, action: PayloadAction<boolean>) => {
      state.isCreatingPlant = action.payload;
    },
    setIsFetchingPlants: (state, action: PayloadAction<boolean>) => {
      state.isFetchingPlants = action.payload;
    },
    setIsFetchingPlant: (state, action: PayloadAction<boolean>) => {
      state.isFetchingPlant = action.payload;
    },
    setIsUpdatingPlant: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingPlant = action.payload;
    },
    setIsDeletingPlant: (state, action: PayloadAction<boolean>) => {
      state.isDeletingPlant = action.payload;
    },
    addPlant: (state, action: PayloadAction<Plant>) => {
      state.plants.push(action.payload);
    },
    setPlant: (state, action: PayloadAction<Plant>) => {
      state.plant = action.payload;
    },
    setPlants: (state, action: PayloadAction<Plant[]>) => {
      state.plants = action.payload;
    },
    setFilteredPlants: (state, action: PayloadAction<Plant[]>) => {
      state.filteredPlants = action.payload;
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
    removePlant: (state, action: PayloadAction<PlantId>) => {
      state.plants = state.plants.filter(
        (plant: Plant): boolean => plant._id !== action.payload
      );
    },

    // ----- Images -----
    setIsUploadingPlantImage: (state, action: PayloadAction<boolean>) => {
      state.isUploadingPlantImage = action.payload;
    },
    setIsDeletingPlantImage: (state, action: PayloadAction<boolean>) => {
      state.isDeletingPlantImage = action.payload;
    },
    setDestroyImageData: (
      state,
      action: PayloadAction<DestroyImageData | null>
    ) => {
      state.destroyImageData = action.payload;
    },

    // ----- Payment -----
    setClientSecret: (state, action: PayloadAction<string>) => {
      state.clientSecret = action.payload;
    },

    // ----- Messages -----
    setIsCreatingMessage: (state, action: PayloadAction<boolean>) => {
      state.isCreatingMessage = action.payload;
    },
    setIsFetchingMessages: (state, action: PayloadAction<boolean>) => {
      state.isFetchingMessages = action.payload;
    },
    setIsFetchingMessage: (state, action: PayloadAction<boolean>) => {
      state.isFetchingMessage = action.payload;
    },
    setIsUpdatingMessage: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingMessage = action.payload;
    },
    setIsDeletingMessage: (state, action: PayloadAction<boolean>) => {
      state.isDeletingMessage = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload;
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
    removeMessage: (state, action: PayloadAction<MessageId>) => {
      state.messages = state.messages.filter((message: Message): boolean => {
        return message._id !== action.payload;
      });
    },

    // ----- Requests/Replies check ------
    setIsNewRequest: (state, action: PayloadAction<boolean>) => {
      state.isNewRequest = action.payload;
    },
    setIsNewReply: (state, action: PayloadAction<boolean>) => {
      state.isNewReply = action.payload;
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
    decreaseAmountOfRequests: (state) => {
      state.amountOfRequests -= 1;
    },
    decreaseAmountOfReplies: (state) => {
      state.amountOfReplies -= 1;
    },

    // ----- Interval counter -----
    setIntervalId: (state, action: PayloadAction<IntervalId>) => {
      state.intervalId = action.payload;
    },
    setDelayCounter: (state, action: PayloadAction<number>) => {
      state.delayCounter = action.payload;
    },
    increaseDelayCounter: (state) => {
      state.delayCounter += 1;
    },

    // ----- Pages handling -----
    setTitleSectionHeight: (state, action: PayloadAction<number>) => {
      state.titleSectionHeight = action.payload;
    },
    setAboutSectionHeight: (state, action: PayloadAction<number>) => {
      state.aboutSectionHeight = action.payload;
    },
    scrollToAbout: (state) => {
      scroll.scrollTo(state.titleSectionHeight);
    },
    scrollToPlants: (state) => {
      scroll.scrollTo(state.titleSectionHeight + state.aboutSectionHeight);
    },

    // ----- Error handling -----
    setErrorMessage: (state, action: PayloadAction<ErrorMessage>) => {
      state.errorMessage = action.payload;
    },
  },

  extraReducers: (builder) => {
    // ----- Plants ------
    builder.addCase(createPlant.fulfilled, (state) => {
      state.isCreatingPlant = false;
    });
    builder.addCase(createPlant.rejected, (state) => {
      state.isCreatingPlant = false;
    });
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
    builder.addCase(fetchPlant.fulfilled, (state) => {
      state.isFetchingPlant = false;
    });
    builder.addCase(fetchPlant.rejected, (state) => {
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

    // ----- Images -----
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

    // ----- Messages -----
    builder.addCase(createMessage.fulfilled, (state) => {
      state.isCreatingMessage = false;
    });
    builder.addCase(createMessage.rejected, (state) => {
      state.isCreatingMessage = false;
    });
    builder.addCase(fetchAllMessages.fulfilled, (state) => {
      state.isFetchingMessages = false;
    });
    builder.addCase(fetchAllMessages.rejected, (state) => {
      state.isFetchingMessages = false;
    });
    builder.addCase(fetchMessage.fulfilled, (state) => {
      state.isFetchingMessage = false;
    });
    builder.addCase(fetchMessage.rejected, (state) => {
      state.isFetchingMessage = false;
    });
    builder.addCase(updateMessage.fulfilled, (state) => {
      state.isUpdatingMessage = false;
    });
    builder.addCase(updateMessage.rejected, (state) => {
      state.isUpdatingMessage = false;
    });
    builder.addCase(deleteMessage.fulfilled, (state) => {
      state.isDeletingMessage = false;
    });
    builder.addCase(deleteMessage.rejected, (state) => {
      state.isDeletingMessage = false;
    });
  },
});

// ----- Slice actions -----
export const {
  // ----- User authentification -----
  setIsUserChange,
  setLoggedInUser,

  // ----- Plants -----
  setIsCreatingPlant,
  setIsFetchingPlants,
  setIsFetchingPlant,
  setIsUpdatingPlant,
  setIsDeletingPlant,
  addPlant,
  setPlants,
  setFilteredPlants,
  setPlant,
  setPlantChanges,
  removePlant,

  // ----- Images -----
  setIsUploadingPlantImage,
  setIsDeletingPlantImage,
  setDestroyImageData,

  // ----- Payment -----
  setClientSecret,

  // ----- Messages -----
  setIsCreatingMessage,
  setIsFetchingMessages,
  setIsFetchingMessage,
  setIsUpdatingMessage,
  setIsDeletingMessage,
  addMessage,
  setMessages,
  setMessage,
  setMessageChanges,
  removeMessage,

  // ----- Requests/Replies check -----
  setIsNewRequest,
  setIsNewReply,
  setStartAmountOfRequests,
  setStartAmountOfReplies,
  setAmountOfRequests,
  setAmountOfReplies,
  decreaseAmountOfRequests,
  decreaseAmountOfReplies,

  // ----- Interval counter -----
  setIntervalId,
  setDelayCounter,
  increaseDelayCounter,

  // ----- Pages handling -----
  setTitleSectionHeight,
  setAboutSectionHeight,
  scrollToAbout,
  scrollToPlants,

  // ----- Error handling -----
  setErrorMessage,
} = jungleSwapSlice.actions;

export default jungleSwapSlice.reducer;
