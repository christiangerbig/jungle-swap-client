# Jungle Swap

<br>

## Description

With this app you can upload your indoor plant offshoots to swap for another plant or to sell for money. You can browse for plants and purchase them if you don't have any plants of your own.

## User Stories

-  **Home:** As a user/anon I can a start screen and scroll dowm to see all the plants. I can filter them by name and whether they like sun or shade.
-  **Detail Page** As a user/anon I can click on a certain plant to go to the detail page.
-  **Signup:** As an anon I can sign up in the platform so that I can start creating my uploads and purchase/swap plants.
-  **Login:** As a user I can sign up in the platform so that I can start creating my uploads and purchase/swap plants.
-  **Logout:** As a user I can logout from the platform so no one else can modify my information.
-  **Add elements** As a user I can upload my plants. 
-  **Edit elements** As a user I can edit my uploaded plants.
-  **Delete elements** As a user I can delete my uploads.
-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault

## Backlog

- Random Plant
- Profile
- Likes


<br>


# Client / Frontend

## React Router Routes (React App)
| Path                      | Component                      | Permissions | Behavior                                                     |
| ------------------------- | --------------------           | ----------- | ------------------------------------------------------------ |
| `/`                       | SplashPage, NavBar,            | public     `<Route>`        | Home page, Shows all plants                               |
                            | PlantList, SearchForm, Footer  |
| `/signup`                 | SinupPage                      | anon only  `<AnonRoute>`    | Signup form, link to login, navigate to homepage after signup |
| `/login`                  | LoginPage                      | anon only `<AnonRoute>`     | Login form, link to signup, navigate to homepage after login  |
| `/logout`                 | n/a                            | user only `<PrivateRoute>`  | Navigate to homepage after logout, expire session             |
| `/details`                | NavBar, Details, FooterBar     | user only `<AnonRoute>`     | Shows plants detail                                           |
| `/add-form/:id`           | NavBar, AddForm, FooterBar     | user only `<PrivateRoute>`  | Create an element                                             |
| `/edit-form/:id`          | NavBar, EditForm, FooterBar    | user only `<PrivateRoute>`  | Edit an element                                               |
| `/delete/:id`             | n/a redirect to Home           | user only `<PrivateRoute>`  | Edit an element                                               |
| `/chat/:id`               | NavBar, Chat, FooterBar        | user only `<PrivateRoute>`  | Chat with another user to swap                                |
| `/buy/:id`                | NavBar, Stripe, FooterBar      | user only `<PrivateRoute>`  | Purchase a plant using "Stripe API"                           |
| `/profile`                | Profile                        | user only `<PrivateRoute>`  | Check profile with stat information                           |
          

## Components

- LoginPage

- SignupPage

- NavBar

- FooterBar

- ElementList (All Plants)

- SearchForm

- SearchResults

- ElementInfo (Plant Details)

- AddForm

- EditForm

- ChatForm (Socket.io)

- SellingForm (Stripe)




  

 

## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()

- Plants Service
  - plants.filter(name, location) 
  - plants.detail(id)
  - plants.add(id)
  - plants.delete(id)
  - plants.update(id)
  
- External API
  - API for purchase
  - API for chat
  - API for chatbot
  - API for image upload


<br>


# Server / Backend


## Models

User model

```javascript
{
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
}
```



Plant model

```javascript
 {
   name: {type: String, required: true},
   type: {type: String, enum:['sun', 'shade']},
   size: {type: Number},
   image: {type: String, default: img}
   description: {type, String, required: true}
   creator: {type: Schema.Types.ObjectId,ref:'User'},
 }
```

Chat model

```javascript
{
  username: {type: String, required: true, unique: true},
  message: {type: String, required: true},
  recipient: {type: Schema.Types.ObjectId,ref:'User'},
}


<br>


## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/profile    `           | Saved session                | 200            | 404          | Check if user is logged in and return profile page          |
| POST        | `/auth/signup`                | {name, email, password}      | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                 | {username, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session    |
| POST        | `/auth/logout`                | (empty)                      | 204            | 400          | Logs out the user                                          |
| POST        | `plants/search`               | {name, type}  |                | 400          | Add new backlog element and add to user 
user
| POST        | `plants/add`                  | {name, desc, type, img, size}  |                | 400          | Add new backlog element and add to user 
user 
| PATCH       | `plants/edit`                  | {name, desc, type, img, size}  |                | 400          | Update element and add to list                                      |                                              |
| DELETE      | `/plants/delete`             |                              |                | 400          | Show plants elements                                           |                                      |
| GET         | `/plant/:id`                        |                              | 201            | 400          | Show specific element                                        |
| GET         | `/all-plants`                 |                              | 200            | 400          | edit element                                                 |




<br>


## Links


### Git

The url to your repository and to your deployed project

[Client repository Link](#)

[Server repository Link](#)

[Deployed App Link](#)

### Slides

The url to your presentation slides

[Slides Link](#)