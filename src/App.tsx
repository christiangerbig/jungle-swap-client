import { Route, Switch, withRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.min.css";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./screens/Home";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import LogOut from "./components/LogOut";
import CreatePlantForm from "./screens/CreatePlantForm";
import PlantDetails from "./screens/PlantDetails";
import UpdatePlantForm from "./screens/UpdatePlantForm";
import CheckoutPage from "./screens/CheckoutPage";
import RequestsPage from "./screens/RequestsPage";
import RepliesPage from "./screens/RepliesPage";
import CreateRequestForm from "./screens/CreateRequestForm";
import RequestDetails from "./screens/RequestDetails";
import ReplyDetails from "./screens/ReplyDetails";
import UpdateRequestForm from "./screens/UpdateRequestForm";
import NotFound from "./screens/NotFound";
import KommunicateChat from "./components/Chat";

const App = () => {
  return (
    <div className="main">
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

        <Route path="/replies/fetch">
          <RepliesPage />
        </Route>
        <Route path="/replies/read/:requestId">
          <ReplyDetails />
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
};

export default withRouter(App);
