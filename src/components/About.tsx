import image from "../images/JungleSwap_Home.png";
import icon from "../images/JungleSwap_Icon.png";

const About = ():JSX.Element => {
  return (
    <div className="about centered container">
      <div className="row">
        <div className="col-sm-6 col-md-5 col-lg-6">
          <img className="image" src={image} alt="plants" />
        </div>
        <br />
        <div className="about col-sm-6 col-md-5 col-lg-6 px-5 noOverflow">
          <h4> Welcome to JungleSwap! </h4>
          <h5> Add green to your Home </h5>
          <p>
            It"s easy-peasy. <br />
            Share your plant offshoots. <br />
            Make money! <br />
            Or swap them for another plant. <br />
            Don"t have any baby plants? <br />
            You can simply shop and give a plant a new home.
          </p>
          <img className="icon" src={icon} alt="icon" />
        </div>
      </div>
    </div>
  );
}

export default About;
