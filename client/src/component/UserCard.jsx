import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../redux/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, age, skills, photoUrl, about, gender } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${userId}`,{}, { withCredentials: true });
      dispatch(removeUserFromFeed(userId));
    }catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center my-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden">
        {/* Image */}
        <div className="relative h-96 w-full">
          <img
            src={photoUrl || "/default-avatar.png"}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
          {/* Name + Age overlay */}
          <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
            <h2 className="text-2xl font-bold">
              {firstName} {lastName}, {age}
            </h2>
            <span className="capitalize text-sm">{gender}</span>
          </div>
        </div>

        {/* About + Skills */}
        <div className="p-4">
          <p className="text-gray-800 dark:text-gray-200 mb-3 text-sm line-clamp-3">
            {about}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills?.map((skill, idx) => (
              <span
                key={idx}
                className="bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() => handleSendRequest("ignored", _id)}
              className="w-1/2 py-2 rounded-full cursor-pointer bg-pink-700 text-white font-bold hover:bg-pink-900 transition"
            >
              ❌ Ignore
            </button>
            <button
              onClick={() => handleSendRequest("interested", _id)}
              className="w-1/2 py-2 rounded-full bg-indigo-700 cursor-pointer text-white font-bold hover:bg-indigo-900 transition"
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
