import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
function Homapage() {
  return (
    <div>
      <PageNav />
      <h1>World Wise</h1>
      <p>testing</p>
      <Link to="/pricing">Pricing</Link>
    </div>
  );
}

export default Homapage;
