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
import Unauthorized from "./screens/Unauthorized";
import NotFound from "./screens/NotFound";
import KommunicateChat from "./components/Chat";

const App = (): JSX.Element => {
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

        <Route path="/messages/create">
          <CreateRequestForm />
        </Route>
        <Route path="/messages/update">
          <UpdateRequestForm />
        </Route>

        <Route path="/requests/fetch">
          <RequestsPage />
        </Route>
        <Route path="/requests/read/:messageId">
          <RequestDetails />
        </Route>

        <Route path="/replies/fetch">
          <RepliesPage />
        </Route>
        <Route path="/replies/read/:messageId">
          <ReplyDetails />
        </Route>

        <Route path="/auth/signup">
          <SignUp />
        </Route>
        <Route path="/auth/signin">
          <SignIn />
        </Route>
        <Route path="/auth/logout">
          <LogOut />
        </Route>
        <Route path="auth/unauthorized">
          <Unauthorized />
        </Route>

        <Route component={NotFound} />
      </Switch>
      <KommunicateChat />
      <Footer />
    </div>
  );
};

export default withRouter(App);
