import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllPlants,
  fetchQueryPlants,
  readUser,
  setHeaderContainerHeight,
  setAboutContainerHeight,
  scrollToAbout,
  Plant,
} from "../reducer/jungleSwapSlice";
import image from "../images/JungleSwap_Home.png";
import icon from "../images/JungleSwap_Icon.png";
import { RootState } from "../store";

const Home = (): JSX.Element => {
  const isFetchingUser = useSelector(
    (state: RootState) => state.jungleSwap.isFetchingUser
  );
  const loggedInUser = useSelector(
    (state: RootState) => state.jungleSwap.loggedInUser
  );
  const plants = useSelector((state: RootState) => state.jungleSwap.plants);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const elementRef = useRef([]);

  // Load plants and user data as soon as page loads
  useEffect(() => {
    dispatch(fetchAllPlants());
    !loggedInUser && dispatch(readUser());
    const headerElementHeight = Math.round(
      (elementRef.current[0] as any).getBoundingClientRect().height
    );
    dispatch(setHeaderContainerHeight(headerElementHeight));
    const aboutElementHeight = Math.round(
      (elementRef.current[1] as any).getBoundingClientRect().height
    );
    dispatch(setAboutContainerHeight(aboutElementHeight));
  }, []);

  // Handle plant search result if user types in query
  useEffect(() => {
    query ? dispatch(fetchQueryPlants(query)) : dispatch(fetchAllPlants());
  }, [query]);

  return (
    <div>
      {!plants && (
        <div className="spinner-grow text-success m-5" role="status">
          <span className="visually-hidden">
            <br /> <br /> Loading plants...
          </span>
        </div>
      )}

      {isFetchingUser && (
        <div className="spinner-grow text-success m-5" role="status">
          <span className="visually-hidden">
            <br /> <br /> Loading user data...
          </span>
        </div>
      )}

      <header
        className="text-center pt-5 pb-5 headerImg"
        ref={(element) => ((elementRef.current[0] as any) = element)}
      >
        <div className="row my-5">
          <div className="col-6 offset-3 my-5 borderAround">
            <h2 className="title mb-2"> JungleSwap </h2>
            <h5 className="mt-3 mb-5"> Share your green heart </h5>
            <div className="mb-5">
              <Link
                className="biggerFontSize"
                onClick={() => dispatch(scrollToAbout())}
                to={""}
              >
                Try it!
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section ref={(element) => ((elementRef.current[1] as any) = element)}>
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
      </section>

      <section>
        <div className="container mt-5">
          <div className="mt-5 mb-3">
            <h2> Plants </h2>
            <hr />
            <h4> Search a plant </h4>
          </div>
          <div className="mb-4">
            <input
              className="smallWidth form-control"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {plants &&
              plants.map((plant: Plant): JSX.Element => {
                const { _id, name, imageUrl, price } = plant;
                return (
                  <div className="col mb-5" key={_id}>
                    <div className="card card-medium-width text-center h-100">
                      <img
                        className="card-img-top mediumPicSize"
                        src={imageUrl}
                        alt={name}
                      />
                      <div className="card-body mb-5">
                        <h5> {name} </h5>
                        <p> {price} € </p>
                        <Link
                          className="btn form-control smallWidth"
                          to={`/plants/read/${_id}`}
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
