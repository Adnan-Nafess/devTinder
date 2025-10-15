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
      <div>
        <EditProfile user={user} onUpdate={handleUpdate} />
      </div>
    )
  );
};

export default Profile;
