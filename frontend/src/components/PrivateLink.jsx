import { useSelector } from "react-redux";

const PrivateLink = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? children : null;
};

export default PrivateLink;
