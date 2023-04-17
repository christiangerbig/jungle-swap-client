import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import config from "../app/config";
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
} from "../app/typeDefinitions";
import { RootState } from "../app/store";

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
  numberOfVisibleEntries: number;

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

  // ----- Language handling -----
  isLanguageChange: boolean;

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
  numberOfVisibleEntries: 6,

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

  // ----- Language handling -----
  isLanguageChange: false,

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
      const { data } = await axios.post(`${apiPath}/auth/sign-up`, newUser);
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const signIn = createAsyncThunk(
  "jungleSwap/signIn",
  async (user: User): Promise<User | any> => {
    try {
      const { data } = await axios.post(`${apiPath}/auth/sign-in`, user, {
        withCredentials: true,
      });
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
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
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const checkUserLoggedIn = createAsyncThunk(
  "jungleSwap/checkUserLoggedIn",
  async (): Promise<User | any> => {
    try {
      const { data } = await axios.get(`${apiPath}/auth/check-user`, {
        withCredentials: true,
      });
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

// ----- Plants -----
export const createPlant = createAsyncThunk(
  "jungleSwap/createPlant",
  async (newPlant: Plant): Promise<Plant | any> => {
    try {
      const { data } = await axios.post(`${apiPath}/plants/create`, newPlant, {
        withCredentials: true,
      });
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllPlants = createAsyncThunk(
  "jungleSwap/fetchAllPlants",
  async (): Promise<Plant[] | any> => {
    try {
      const { data } = await axios.get(`${apiPath}/plants/fetch-all`);
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchQueryPlants = createAsyncThunk(
  "jungleSwap/fetchQueryPlants",
  async (query: string): Promise<Plant[] | any> => {
    try {
      const { data } = await axios.get(`${apiPath}/plants/search?q=${query}`);
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPlant = createAsyncThunk(
  "jungleSwap/fetchPlant",
  async (plantId: PlantId): Promise<Plant | any> => {
    try {
      const { data } = await axios.get(`${apiPath}/plants/fetch/${plantId}`, {
        withCredentials: true,
      });
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
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
      const { data } = await axios.patch(
        `${apiPath}/plants/update/${plantId}`,
        updatedPlant
      );
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const deletePlant = createAsyncThunk(
  "jungleSwap/deletePlant",
  async (plantId: PlantId): Promise<void | any> => {
    try {
      await axios.delete(`${apiPath}/plants/delete/${plantId}`);
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

// ----- Images -----
export const uploadPlantImage = createAsyncThunk(
  "jungleSwap/uploadPlantImage",
  async (uploadForm: FormData): Promise<any> => {
    try {
      const { data } = await axios.post(
        `${apiPath}/cloudinary/upload`,
        uploadForm
      );
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const deletePlantImage = createAsyncThunk(
  "jungleSwap/deletePlantImage",
  async (destroyImageData: DestroyImageData): Promise<void | any> => {
    try {
      await axios.post(`${apiPath}/cloudinary/destroy`, destroyImageData);
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

// ----- Payment -----
export const createPayment = createAsyncThunk(
  "jungleSwap/createPayment",
  async ({ price }: Plant): Promise<any> => {
    try {
      const { data } = await axios.post(
        `${apiPath}/stripe/create-payment-intent`,
        {
          price,
        }
      );
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

// ----- Messages -----
export const createMessage = createAsyncThunk(
  "jungleSwap/createMessage",
  async (newMessage: Message): Promise<Message | any> => {
    try {
      const { data } = await axios.post(
        `${apiPath}/messages/create`,
        newMessage,
        { withCredentials: true }
      );
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllMessages = createAsyncThunk(
  "jungleSwap/fetchAllMessages",
  async (): Promise<Message[] | any> => {
    try {
      const { data } = await axios.get(`${apiPath}/messages/fetch-all`);
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMessage = createAsyncThunk(
  "jungleSwap/fetchMessage",
  async (messageId: MessageId): Promise<Message | any> => {
    try {
      const { data } = await axios.get(
        `${apiPath}/messages/fetch/${messageId}`,
        { withCredentials: true }
      );
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
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
      const { data } = await axios.patch(
        `${apiPath}/messages/update/${messageId}`,
        updatedMessage
      );
      return data;
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "jungleSwap/deleteMessage",
  async (messageId: MessageId): Promise<void | any> => {
    try {
      await axios.delete(`${apiPath}/messages/delete/${messageId}`);
    } catch ({
      response: {
        data: { error },
      },
    }: any) {
      return rejectWithValue(error);
    }
  }
);

export const jungleSwapSlice = createSlice({
  name: "jungleSwap",
  initialState,

  reducers: {
    // ----- User authentication ------
    setIsUserChange: (state, { payload }: PayloadAction<boolean>) => {
      state.isUserChange = payload;
    },
    setLoggedInUser: (state, { payload }: PayloadAction<User | null>) => {
      state.loggedInUser = payload;
    },

    // ----- Plants ------
    setIsCreatingPlant: (state, { payload }: PayloadAction<boolean>) => {
      state.isCreatingPlant = payload;
    },
    setIsFetchingPlants: (state, { payload }: PayloadAction<boolean>) => {
      state.isFetchingPlants = payload;
    },
    setIsFetchingPlant: (state, { payload }: PayloadAction<boolean>) => {
      state.isFetchingPlant = payload;
    },
    setIsUpdatingPlant: (state, { payload }: PayloadAction<boolean>) => {
      state.isUpdatingPlant = payload;
    },
    setIsDeletingPlant: (state, { payload }: PayloadAction<boolean>) => {
      state.isDeletingPlant = payload;
    },
    addPlant: (state, { payload }: PayloadAction<Plant>) => {
      state.plants.push(payload);
    },
    setPlant: (state, { payload }: PayloadAction<Plant>) => {
      state.plant = payload;
    },
    setPlants: (state, { payload }: PayloadAction<Plant[]>) => {
      state.plants = payload;
    },
    setFilteredPlants: (state, { payload }: PayloadAction<Plant[]>) => {
      state.filteredPlants = payload;
    },
    setPlantChanges: (
      state,
      {
        payload: {
          _id,
          name,
          description,
          size,
          imageUrl,
          imagePublicId,
          location,
          price,
        },
      }: PayloadAction<Plant>
    ) => {
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
    removePlant: (state, { payload }: PayloadAction<PlantId>) => {
      state.plants = state.plants.filter(
        (plant: Plant): boolean => plant._id !== payload
      );
    },
    setNumberOfVisibleEntries: (state, { payload }: PayloadAction<number>) => {
      state.numberOfVisibleEntries = payload;
    },

    // ----- Images -----
    setIsUploadingPlantImage: (state, { payload }: PayloadAction<boolean>) => {
      state.isUploadingPlantImage = payload;
    },
    setIsDeletingPlantImage: (state, { payload }: PayloadAction<boolean>) => {
      state.isDeletingPlantImage = payload;
    },
    setDestroyImageData: (
      state,
      { payload }: PayloadAction<DestroyImageData | null>
    ) => {
      state.destroyImageData = payload;
    },

    // ----- Payment -----
    setClientSecret: (state, { payload }: PayloadAction<string>) => {
      state.clientSecret = payload;
    },

    // ----- Messages -----
    setIsCreatingMessage: (state, { payload }: PayloadAction<boolean>) => {
      state.isCreatingMessage = payload;
    },
    setIsFetchingMessages: (state, { payload }: PayloadAction<boolean>) => {
      state.isFetchingMessages = payload;
    },
    setIsFetchingMessage: (state, { payload }: PayloadAction<boolean>) => {
      state.isFetchingMessage = payload;
    },
    setIsUpdatingMessage: (state, { payload }: PayloadAction<boolean>) => {
      state.isUpdatingMessage = payload;
    },
    setIsDeletingMessage: (state, { payload }: PayloadAction<boolean>) => {
      state.isDeletingMessage = payload;
    },
    addMessage: (state, { payload }: PayloadAction<Message>) => {
      state.messages.push(payload);
    },
    setMessages: (state, { payload }: PayloadAction<Message[]>) => {
      state.messages = payload;
    },
    setMessage: (state, { payload }: PayloadAction<Message>) => {
      state.message = payload;
    },
    setMessageChanges: (
      state,
      {
        payload: { _id, buyer, seller, plant, request, reply, messageState },
      }: PayloadAction<Message>
    ) => {
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
    removeMessage: (state, { payload }: PayloadAction<MessageId>) => {
      state.messages = state.messages.filter(
        (message: Message): boolean => message._id !== payload
      );
    },

    // ----- Requests/Replies check ------
    setIsNewRequest: (state, { payload }: PayloadAction<boolean>) => {
      state.isNewRequest = payload;
    },
    setIsNewReply: (state, { payload }: PayloadAction<boolean>) => {
      state.isNewReply = payload;
    },
    setStartAmountOfRequests: (state) => {
      state.amountOfRequests = (state.loggedInUser as any).amountOfRequests;
    },
    setStartAmountOfReplies: (state) => {
      state.amountOfReplies = (state.loggedInUser as any).amountOfReplies;
    },
    setAmountOfRequests: (state, { payload }: PayloadAction<number>) => {
      state.amountOfRequests = payload;
    },
    setAmountOfReplies: (state, { payload }: PayloadAction<number>) => {
      state.amountOfReplies = payload;
    },
    decreaseAmountOfRequests: (state) => {
      state.amountOfRequests -= 1;
    },
    decreaseAmountOfReplies: (state) => {
      state.amountOfReplies -= 1;
    },

    // ----- Interval counter -----
    setIntervalId: (state, { payload }: PayloadAction<IntervalId>) => {
      state.intervalId = payload;
    },
    setDelayCounter: (state, { payload }: PayloadAction<number>) => {
      state.delayCounter = payload;
    },
    increaseDelayCounter: (state) => {
      state.delayCounter += 1;
    },

    // ----- Pages handling -----
    setTitleSectionHeight: (state, { payload }: PayloadAction<number>) => {
      state.titleSectionHeight = payload;
    },
    setAboutSectionHeight: (state, { payload }: PayloadAction<number>) => {
      state.aboutSectionHeight = payload;
    },
    scrollToAbout: (state) => {
      scroll.scrollTo(state.titleSectionHeight);
    },
    scrollToPlants: (state) => {
      scroll.scrollTo(state.titleSectionHeight + state.aboutSectionHeight);
    },

    // ----- Language handling -----
    setIsLanguageChange: (state, { payload }: PayloadAction<boolean>) => {
      state.isLanguageChange = payload;
    },

    // ----- Error handling -----
    setErrorMessage: (state, { payload }: PayloadAction<ErrorMessage>) => {
      state.errorMessage = payload;
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

const selectors = {
  // ----- User authentication -----
  selectIsUserChange: ({ jungleSwap: { isUserChange } }: RootState) =>
    isUserChange,
  selectLoggedInUser: ({ jungleSwap: { loggedInUser } }: RootState) =>
    loggedInUser,

  // ----- Plants -----
  selectIsCreatingPlant: ({ jungleSwap: { isCreatingPlant } }: RootState) =>
    isCreatingPlant,
  selectIsFetchingPlants: ({ jungleSwap: { isFetchingPlants } }: RootState) =>
    isFetchingPlants,
  selectIsFetchingPlant: ({ jungleSwap: { isFetchingPlant } }: RootState) =>
    isFetchingPlant,
  selectIsUpdatingPlant: ({ jungleSwap: { isUpdatingPlant } }: RootState) =>
    isUpdatingPlant,
  selectIsDeletingPlant: ({ jungleSwap: { isDeletingPlant } }: RootState) =>
    isDeletingPlant,
  selectPlant: ({ jungleSwap: { plant } }: RootState) => plant,
  selectPlants: ({ jungleSwap: { plants } }: RootState) => plants,
  selectfFilteredPlants: ({ jungleSwap: { filteredPlants } }: RootState) =>
    filteredPlants,
  selectNumberOfVisibleEntries: ({
    jungleSwap: { numberOfVisibleEntries },
  }: RootState) => numberOfVisibleEntries,

  // ----- Images -----
  selectIsUploadingPlantImage: ({
    jungleSwap: { isUploadingPlantImage },
  }: RootState) => isUploadingPlantImage,
  selectIsDeletingPlantImage: ({
    jungleSwap: { isDeletingPlantImage },
  }: RootState) => isDeletingPlantImage,
  selectDestroyImageData: ({ jungleSwap: { destroyImageData } }: RootState) =>
    destroyImageData,

  // ----- Payment -----
  selectClientSecret: ({ jungleSwap: { clientSecret } }: RootState) =>
    clientSecret,

  // ----- Messages -----
  selectIsCreatingMessage: ({ jungleSwap: { isCreatingMessage } }: RootState) =>
    isCreatingMessage,
  selectiIsFetchingMessages: ({
    jungleSwap: { isFetchingMessages },
  }: RootState) => isFetchingMessages,
  selectIsFetchingMessage: ({ jungleSwap: { isFetchingMessage } }: RootState) =>
    isFetchingMessage,
  selectIsUpdatingMessage: ({ jungleSwap: { isUpdatingMessage } }: RootState) =>
    isUpdatingMessage,
  selectIsDeletingMessage: ({ jungleSwap: { isDeletingMessage } }: RootState) =>
    isDeletingMessage,
  selectMessage: ({ jungleSwap: { message } }: RootState) => message,
  selectMessages: ({ jungleSwap: { messages } }: RootState) => messages,

  // ----- Requests/Replies check -----
  selectIsNewRequest: ({ jungleSwap: { isNewRequest } }: RootState) =>
    isNewRequest,
  selectIsNewReply: ({ jungleSwap: { isNewReply } }: RootState) => isNewReply,
  selectAmountOfRequests: ({ jungleSwap: { amountOfRequests } }: RootState) =>
    amountOfRequests,
  selectAmountOfReplies: ({ jungleSwap: { amountOfReplies } }: RootState) =>
    amountOfReplies,

  // ----- Interval counter -----
  selectIntervalId: ({ jungleSwap: { intervalId } }: RootState) => intervalId,
  selectDelayCounter: ({ jungleSwap: { delayCounter } }: RootState) =>
    delayCounter,

  // ----- Pages handling -----
  selectTitleSectionHeight: ({
    jungleSwap: { titleSectionHeight },
  }: RootState) => titleSectionHeight,
  selectAboutSectionHeight: ({
    jungleSwap: { aboutSectionHeight },
  }: RootState) => aboutSectionHeight,

  // ----- Language handling -----
  selectIsLanguageChange: ({ jungleSwap: { isLanguageChange } }: RootState) =>
    isLanguageChange,

  // ----- Error handling -----
  selectErrorMessage: ({ jungleSwap: { errorMessage } }: RootState) =>
    errorMessage,
};

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
  setNumberOfVisibleEntries,

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

  // ----- Language handling -----
  setIsLanguageChange,

  // ----- Error handling -----
  setErrorMessage,
} = jungleSwapSlice.actions;

// ----- Slice selectors -----
export const {
  // ----- User authentication -----
  selectIsUserChange,
  selectLoggedInUser,

  // ----- Plants -----
  selectIsCreatingPlant,
  selectIsFetchingPlants,
  selectIsFetchingPlant,
  selectIsUpdatingPlant,
  selectIsDeletingPlant,
  selectPlant,
  selectPlants,
  selectfFilteredPlants,
  selectNumberOfVisibleEntries,

  // ----- Images -----
  selectIsUploadingPlantImage,
  selectIsDeletingPlantImage,
  selectDestroyImageData,

  // ----- Payment -----
  selectClientSecret,

  // ----- Messages -----
  selectIsCreatingMessage,
  selectiIsFetchingMessages,
  selectIsFetchingMessage,
  selectIsUpdatingMessage,
  selectIsDeletingMessage,
  selectMessages,
  selectMessage,

  // ----- Requests/Replies check -----
  selectIsNewRequest,
  selectIsNewReply,
  selectAmountOfRequests,
  selectAmountOfReplies,

  // ----- Interval counter -----
  selectIntervalId,
  selectDelayCounter,

  // ----- Pages handling -----
  selectTitleSectionHeight,
  selectAboutSectionHeight,

  // ----- Language handling -----
  selectIsLanguageChange,

  // ----- Error handling -----
  selectErrorMessage,
} = selectors;

export default jungleSwapSlice.reducer;
