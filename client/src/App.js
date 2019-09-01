import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

function App() {
  return (
    <Router>
      <>
        <Navbar></Navbar>
        <Route exact path="/" component={Landing}></Route>
        <section className="container">
          <Switch>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/login" component={Login}></Route>
          </Switch>
        </section>
      </>
    </Router>
  );
}

export default App;
