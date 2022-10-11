import { Route, Switch, withRouter } from "react-router-dom";
import { useAppSelector } from "./hooks";
import { RootState } from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.min.css";

import NavBar from "./components/Navigation/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import SignUp from "./views/Authentification/SignUp";
import SignIn from "./views/Authentification/SignIn";
import LogOut from "./components/Authentification/LogOut";
import CreatePlantForm from "./views/Plants/CreatePlantForm";
import PlantDetails from "./views/Plants/PlantDetails";
import UpdatePlantForm from "./views/Plants/UpdatePlantForm";
import CheckoutPage from "./views/APIs/CheckoutPage";
import RequestsOverview from "./views/Requests/RequestsOverview";
import RepliesOverview from "./views/Replies/RepliesOverview";
import CreateRequestForm from "./views/Requests/CreateRequestForm";
import RequestDetails from "./views/Requests/RequestDetails";
import ReplyDetails from "./views/Replies/ReplyDetails";
import UpdateRequestForm from "./views/Requests/UpdateRequestForm";
import Unauthorized from "./views/Authentification/Unauthorized";
import NotFound from "./views/NotFound";
import KommunicateChat from "./components/APIs/Chat";
import MyPlants from "./views/Plants/MyPlantsOverview";
import ErrorModal from "./components/Modals/ErrorModal";

const App = (): JSX.Element => {
  const errorMessage = useAppSelector(
    (state: RootState) => state.jungleSwap.errorMessage
  );

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
      <Footer />
      {errorMessage && !errorMessage.includes("Form") && (
        <ErrorModal errorMessage={errorMessage} />
      )}
    </div>
  );
};

export default withRouter(App);
