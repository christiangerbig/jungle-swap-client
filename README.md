# Jungle Swap

## Description

With this app you can upload your indoor plant offshoots to swap for another plant or to sell for money. You can browse for plants and purchase them if you don't have any plants of your own. If you are logged in you will be informed when you got a new request or you got a reply for your request.

## User Stories

- **Home:** As a user/anon I can scroll dowm to see more information about the app or all the plants. I can search them by name or filter them whether they like sun, shade or sun or shade.
- **Signup:** As an anon I can sign up in the platform so that I can start creating my uploads and purchase/swap plants.
- **Login:** As a user I can sign in in the platform so that I can start creating my uploads and purchase/swap plants.
- **Logout:** As a user I can logout from the platform so no one else can modify my information.
- **My plants overview** As a user I can see all the plants I have uploaded.
- **Create plant:** As a user I can upload my plants. 
- **Plant detail page:** As a user I can click on a certain plant to go to the detail page.
- **Checkout page:** As a user I can pay for a plant with my credit card
- **Update plant:** As a user I can update/edit my uploaded plants.
- **Delete plant:** As a user I can delete my uploaded plants including the pictures at cloudinary and all requests that belong to the plants.
- **Requests overview** As a user I can see all my requests for plants
- **Create request:** As a user I can create a request to swap a plant. 
- **Request detail page:** As a user I can click on a certain request to go to the detail page.
- **Reply request:** As a user I can reply a request for my plant.
- **Replies overview** As a user I can see all the replied requests for plants.
- **Delete request:** As a user I can delete a request.
- **401:** As an anom I can see a 401 page if I try to accsess a special page
- **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault

## Backlog
- Likes

# Client / Frontend

## React Router Routes (React App)
| Path                        | Component                    | Permissions                | Behavior                            |
| ----------------- | ------------------ | -----------------| -------------------- |
| `/`                         | Home, NavBar, Footer,        | public    `<AnonRoute>`    | Home page, Shows all plants         |
|                             | Chat                    |                            |                                     |
| `/auth/sign-up`             | SignUp                       | anon only `<AnonRoute>`    | Signup form, link to signin         ||                             |                              |                            | navigate to homepage after signup   |
| `/auth/sign-in`             | SignIn                       | anon only `<AnonRoute>`    | Login form, link to signup,         |
|                             |                              |                            | navigate to homepage after signin   |
| `/auth/log-out`             | n/a                          | user only `<PrivateRoute>` | Navigate to homepage after logout,  |
|                             |                              |                            | expire session                      |
| `/auth/unauthorized`        | Unauthorized                 | user only `<AnonRoute>`    | Check profile with stat information |
| `/plants/create`            | CreatePlantForm              | user only `<PrivateRoute>` | Create a plant                      |
| `/plants/fetch/:plantId`    | PlantDetails                 | user only `<PrivateRoute>` | Shows plant deails or navigate to   |
|                             |                              |                            | signup if user is not logged in     |
| `/plants/update`            | UpdatePlantForm              | user only `<PrivateRoute>` | Update/Edit an plant                |
| `/plants/checkout`          | CheckoutPage                 | user only `<PrivateRoute>` | Purchase a plant using "Stripe API" |
| `/plants/my-own`            | MyPlantsOverview             | user only `<PrivateRoute>` | Show all my uploaded plants         |
| `/messages/create`          | CreateRequestForm            | user only `<PrivateRoute>` | Create request to swap              |
| `/messages/update`          | UpdateRequestForm            | user only `<PrivateRoute>` | reply a request                     |
| `/requests/fetch-all`       | RequestsOverview             | user only `<PrivateRoute>` | Fetch all requests for the user     |
| `/requests/fetch/:messageId`| RequestDetails               | user only `<PrivateRoute>` | Shows request deails                |
| `/replies/fetch-all`        | RepliesOverview              | user only `<PrivateRoute>` | Fetch all replies for the user      |
| `/replies/fetch/:messageId` | ReplyDetails                 | user only `<PrivateRoute>` | Shows reply deails                  |

      
## Components

- About
- AllPlants
- Chat (Socket.io)
- CheckoutForm (Stripe)
- ErrorMessageOutput
- ErrorModal
- Footer
- GoBackButton
- LogOut
- MyPlantsOverview
- NavAuthentificationItems
- NavBar
- NavLoggedInUserItems
- NavAuthentificationItems
- PlantDetailsBuyerItems
- PlantDetailsCreatorItems
- PlantsOverview
- PlantThumbnail
- RepliesOverview
- ReplyTile
- RequestsOverview
- RequestTile
- SearchPlant
- Title
- WaitSpinner
- WaitSpinnerText


## Views

- CheckoutPage
- CreatePlantForm
- CreateRequestForm
- Home
- MyPlantsOverview
- NotFound
- PlantDetails
- RepliesOverview
- ReplyDetails
- RequestDetails
- RequestsOverview
- SignIn
- SignUp
- Unauthorized
- UpdatePlantForm
- UpdateRequestForm


## Services

- Auth Service
  - auth.signin(user)
  - auth.signup(user)
  - auth.logout()

- Plants Service
  - plants.filter(name) 
  - plants.create()
  - plants.details(id)
  - plants.update()
  - plants.delete(id)

- Requests Service
  - requests.create()
  - requests.details(id)
  - requests.reply(id)
  - requests.inactive(id)
  - requests.delete(id)

- Replies Service
  - replies.create()
  - replies.details(id)

- External API
  - API for purchase
  - API for chat
  - API for image upload


# Server / Backend

## Models

User model

```javascript
{
  username: {
      type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  amountOfRequests: Number,
  amountOfReplies: Number,
}
```

Plant model

```javascript
{
  name: String,
  description: String,
  size: Number,
  imageUrl: String,
  imagePublicId: String,
  location: {
    type: String,
    enum: ["Select location", "sun", "shade", "sun and shade"],
  },
  price: Number,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
}
```

Message model

```javascript
{
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  plant: {
    type: Schema.Types.ObjectId,
    ref: "plant",
  },
  request: String,
  reply: String,
  messageState: Boolean,
}
```

## API Endpoints (backend routes)

| HTTP Method | URL                     | Request Body                | Success Status  | Error Status | Description                     |
| ------ | ------------- | ----------------- | ---------- | ------- | ---------------- |
| GET         | `/auth/check-user`      | Saved session               | 200             | 401          | Check if user is logged in      |
| POST        | `/auth/sign-up`         | {name,email,password}       | 200             | 500          | Checks if fields not empty (422)|
|             |                         |                             |                 |              | and user not exists (409), then |
|             |                         |                             |                 |              | create user with encrypted pass-|
|             |                         |                             |                 |              | word, and store user in session |
| POST        | `/auth/sign-in`         | {username,password}         | 200             | 500          | Checks if fields not empty (422)|
|             |                         |                             |                 |              | if user exists (404), and if    |
|             |                         |                             |                 |              | password matches (404), then    |
|             |                         |                             |                 |              | stores user in session          |
| POST        | `/auth/log-out`         | {empty}                     | 204             |              | Logs out the user               |
| POST        | `/plants/create`        | {name,desc,type,img,size}   | 200             | 500          | Create plant and add to list    |
| GET         | `/plants/fetch-all`     | {name,desc,type,img,size}   | 200             | 500          | Fetch all plants                |
| POST        | `/plants/search`        | {name}                      | 200             | 500          | Serch a plant by name           |
| GET         | `/plants/fetch/:id`     | {plantId}                   | 200             | 500          | Show specific plant             |
| PATCH       | `/plants/update`        | {name,desc,type,img,size}   | 200             | 500          | Update plant and add to list    |
| DELETE      | `/plants/delete/:id`    | {plantId}                   | 200             | 500          | Delete plant and remove from    |
|             |                         |                             |                 |              | list                            |
| POST        | `/messages/create`      | {buyer,seller,plant,message}| 200             | 500          | Create new request              |
| GET         | `/messages/fetch-all`   | {buyer,seller,plant,message}| 200             | 500          | Fetch all requests              |
| POST        | `/messages/fetch/:id`   | {messageId}                 | 200             | 500          | Create new request              |
| POST        | `/messages/update/:id`  | {messageId}                 | 200             | 500          | Create new request              |
| POST        | `/messages/delete/:id`  | {messageId}                 | 200             | 500          | Create new request              |
| POST        | `/cloudinary/upload`    |                             | 200             |              | Upload plant picture            |
| POST        |`/cloudinary/destroy/:id`| {imagePublicId}             | 200             |              | Delete plant picture            |
| POST        | `/stripe/create-payment-intent`|                             |                 |              |                                 |
|             |                  |                             |                 |              |                                 |

## Links

### Git

[Client repository Link](https://github.com/christiangerbig/jungle-swap-client)

[Server repository Link](https://github.com/christiangerbig/jungle-swap-server)

### Heroku

[Deployed App Link](https://jungleswap.herokuapp.com/)

### Slides

[Slides Link](https://docs.google.com/presentation/d/1wS-LZpkT3e9NpOnTY1zfjTD6m7hIQNspoF00dOOaNIE/edit#slide=id.gc6f59039d_0_0)