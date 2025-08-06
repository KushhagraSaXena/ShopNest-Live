import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../redux/features/Favorites/favoriteSlice";

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo); // FIX: define userInfo
  const userId = userInfo?._id;

  // useEffect(() => {
  //   if (userInfo) {
  //     dispatch(fetchFavorites(userInfo._id));
  //   }
  // }, [dispatch, userInfo]); //extra dependency userInfo
//This makes sure favorites are reloaded from the backend if user reloads the page.
// Ensure the background color is set based on the current theme

  // Background theme update logic (already correct)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateBackground = () => {
      const html = document?.documentElement;
      const body = document?.body;
      if (!html || !body) return;

      const isDark = html.classList.contains("dark");
      const bgColor = isDark ? "#111827" : "#eff6ff";
      html.style.backgroundColor = bgColor;
      body.style.backgroundColor = bgColor;
    };

    updateBackground();

    const observer = new MutationObserver(updateBackground);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Fetch favorites once user logs in or on reload
  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="min-h-screen overflow-y-auto bg-blue-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-0">
      {children}
    </div>
  );
};

export default MainLayout;


// This component sets the background color based on the current theme (dark or light)
// and ensures that the body and document background colors are updated accordingly.