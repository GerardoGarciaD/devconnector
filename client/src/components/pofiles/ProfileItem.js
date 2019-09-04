// Componente para mostrar informacion general de los perfiles

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills
  }
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="" className="round-img" />
      <div>
        <h2>{name}</h2>
        <p>
          {/* Si company existe entonces se muestra su valor */}
          {status} {company && <span> at {company} </span>}
        </p>
        {/* Si locatopm existe entonces se muestra su valor */}
        <p className="my-1"> {location && <span> {location}</span>} </p>
        {/* Aqui se redirecciona al componente profile y se pasa el id del perfil del usuario */}
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>

      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i className="fas fa-check"> {skill} </i>
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
