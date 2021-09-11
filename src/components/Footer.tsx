import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <div className="footer-row">
      <footer>
        © 2021
        <Link to={"https://www.linkedin.com/in/christian-gerbig/"}>
          Christian Gerbig
        </Link>
        &amp;
        <Link to={"https://www.linkedin.com/in/lisa-montebaur/"}>
          Lisa Montebaur
        </Link>
      </footer>
    </div>
  );
};

export default Footer;
