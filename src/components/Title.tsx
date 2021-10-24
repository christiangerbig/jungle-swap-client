import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { scrollToAbout } from "../reducer/jungleSwapSlice";

const Title = (): JSX.Element => {
  const dispatch = useAppDispatch();

  return (
    <div className="row my-5">
      <div className="col-6 offset-3 my-5 borderAround">
        <h2 className="title mb-2"> JungleSwap </h2>
        <h5 className="mt-3 mb-5"> Share your green heart </h5>
        <div className="mb-5">
          <Link
            to={"/"}
            className="biggerFontSize"
            onClick={() => {
              dispatch(scrollToAbout());
            }}
          >
            Try it!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Title;
