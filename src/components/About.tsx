import plantsImage from "../images/JungleSwap_Home.png";
import plantPotIcon from "../images/JungleSwap_Icon.png";

const About = (): JSX.Element => {
  return (
    <div className="about centered container">
      <div className="row">
        <div className="col-sm-6 col-md-5 col-lg-6">
          <img src={plantsImage} alt="plants" className="image" />
        </div>
        <br />
        <div className="about col-sm-6 col-md-5 col-lg-6 px-5 noOverflow">
          <header>
            <h4> Welcome to JungleSwap! </h4>
            <h5> Add green to your Home </h5>
          </header>
          <article>
            <p>
              It"s easy-peasy. <br />
              Share your plant offshoots. <br />
              Make money! <br />
              Or swap them for another plant. <br />
              Don"t have any baby plants? <br />
              You can simply shop and give a plant a new home.
            </p>
            <img src={plantPotIcon} alt="plant pot" className="icon" />
          </article>
        </div>
      </div>
    </div>
  );
};

export default About;
