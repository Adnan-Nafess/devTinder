import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `${BASE_URL}/${isLogin ? "login" : "signup"}`;
      const payload = isLogin
        ? { emailId: formData.emailId, password: formData.password }
        : formData;

      const res = await axios.post(url, payload, { withCredentials: true });
      dispatch(addUser(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong!!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-900 text-white">
      {/* Card */}
      <div className="card w-full max-w-sm shadow-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl">
        <div className="card-body">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center">
            {isLogin ? "Welcome Back 🔥" : "Create Account 💫"}
          </h2>
          <p className="text-center text-sm text-gray-400 mb-4">
            {isLogin
              ? "Login to find your match 💕"
              : "Join us and find your match 💕"}
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    className="input input-bordered bg-gray-700 text-white placeholder:text-gray-400 border-gray-600"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    className="input input-bordered bg-gray-700 text-white placeholder:text-gray-400 border-gray-600"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300">Email</span>
              </label>
              <input
                type="email"
                name="emailId"
                placeholder="your@email.com"
                className="input input-bordered bg-gray-700 text-white placeholder:text-gray-400 border-gray-600"
                value={formData.emailId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered bg-gray-700 text-white placeholder:text-gray-400 border-gray-600"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Centered Button */}
            <div className="form-control mt-6 flex justify-center">
              <button
                type="submit"
                className="btn bg-pink-600 hover:bg-pink-700 border-none text-white text-lg w-36 mx-auto rounded-full shadow-lg transition"
                disabled={loading}
              >
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Signing up..."
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Toggle */}
          <p className="text-center text-gray-400 mt-3">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-400 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
