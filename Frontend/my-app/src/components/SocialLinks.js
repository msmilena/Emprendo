// src/components/SocialLinks.js
import React from "react";
import "./CSS/SocialLinks.css";
import TextInput from "./TextInput"

const SocialLinks = ({ facebook, instagram, tiktok, onChange,disabled }) => {
  return (
    <div className="social-links">
      <h5>Redes sociales</h5>
      <TextInput label="Facebook" name="facebook" value={facebook} onChange={onChange} disabled={disabled}/>
      <TextInput label="Instagram" name="instagram" value={instagram} onChange={onChange} disabled={disabled}/>
      <TextInput label="TikTok" name="tiktok" value={tiktok} onChange={onChange} disabled={disabled}/>
    </div>
  );
};

export default SocialLinks;
