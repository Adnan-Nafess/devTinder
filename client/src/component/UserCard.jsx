import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../redux/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, age, skills, photoUrl, about, gender } =
    user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center my-6 px-2">
      <div
        className="
    bg-white dark:bg-gray-900
    rounded-2xl shadow-2xl
    w-full max-w-sm sm:max-w-md
    overflow-hidden
  "
      >
        {/* Image */}
        <div className="relative h-72 sm:h-80 md:h-96 w-full">
          <img
            src={photoUrl || "/default-avatar.png"}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white drop-shadow-lg">
            <h2 className="text-lg sm:text-2xl font-bold">
              {firstName} {lastName}, {age}
            </h2>
            <span className="capitalize text-xs sm:text-sm">{gender}</span>
          </div>
        </div>

        {/* About + Skills */}
        <div className="p-3 sm:p-4">
          <p className="text-gray-800 dark:text-gray-200 mb-3 text-sm line-clamp-3">
            {about}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {skills?.map((skill, idx) => (
              <span
                key={idx}
                className="bg-purple-100 dark:bg-purple-700
              text-purple-800 dark:text-purple-200
              text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSendRequest("ignored", _id)}
              className="flex-1 py-2 rounded-full bg-pink-700 text-white font-bold hover:bg-pink-900 transition"
            >
              ❌ Ignore
            </button>
            <button
              onClick={() => handleSendRequest("interested", _id)}
              className="flex-1 py-2 rounded-full bg-indigo-700 text-white font-bold hover:bg-indigo-900 transition"
            >
              ❤️ Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
