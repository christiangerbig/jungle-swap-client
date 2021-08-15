import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.min.css";

import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Home from "./Screens/Home";
import SignUp from "./Screens/SignUp";
import SignIn from "./Screens/SignIn";
import LogOut from "./Components/LogOut";
import CreatePlantForm from "./Screens/CreatePlantForm";
import PlantDetails from "./Screens/PlantDetails";
import UpdatePlantForm from "./Screens/UpdatePlantForm";
import CheckoutPage from "./Screens/CheckoutPage";
import RequestsPage from "./Screens/RequestsPage";
import CreateRequestForm from "./Screens/CreateRequestForm";
import RequestDetails from "./Screens/RequestDetails";
import UpdateRequestForm from "./Screens/UpdateRequestForm";
import NotFound from "./Screens/NotFound";
import KommunicateChat from "./Components/Chat";

const App = () => {
  return (
    <div class="main">
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/plants/create">
          <CreatePlantForm />
        </Route>
        <Route path="/plants/read/:plantId">
          <PlantDetails />
        </Route>
        <Route path="/plants/update">
          <UpdatePlantForm />
        </Route>
        <Route path="/plants/checkout">
          <CheckoutPage />
        </Route>

        <Route path="/requests/fetch">
          <RequestsPage />
        </Route>
        <Route path="/requests/create">
          <CreateRequestForm />
        </Route>
        <Route path="/requests/read/:requestId">
          <RequestDetails />
        </Route>
        <Route path="/requests/update">
          <UpdateRequestForm />
        </Route>

        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/logout">
          <LogOut />
        </Route>

        <Route component={NotFound} />
      </Switch>
      <KommunicateChat />
      <Footer />
    </div>
  );
}

export default withRouter(App);