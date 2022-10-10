import { Route, Switch, withRouter } from "react-router-dom";
import { useAppSelector } from "./hooks";
import { RootState } from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.min.css";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import SignUp from "./views/SignUp";
import SignIn from "./views/SignIn";
import LogOut from "./components/LogOut";
import CreatePlantForm from "./views/CreatePlantForm";
import PlantDetails from "./views/PlantDetails";
import UpdatePlantForm from "./views/UpdatePlantForm";
import CheckoutPage from "./views/CheckoutPage";
import RequestsOverview from "./views/RequestsOverview";
import RepliesOverview from "./views/RepliesOverview";
import CreateRequestForm from "./views/CreateRequestForm";
import RequestDetails from "./views/RequestDetails";
import ReplyDetails from "./views/ReplyDetails";
import UpdateRequestForm from "./views/UpdateRequestForm";
import Unauthorized from "./views/Unauthorized";
import NotFound from "./views/NotFound";
import KommunicateChat from "./components/Chat";
import MyPlants from "./views/MyPlantsOverview";
import ErrorModal from "./components/ErrorModal";

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
