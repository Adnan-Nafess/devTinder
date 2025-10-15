import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/userSlice";

const Body = () => {
  const user = useSelector((store) => store.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const fetchProfile = async () => {
    if (user && Object.keys(user).length > 0) return;
    try {
      const res = await axios(`${BASE_URL}/profile/view`, { withCredentials: true });
      dispatch(addUser(res.data));
    }catch(err) {
      if(err.status === 401) {
        navigate("/login");
      }
      console.log(err);
    }
  };

  useEffect(()=> {
    fetchProfile();
  }, [])

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Body;