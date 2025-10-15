import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./component/Login";
import Body from "./component/Body";
import Profile from "./component/Profile";
import { Provider } from "react-redux";
import store from "./redux/store";
import Feed from "./component/Feed";
import Connections from "./component/Connections";
import Request from "./component/Request";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/request" element={<Request />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
