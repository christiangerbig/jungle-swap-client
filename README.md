# Jungle Swap

## Description

With this app you can upload your indoor plant offshoots to swap for another plant or to sell for money. You can browse for plants and purchase them if you don't have any plants of your own.

## User Stories

- **Home:** As a user/anon I can a start screen and scroll dowm to see all the plants. I can filter them by name and whether they like sun or shade.
- **Signup:** As an anon I can sign up in the platform so that I can start creating my uploads and purchase/swap plants.
- **Login:** As a user I can sign in in the platform so that I can start creating my uploads and purchase/swap plants.
- **Logout:** As a user I can logout from the platform so no one else can modify my information.
- **Create plant** As a user I can upload my plants. 
- **Detail Page** As a user I can click on a certain plant to go to the detail page.
- **Update plant** As a user I can update/edit my uploaded plants.
- **Delete plant** As a user I can delete my uploaded plants.
- **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault

## Backlog
- Random Plant
- Profile
- Likes

# Client / Frontend

## React Router Routes (React App)
| Path                       | Component                      | Permissions                | Behavior                            |
| -------------------------- | ------------------------------ | ---------------------------| ----------------------------------- |
| `/`                        | SplashPage, NavBar, PlantList, | public    `<Route>`        | Home page, Shows all plants         |
|                            | SearchForm, Footer             |                            |                                     |
| `/signup`                  | SinupPage                      | anon only  `<AnonRoute>`   | Signup form, link to signin         ||                            |                                |                            | navigate to homepage after signup   |
| `/signin`                  | LoginPage                      | anon only `<AnonRoute>`    | Login form, link to signup,         |
|                            |                                |                            | navigate to homepage after signin   |
| `/logout`                  | n/a                            | user only `<PrivateRoute>` | Navigate to homepage after logout,  |
|                            |                                |                            | expire session                      |
| `/profile`                 | Profile                        | user only `<PrivateRoute>` | Check profile with stat information |
| `/plants/read/:plantId`    | NavBar, Details, FooterBar     | user only `<AnonRoute>`    | Shows plant deails or navigate to   |
|                            |                                |                            | signup if user is not logged in     |
| `/plants/create`           | NavBar, AddForm, FooterBar     | user only `<PrivateRoute>` | Create a plan                       |
| `/plants/update`           | NavBar, EditForm, FooterBar    | user only `<PrivateRoute>` | Update/Edit an plant                |
| `/plants/delete/:plantId`  | n/a redirect to Home           | user only `<PrivateRoute>` | Delete an plant                     |
| `/plants/checkout/:plantId`| NavBar, Stripe, FooterBar      | user only `<PrivateRoute>` | Purchase a plant using "Stripe API" |
| `/requests/fetch`          | NavBar, Chat, FooterBar        | user only `<PrivateRoute>` | Fetch all requests for the user     |
| `/requests/create`         | NavBar, Chat, FooterBar        | user only `<PrivateRoute>` | Create request to swap              |
      
## Components

- Home (All Plants)
- NavBar
- Footer
- Signin
- Signup
- LogOut
- CreatePlantForm
- PlantDetails
- UpdatePlantForm
- CheckoutPage (Stripe)
- CheckoutForm (Stripe)
- Chat (Socket.io)
- CreateRequestForm
- RequestsPage
- NotFound

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

- External API
  - API for purchase
  - API for chat
  - API for chatbot
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
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}
```

Plant model

```javascript
{
  name: String,
  description: String,
  size: Number,
  image: String,
  location: {
    type: String,
    enum: [
      "Select location", 
      "sun", "shade", 
      "sun and shade"
    ]
  },
  price: Number,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
}
```

Request model

```javascript
{
  buyer: {
    type: Schema.Types.ObjectId, 
    ref: "user"
  },
  seller: {
    type: Schema.Types.ObjectId, 
    ref: "user"
  },
  plant: Object,
  message: String
}
```

## API Endpoints (backend routes)

| HTTP Method | URL                     | Request Body                | Success Status  | Error Status | Description                     |
| ----------- | ----------------------- | --------------------------- | --------------- | ------------ | ------------------------------- |
| GET         | `/auth/user`            | Saved session               | 200             | 404          | Check if user is logged in and  |
|             |                         |                             |                 |              | return to profile page          |
| POST        | `/auth/signup`          | {name,email,password}       | 200             | 500          | Checks if fields not empty (422)|
|             |                         |                             |                 |              | and user not exists (409), then |
|             |                         |                             |                 |              | create user with encrypted pass-|
|             |                         |                             |                 |              | word, and store user in session |
| POST        | `/auth/signin`          | {username,password}         | 200             | 500          | Checks if fields not empty (422)|
|             |                         |                             |                 |              | if user exists (404), and if    |
|             |                         |                             |                 |              | password matches (404), then    |
|             |                         |                             |                 |              | stores user in session          |
| POST        | `/auth/logout`          | {empty}                     | 204             |              | Logs out the user               |
| POST        | `/plants/search`        | {name}                      | 200             | 500          | Serch a plant by name           |
| POST        | `/plants/create`        | {name,desc,type,img,size}   | 200             | 500          | Create plant and add to list    |
| PATCH       | `/plants/update`        | {name,desc,type,img,size}   | 200             | 500          | Update plant and add to list    |
| DELETE      | `/plants/delete/:id`    |                             | 200             | 500          | Delete plant and remove from    |
|             |                         |                             |                 |              | list                            |
| GET         | `/plants/read/:id`      | {name,desc,type,img,size}   | 200             | 500          | Show specific plant             |
| GET         | `/plants/fetch`         | {name,desc,type,img,size}   | 200             | 500          | Fetch all plants                |
| GET         | `/requests/fetch`       | {buyer,seller,plant,message}| 200             | 500          | Fetch all requests              |
| POST        | `/requests/create`      | {buyer,seller,plant,message}| 200             | 500          | Create new request              |
| POST        | `/cloudinary/upload`    |                             | 200             |              | Upload plant picture            |
| POST        | `/create-payment-intent`|                             |                 |              |                                 |

## Links

### Git

[Client repository Link](https://github.com/christiangerbig/jungle-swap-client)

[Server repository Link](https://github.com/christiangerbig/jungle-swap-server)

### Heroku

[Deployed App Link](https://jungleswap.herokuapp.com/)

### Slides

[Slides Link](https://docs.google.com/presentation/d/1wS-LZpkT3e9NpOnTY1zfjTD6m7hIQNspoF00dOOaNIE/edit#slide=id.gc6f59039d_0_0)