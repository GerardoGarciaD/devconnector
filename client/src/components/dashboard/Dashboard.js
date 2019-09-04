import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profile";
import Spinner from "../layouts/Spinner";
import { Link } from "react-router-dom";
import DashboardAction from "./DashboardAction";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = ({
  deleteAccount,
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading }
}) => {
  // Se crea una function "componentDidMount" en la que se obtiene el perfil del usuario al momento que se renderiza el componente
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  // Si loading es true y el valor de profile es null entonces se muestra el spinner de carga
  return loading && profile === null ? (
    <Spinner></Spinner>
  ) : (
    <>
      {/* Si loading es false se muestra lo siguiente */}
      <h1 className="large text-primary"> Dashboard </h1>
      <p className="lead">
        <i className="fas fa-user"> </i>
        {/* Se verifica si es que existe el usuario, entonces se muestra el nombre */}
        Welcome {user && user.name}
      </p>
      {/* Si el usuario tiene perfil, se muestra la informacion */}
      {profile !== null ? (
        <>
          <DashboardAction></DashboardAction>
          <Experience experience={profile.experience}></Experience>
          <Education education={profile.education}></Education>
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus"></i> Delete my account
            </button>
          </div>
        </>
      ) : (
        // Si no se muestra un boton para que pueda crear un perfil
        <>
          <p> You don't have a profile yet, pleas add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create profile
          </Link>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profileReducer
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
