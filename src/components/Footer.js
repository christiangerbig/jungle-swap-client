import React from "react";
import {Link} from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer-row">
      <footer> 
        © 2021 
        <Link href="https://www.linkedin.com/in/christian-gerbig/"> Christian Gerbig </Link> 
        & 
        <Link href="https://www.linkedin.com/in/lisa-montebaur/"> Lisa Montebaur </Link>
      </footer>
    </div>
  );
}

export default Footer;