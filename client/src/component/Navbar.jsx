import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../redux/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
      // console.error(err.response?.data?.message || err.message);
      alert("Logout failed! Try again.");
    }
  };

  return (
    <nav className="navbar sticky top-0 z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md px-2 sm:px-4">
      {/* Left side (Logo) */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-xl sm:text-2xl md:text-3xl font-bold tracking-wide hover:bg-white/10"
        >
          👩‍💻 DevTinder
        </Link>
      </div>

      {/* Right side (Desktop) */}
      {user && (
        <div className="hidden md:flex items-center gap-3">
          <p className="text-sm sm:text-base">Welcome, {user.firstName}</p>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-200"
            >
              <div className="w-10 rounded-full ring ring-white ring-offset-base-100 ring-offset-2">
                <img alt="User avatar" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white text-gray-700 rounded-lg mt-3 w-52 p-2 shadow-lg z-[999]"
            >
              <li>
                <Link
                  to="/profile"
                  className="flex justify-between items-center hover:bg-gray-100"
                >
                  Profile{" "}
                  <span className="badge badge-primary text-white">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections" className="hover:bg-gray-100">
                  Connections
                </Link>
              </li>
              <li>
                <Link to="/request" className="hover:bg-gray-100">
                  Request
                </Link>
              </li>
              <li>
                <Link to="/premium" className="hover:bg-gray-100">
                  Premium
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
