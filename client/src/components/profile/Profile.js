import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import { getProfileById } from "../../actions/profile";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";

const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById]);
  return (
    <>
      {profile === null || loading ? (
        <Spinner></Spinner>
      ) : (
        <>
          {" "}
          <Link to="/profiles" className="btn btn-light">
            {" "}
            Back to profiles
          </Link>{" "}
          {auth.isAuthenticated &&
            auth.loading === false &&
            // se verifica que el id del perfil del usuario logueado sea igual al id del usuario que se pasan en las props
            auth.user._id === profile.user._id && (
              <Link to="edit-profile" className="btn btn-primary">
                {" "}
                Edit Profile{" "}
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile}></ProfileTop>
            <ProfileAbout profile={profile}></ProfileAbout>
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <>
                  {" "}
                  {profile.experience.map(experience => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    ></ProfileExperience>
                  ))}{" "}
                </>
              ) : (
                <h4> No experience cretentials</h4>
              )}
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <>
                  {" "}
                  {profile.education.map(education => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    ></ProfileEducation>
                  ))}{" "}
                </>
              ) : (
                <h4> No education cretentials</h4>
              )}
            </div>

            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername}></ProfileGithub>
            )}
          </div>
        </>
      )}{" "}
    </>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profileReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProfileById }
)(Profile);
