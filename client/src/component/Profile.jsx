import { useSelector, useDispatch } from "react-redux";
import EditProfile from "./EditProfile";
import { addUser } from "../redux/userSlice";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleUpdate = (updatedUser) => {
    // Update Redux store
    dispatch(addUser(updatedUser));
  };

  return (
    user && (
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <EditProfile user={user} onUpdate={handleUpdate} />
      </div>
    )
  );
};

export default Profile;
