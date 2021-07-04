import React, { Component } from "react";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import image from "../images/JungleSwap_Home.png";
import icon from "../images/JungleSwap_Icon.png";

class Home extends Component {
  render() {
    const { plants, query, onSearchPlant } = this.props;
    if (!plants) {
      return (
        <div class="spinner-grow text-success m-5" role="status">
          <span class="visually-hidden"> Loading... </span>
        </div>
      );
    }
    return (
      <div>
        {/* Title */}
        <header className="text-center pt-5 pb-5 headerImg">
          <div className="row my-5">
            <div className="col-6 offset-3 my-5 borderAround">
              <h2 className="title mb-2"> JungleSwap </h2>
              <h5 className="mt-3 mb-5"> Share your green heart </h5>
              <div className="mb-5">
                <Link className="biggerFontSize" onClick={ () => scroll.scrollTo(800) }> Try it! </Link>
              </div>
            </div>
          </div>
        </header>
        {/* About */}
        <div className="intro">
          <div className="intro-centered container">
            <div className="row">
              <div className="col-sm-6 col-md-5 col-lg-6">
                <img className="image" src={ image } alt=""/>
              </div>
              <br />
              <div className="intro col-sm-6 col-md-5 col-lg-6 px-5">
                <h4> Welcome to JungleSwap! </h4>
                <h5> Add green to your Home </h5>
                <p> It"s easy-peasy. <br/>
                  Share your plant offshoots. <br/>
                  Make money! <br/>
                  Or swap them for another plant. <br/>
                  Don"t have any baby plants? <br/>
                  You can simply shop and give a plant a new home.
                </p>
                <img className="icon" src={ icon } alt="icon"/>
              </div>
            </div>
          </div>
        </div>
        {/* Display plants */}
        <div className="container mt-5">
          <div className="mt-5 mb-3 pt-5">
            <h2> Plants </h2>
            <hr/>
            <h4> Search a plant </h4>
          </div>
          <div className="mb-4">
            <input className="smallWidth form-control" type="text" placeholder="Search..." value={ query } onChange={ onSearchPlant }/>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {
              plants.map(
                (plant) => {
                  const { _id, name, image, price } = plant;
                  return (
                    <div className="col mb-5" key={ _id }>
                      <div className="card card-medium-width text-center">
                        <img className="card-img-top mediumPicSize" src={ image } alt={ name }/>
                        <div className="card-body mb-5">
                          <h5> { name } </h5>
                          <p> { price } € </p>
                          <Link className="btn btn-outline-dark" to={ `/plants/read/${_id}` }> Details </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Home;