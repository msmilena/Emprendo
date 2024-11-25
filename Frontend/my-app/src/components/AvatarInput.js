import React from "react";
import "./CSS/AvatarInput.css";

const AvatarInput = ({ label, avatar, onChange,className }) => {
  return (
    <div className={`text-input ${className}`}>
      <label>{label}</label>
      <div className="avatar--field">
        <img
          alt="avatar"
          className="avatar--image"
          src={avatar}
        ></img>
      </div>
      <div className="avatar--input">
        <label htmlFor="avatar" className="avatar--button">Cambiar imagen de perfil</label>
        <input
          id="avatar"
          type="file"
          name="avatar"
          accept="image/*"
          onChange={onChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default AvatarInput;
