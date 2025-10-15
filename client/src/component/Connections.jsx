import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addConnections } from "../redux/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnection = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connection`, { withCredentials: true });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  if (!connections) return null;

  if (connections.length === 0)
    return (
      <h1 className="text-2xl font-bold text-center mt-10">
        No Connection Requests Found 😢
      </h1>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Connection Requests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {connections.map((user) => {
          const { firstName, lastName, age, gender, about, photoUrl, _id } = user;
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
