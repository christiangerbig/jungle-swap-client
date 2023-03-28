import { Route, Switch, withRouter } from "react-router-dom";
import NavBar from "./components/navigation/NavBar";
import Footer from "./components/Footer";
import Home from "./views/home/Home";
import SignUp from "./views/auth/SignUp";
import SignIn from "./views/auth/SignIn";
import LogOut from "./components/auth/LogOut";
import PlantCreateForm from "./views/plants/PlantCreateForm";
import PlantDetails from "./views/plants/PlantDetails";
import PlantUpdateForm from "./views/plants/PlantUpdateForm";
import PaymentCheckoutView from "./views/apis/PaymentCheckoutView";
import RequestsView from "./views/requests/RequestsView";
import RepliesView from "./views/replies/RepliesView";
import RequestCreateForm from "./views/requests/RequestCreateForm";
import RequestDetails from "./views/requests/RequestDetails";
import ReplyDetails from "./views/replies/ReplyDetails";
import RequestUpdateForm from "./views/requests/RequestUpdateForm";
import Unauthorized from "./views/auth/Unauthorized";
import NotFound from "./views/errors/NotFound";
import KommunicateChat from "./components/apis/KommunicateChat";
import PlantsCreatedView from "./views/plants/PlantsCreatedView";
import Modals from "./components/modals/Modals";
import "bootstrap/dist/css/bootstrap.min.css";

const App = (): JSX.Element => {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        {/* Authentification */}
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

        {/* Plants */}
        <Route path="/plants/create">
          <PlantCreateForm />
        </Route>
        <Route path="/plants/fetch/:plantId">
          <PlantDetails />
        </Route>
        <Route path="/plants/update">
          <PlantUpdateForm />
        </Route>
        <Route path="/plants/checkout">
          <PaymentCheckoutView />
        </Route>
        <Route path="/plants/my-own">
          <PlantsCreatedView />
        </Route>

        {/* Messages */}
        <Route path="/messages/create">
          <RequestCreateForm />
        </Route>
        <Route path="/messages/update">
          <RequestUpdateForm />
        </Route>

        {/* Requests */}
        <Route path="/requests/fetch-all">
          <RequestsView />
        </Route>
        <Route path="/requests/fetch/:messageId">
          <RequestDetails />
        </Route>

        {/* Replies */}
        <Route path="/replies/fetch-all">
          <RepliesView />
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
