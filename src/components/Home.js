import React, { Component } from "react";
import { Link } from "react-router-dom";
import Chatbot from "./Chatbot";
import { ScrollTo } from "react-scroll-to";
import image from '../images/JungleSwap_Home.png';
import icon from '../images/JungleSwap_Icon.png';

class Home extends Component {

  render() {
    const { plants, query } = this.props;
    return (
      <div>
        {
          <header className="text-center pt-5 pb-5 headerImg">
            <div className="row my-5">
              <div className="col-6 offset-3 my-5 borderAround">
                <h2 className="title mb-2"> JungleSwap </h2>
                <h5 className="mt-3 mb-5"> Share your green heart </h5>
                <div className="mb-5">
                  <ScrollTo>
                    {
                      ({ scroll }) => (
                        <Link className="biggerFontSize" onClick={() => scroll({y: 820, smooth: true})}> Try it! </Link>
                      )
                    }
                  </ScrollTo>
                </div>
              </div>
            </div>
          </header>
        }
        <Chatbot/>
        
        <div>
          <div class="intro">
            <div class="intro-centered container">
              <div class="row">
                <div class="col-sm-6 col-md-5 col-lg-6">
                  <img class="image" src={image} alt=""></img>
                </div>
                <br/>
                <div class="intro col-sm-6 col-md-5 col-lg-6 px-5">
                    <h4> Welcome to JungleSwap! </h4>
                    <h5> Add green to your Home </h5> 
                    <p> It's easy-peasy. <br/><br/>
                    Share your plant offshoots. <br/>
                    Make money! <br/><br/>
                    Or swap them for another plant. <br/><br/>
                    Don't have any baby plants? <br/>You can simply shop and give a plant a new home. </p>
                    <img class="icon" src={icon} alt=""/>  
                </div>
              </div>
            </div>
          </div>
       
          <div className="container mt-5">
            <div className="mt-4 mb-3 pt-5">
              <h2> Plants </h2>
              <hr/>
              <h4> Search a plant </h4>            
            </div>
            <div className="mb-4">
              <input className="smallWidth form-control" type="text" placeholder="Search..." value={ query } onChange={ this.props.onSearch }/>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {
                plants.map(
                  (plant) => {
                    return (
                      <div className="col mb-5" key={ plant._id }>
                        <div className="card card-medium-width text-center">
                          <img className="card-img-top mediumPicSize" src={ plant.image } alt={ plant.name }/>
                          <div className="card-body mb-5">
                            <h5> { plant.name } </h5>
                            <p>{plant.price} €</p>
                            <Link className="btn btn-outline-dark" to={ `/plants/${ plant._id }` }> Details </Link>
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
      </div>
    );
  }
}

export default Home;