import { Link } from "react-router-dom";

const Footer = (): JSX.Element => {
  const currentTime = new Date();
  let year = currentTime.getFullYear();

  return (
    <div className="footer-row">
      <footer>
        © {year} { }
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
