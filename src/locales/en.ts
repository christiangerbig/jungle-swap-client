const en = {
  translations: {
    /* General */
    link: {
      jungleSwap: "JungleSwap",
      allPlants: "All Plants",
      myPlants: "My Plants",
      createPlant: "Create Plant",
      requests: "Requests",
      replies: "Replies",
      logOut: "Log out",
      tryIt: "Try it!",
      signIn: "Sign in",
      signUp: "Sign up",
      details: "Details",
    },
    button: {
      signIn: "Sign in",
      signUp: "Sign up",
      create: "Create",
      update: "Update",
      save: "Save",
      delete: "Delete",
      send: "Send",
      submit: "Submit",
      buy: "Buy",
      swap: "Swap",
      reply: "Reply",
      done: "Done",
      goBack: "Back",
      proceed: "Proceed",
      takeMeHome: "Take me home",
    },
    selectLocation: {
      title: "Select location",
      sun: "sun",
      shade: "shade",
      sunAndShade: "sun and shade",
    },
    // Error messages
    errors: {
      // Authentification
      signUp: {
        form: {
          usernameMissing: "Please enter username",
          emailMissing: "Please enter email",
          passwordMissing: "Please enter password",
          emailFormatInvalid: "The email format is invalid",
          passwordInvalid:
            "The password needs to have 8 characters, a number, a special character and an uppercase alphabet",
          userAlreadyExists: "Username or email already exists",
        },
        errorWhileCreatingUser: "Error while creating user",
      },
      signIn: {
        form: {
          emailMissing: "Please enter email",
          passwordMissing: "Please enter password",
          emailFormatInvalid: "The email format is invalid",
          noMatchPasswords: "Passwords don't match",
        },
        userUnknown: "User does not exist",
      },
      logOut: {
        noUserUpdate: "Could not update user",
      },
      // Plants
      plant: {
        form: {
          nameMissing: "Please enter name",
          descriptionMissing: "Please enter description",
          sizeMissing: "Please enter size",
          locationMissing: "Please enter location",
          priceMissing: "Please enter price",
          imageMissing: "Please choose an image",
          noImageSelected: "Please choose an image to delete",
        },
        createPlantFailed: "Creating the plant failed",
        fetchPlantFailed: "Fetching the plant failed",
        fetchAllPlantsFailed: "Fetching all plants failed",
        updatePlantFailed: "Updating the plant failed",
        deletePlantFailed: "Delete plant failed",
      },
      // Messages
      message: {
        form: {
          requestTextMissing: "Please enter request text",
          replyTextMissing: "Please enter reply text"
        },
        createMessageFailed: "Creating message failed",
        fetchMessageFailed: "Fetching message failed",
        fetchAllMessagesFailed: "Fetching all messages failed",
        updateMessageFailed: "Updating the message failed",
        deleteMessageFailed: "Delete message failed",
      },
      general: "An error occured",
    },
    /* Home */
    title: {
      headline: "JungleSwap",
      subheadline: "Share your green heart",
    },
    about: {
      headline: "Welcome to JungleSwap!",
      subheadline: "Add green to your Home",
      paragraph: {
        line1: "It's easy-peasy.",
        line2: "Share your plant offshoots.",
        line3: "Make money!",
        line4: "Or swap them for another plant.",
        line5: "Don't have any baby plants?",
        line6: "You can simply shop and give a plant a new home.",
      },
    },
    allPlants: {
      headline: "Plants",
    },
    searchPlant: {
      headline: "Search a plant",
      namePlaceholder: "Enter name",
    },
    /* Authentification */
    signIn: {
      headline: "Sign In",
      email: "Email address",
      password: "Password",
      enterPlaceholder: "Enter",
    },
    signUp: {
      headline: "Sign Up",
      username: "Username",
      email: "Email address",
      password: "Password",
      enterPlaceholder: "Enter",
      alreadyAccountCreated: "Already have an account?",
    },
    /* Plants */
    myPlants: {
      headline: "My plants",
    },
    createPlantForm: {
      headline: "Create a plant",
      name: "Name",
      description: "Description",
      size: "Size (cm)",
      location: "Location",
      price: "Price (EUR)",
      image: "Image",
      enterPlaceholder: "Enter",
    },
    updatePlantForm: {
      headline: "Update your plant",
      name: "Name",
      description: "Description",
      size: "Size (cm)",
      location: "Location",
      price: "Price (EUR)",
      image: "Image",
    },
    plantThumbnail: {
      currency: "€",
    },
    plantDetails: {
      headline: "Plant details",
      name: "Name:",
      description: "Description:",
      size: "Size:",
      sizeUnit: "cm",
      likes: "Likes:",
      price: "Price:",
      currency: "€",
    },
    checkoutForm: {
      price: " Price:",
      currency: "€",
      payNow: "Pay now",
      paymentSuccessful: "Payment succeeded.",
    },
    /* Requests */
    createRequestForm: {
      headline: "Your request",
      subheadline: "for",
    },
    updateRequestForm: {
      headline: "Reply your request",
      replyPlaceholder: "Your reply",
    },
    requestsPage: {
      headline: "Requests for your plants",
    },
    requestDetails: {
      headline: "Request for",
      subheadline: "by",
      yourReply: "Your reply",
    },
    requestTile: {
      headline: "Request for",
      subheadline: "by",
    },
    /* Replies */
    repliesPage: {
      headline: "Replies for your requests",
    },
    replyDetails: {
      headline: "Your request for",
      replyBy: "Reply by",
    },
    replyTile: {
      headline: "Reply for",
      subheadline: "by",
    },
    /* Others */
    footer: {
      copyright: "©",
      appAuthor1: "Christian Gerbig",
      appAuthor2: "Lisa Montebaur",
    },
    notFound: {
      headline: "Oh-oh!",
      subheadline1: "We think you got lost in the jungle!",
      subheadline2: "404 Not Found",
    },
    unauthorized: {
      headline: "Oh-oh!",
      subheadline1: "We think you reached the forbidden part of the jungle!",
      subheadline2: "401 Unauthorized",
    },
    errorModal: {
      headline: "Oh-oh!",
      subheadline: "Something went wrong in the jungle!",
    },
  },
};

export default en;
