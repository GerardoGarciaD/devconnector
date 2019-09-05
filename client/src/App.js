import React, { useEffect } from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import Alert from "./components/layouts/Alert";
import CreateProfile from "./components/profile-form/CreateProfile";
import EditProfile from "./components/profile-form/EditProfile";
import AddExperience from "./components/profile-form/AddExperience";
import AddEducation from "./components/profile-form/AddEducation";
import Profiles from "./components/pofiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

//Redux
import { Provider } from "react-redux";
import store from "./store";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Funcion "componentDidMount" que obtiene la informacion del usuario
function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar></Navbar>
          <Route exact path="/" component={Landing}></Route>
          <section className="container">
            <Alert></Alert>
            <Switch>
              <Route exact path="/register" component={Register}></Route>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/profiles" component={Profiles}></Route>
              <Route exact path="/profile/:id" component={Profile}></Route>
              <PrivateRoute
                exact
                path="/dashboard"
                component={Dashboard}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/posts"
                component={Posts}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/posts/:id"
                component={Post}
              ></PrivateRoute>
            </Switch>
          </section>
        </>
      </Router>
    </Provider>
  );
}

export default App;
