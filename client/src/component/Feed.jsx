import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
import { BASE_URL } from "../utils/constant";
import { useEffect } from "react";
import { addFeed } from "../redux/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feed`, { withCredentials: true });
      dispatch(addFeed(res.data));
    }catch(err) {
      console.log(err);
    }
  };

  useEffect(()=> {
    getFeed();
  }, [])

  if(!feed) return;

  if(feed.length <= 0) return <h1 className="flex justify-center text-center text-3xl">No new user found</h1>

  return feed && (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  )
}

export default Feed;