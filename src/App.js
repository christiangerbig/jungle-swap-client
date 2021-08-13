import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.min.css";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import LogOut from "./components/LogOut";
import CreatePlantForm from "./components/CreatePlantForm";
import PlantDetails from "./components/PlantDetails";
import UpdatePlantForm from "./components/UpdatePlantForm";
import CheckoutPage from "./components/CheckoutPage";
import RequestsPage from "./components/RequestsPage";
import CreateRequestForm from "./components/CreateRequestForm";
import RequestDetails from "./components/RequestDetails";
import UpdateRequestForm from "./components/UpdateRequestForm";
import NotFound from "./components/NotFound";
import KommunicateChat from "./components/Chat";

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