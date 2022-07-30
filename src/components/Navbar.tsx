import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-center gap-2 py-2">
      <Link to="/" className="btn btn-ghost">
        Home
      </Link>
      <Link to="/clients" className="btn btn-ghost">
        Clients
      </Link>
      <Link to="/instructors" className="btn btn-ghost">
        Instructors
      </Link>
      <Link to="/groups" className="btn btn-ghost">
        Groups
      </Link>
    </div>
  );
};

export default Navbar;
