// src/components/SocialLinks.js
import React from "react";
import "./CSS/SocialLinks.css";
import TextInput from "./TextInput"

const SocialLinks = ({ facebook, instagram, tiktok, onChange }) => {
  return (
    <div className="social-links">
      <h5>Redes sociales</h5>
      <TextInput label="Facebook" name="facebook" value={facebook} onChange={onChange} />
      <TextInput label="Instagram" name="instagram" value={instagram} onChange={onChange} />
      <TextInput label="TikTok" name="tiktok" value={tiktok} onChange={onChange} />
    </div>
  );
};

export default SocialLinks;
