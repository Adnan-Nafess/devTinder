import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest, removeRequest  } from '../redux/requestSlice';

const Request = () => {
  const request = useSelector((store) => store.request);
  const dispatch = useDispatch();

const reviewRequest = async (status, requestId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId))
      console.log("✅", res.data.message);
      // Refetch updated requests after reviewing
      fetchRequest();
    } catch (err) {
      console.error("❌ Error reviewing request:", err.response?.data || err.message);
    }
  };

  
  const fetchRequest = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
      dispatch(addRequest(res.data.data));
    }catch(err) {
      console.log(err);
    }
  };
  
    useEffect(() => {
      fetchRequest();
    }, []);
  
    if (!request) return null;
  
    if (request.length === 0)
      return (
        <h1 className="text-2xl font-bold text-center mt-10">
          No Connection Requests Found 😢
        </h1>
      );
  

  return request && (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Connection Requests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {request.map((user) => {
          const { firstName, lastName, age, gender, about, photoUrl, _id } = user.fromUserId;
          return (
            <div
              key={_id}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition duration-300"
            >
              {/* 🖼 Profile Photo */}
              <div className="relative h-96">
                <img
                  src={photoUrl || "/default-avatar.png"}
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
                  <h2 className="text-2xl font-bold">
                    {firstName} {lastName}, {age}
                  </h2>
                  <span className="capitalize text-sm opacity-90">{gender}</span>
                </div>
              </div>

              {/* 💬 About */}
              <div className="p-4">
                <p className="text-gray-800 dark:text-gray-200 text-sm mb-4 line-clamp-3">
                  {about || "No bio provided yet."}
                </p>

                {/* ❤️ Action Buttons */}
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => reviewRequest("rejected", user._id)}
                    className="w-1/2 py-2 rounded-full bg-pink-700 text-white font-semibold cursor-pointer hover:bg-pink-900 transition"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => reviewRequest("accepted", user._id)}
                    className="w-1/2 py-2 rounded-full bg-indigo-700 text-white font-semibold cursor-pointer hover:bg-indigo-900 transition"
                  >
                    ❤️ Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Request