import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({
  // Se recibe el componente al cual se desea proteger
  component: Component,
  //   prop que se reciben de mapStateToProps
  auth: { isAuthenticated, loading },
  //   Se reciben el resto de propiedades que se manden al momento de redireccionar al componente
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loading ? (
        <Redirect to="/login"> </Redirect>
      ) : (
        <Component {...props}></Component>
      )
    }
  ></Route>
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
