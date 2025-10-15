import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constant";

// EditProfile Component with Live Preview
const EditProfile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    about: "",
    skills: "",
    photoUrl: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        about: user.about || "",
        skills: user.skills?.join(", ") || "",
        photoUrl: user.photoUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      };

      // Backend API call
      const res = await fetch(`${BASE_URL}/profile/edit`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        onUpdate?.(data.data); // update parent if needed
      } else {
        setMessage(data.message || "Profile update failed");
      }
    } catch (err) {
      setMessage("Profile update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row gap-6 p-4">
      {/* Form Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Profile
        </h2>
        {message && <p className="mb-4 text-green-600 dark:text-green-400">{message}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered w-1/2"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered w-1/2"
              required
            />
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="input input-bordered w-1/2"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input input-bordered w-1/2"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <textarea
            name="about"
            placeholder="About"
            value={formData.about}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows={3}
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="photoUrl"
            placeholder="Photo URL"
            value={formData.photoUrl}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="flex-1 flex justify-center items-start">
        <div className="card bg-white dark:bg-gray-800 w-80 sm:w-96 shadow-xl rounded-xl overflow-hidden">
          <figure className="h-96 w-full overflow-hidden">
            <img
              src={formData.photoUrl || "/default-avatar.png"}
              alt={`${formData.firstName} ${formData.lastName}`}
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="card-body p-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {formData.firstName} {formData.lastName}, {formData.age}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">
              {formData.gender}
            </span>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{formData.about}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.split(",").map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
