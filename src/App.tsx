import { Route, Switch, withRouter } from "react-router-dom";
import NavBar from "./components/navigation/NavBar";
import Footer from "./components/Footer";
import Home from "./views/home/Home";
import SignUp from "./views/authentification/SignUp";
import SignIn from "./views/authentification/SignIn";
import LogOut from "./components/authentification/LogOut";
import CreatePlantForm from "./views/plants/PlantCreateForm";
import PlantDetails from "./views/plants/PlantDetails";
import UpdatePlantForm from "./views/plants/PlantUpdateForm";
import CheckoutPage from "./views/apis/CheckoutView";
import RequestsOverview from "./views/requests/RequestsView";
import RepliesOverview from "./views/replies/RepliesView";
import CreateRequestForm from "./views/requests/RequestCreateForm";
import RequestDetails from "./views/requests/RequestDetails";
import ReplyDetails from "./views/replies/ReplyDetails";
import UpdateRequestForm from "./views/requests/RequestUpdateForm";
import Unauthorized from "./views/authentification/Unauthorized";
import NotFound from "./views/errors/NotFound";
import KommunicateChat from "./components/apis/KommunicateChat";
import MyPlants from "./views/plants/PlantsCreatedView";
import Modals from "./components/modals/Modals";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.min.css";

const App = (): JSX.Element => {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/auth/sign-up">
          <SignUp />
        </Route>
        <Route path="/auth/sign-in">
          <SignIn />
        </Route>
        <Route path="/auth/log-out">
          <LogOut />
        </Route>
        <Route path="/auth/unauthorized">
          <Unauthorized />
        </Route>

        <Route path="/plants/create">
          <CreatePlantForm />
        </Route>
        <Route path="/plants/fetch/:plantId">
          <PlantDetails />
        </Route>
        <Route path="/plants/update">
          <UpdatePlantForm />
        </Route>
        <Route path="/plants/checkout">
          <CheckoutPage />
        </Route>
        <Route path="/plants/my-own">
          <MyPlants />
        </Route>

        <Route path="/messages/create">
          <CreateRequestForm />
        </Route>
        <Route path="/messages/update">
          <UpdateRequestForm />
        </Route>

        <Route path="/requests/fetch-all">
          <RequestsOverview />
        </Route>
        <Route path="/requests/fetch/:messageId">
          <RequestDetails />
        </Route>

        <Route path="/replies/fetch-all">
          <RepliesOverview />
        </Route>
        <Route path="/replies/fetch/:messageId">
          <ReplyDetails />
        </Route>

        <Route component={NotFound} />
      </Switch>
      <KommunicateChat />
      <Modals />
      <Footer />
    </div>
  );
};

export default withRouter(App);
