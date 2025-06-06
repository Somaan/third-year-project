import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CAPTCHA from "./CAPTCHA";
import { ROUTES } from "./Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import AchievementService from "./AchievementService";

/**
- Handles user authentication and login process
- Features:
  - Username/password validation
  - CAPTCHA verification
  - Error handling and user feedback 
  - Redirect on successful login to Dashboard
  - Password visibility toggle
  - Remember Me functionality
  - Achievement tracking on login success
 */

const LoginForm = ({ onLoginSuccess }) => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loginData, setLoginData] = useState(null);

  const MAX_LENGTH = 20;

  // Cleanup function to remove any possible navigation blockers
  useEffect(() => {
    // Remove any existing beforeunload listeners
    window.onbeforeunload = null;

    // Cleanup on component unmount
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedUser");
    if (savedCredentials) {
      try {
        const parsedCredentials = JSON.parse(savedCredentials);
        setFormData({
          username: parsedCredentials.username || "",
          password: parsedCredentials.password || "",
        });
        setRememberMe(true);
        console.log(
          "Loaded remembered credentials for:",
          parsedCredentials.username
        );
      } catch (error) {
        console.error("Error parsing saved credentials:", error);
        localStorage.removeItem("rememberedUser");
      }
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (value.length <= MAX_LENGTH) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // API call
      console.log("Attempting login with:", {
        username: formData.username,
        remember_me: rememberMe,
      });
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          remember_me: rememberMe,
        }),
      });

      // Checks response before setting timeout
      const data = await response.json();
      console.log("server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login Failed");
      }

      setLoginData(data);

      // Handle Remember Me functionality
      if (rememberMe) {
        console.log("Storing credentials in localStorage");
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({
            username: formData.username,
            password: formData.password,
            token: data.remember_token,
          })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }

      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
        setShowCaptcha(true);
      }, 1500); // 1.5 second delay
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const handleCaptchaSuccess = async () => {
    // Store user information in session storage
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("username", formData.username);

    let userId = "1";
    if (loginData && loginData.user && loginData.user.id) {
      userId = loginData.user.id.toString();
    } else {
      console.warn("UserId not found in login response, using default");
    }

    sessionStorage.setItem("userId", userId);

    // Update login streak and check for achievements
    try {
      // First try to update login streak via API
      let streakUpdated = false;

      try {
        const streakResponse = await fetch(
          `http://localhost:5000/api/users/${userId}/streak`,
          {
            method: "POST",
          }
        );

        if (streakResponse.ok) {
          const streakData = await streakResponse.json();
          console.log("Login streak updated via API:", streakData.login_streak);
          streakUpdated = true;
        }
      } catch (apiError) {
        console.warn("API streak update failed:", apiError);
      }

      // If API fails, update locally for demo purposes
      if (!streakUpdated) {
        const currentStreak =
          parseInt(localStorage.getItem(`login_streak_${userId}`)) || 0;
        const newStreak = currentStreak + 1;
        localStorage.setItem(`login_streak_${userId}`, newStreak);
        console.log("Login streak updated locally:", newStreak);
      }

      // Check for achievements after login
      console.log("Checking for achievements after login");
      const achievements = await AchievementService.checkStreakAchievements(
        userId
      );

      if (achievements && achievements.length > 0) {
        console.log("New achievements unlocked:", achievements);
        achievements.forEach((achievement) => {
          // Queue achievements for notification
          AchievementService.queueAchievement(achievement);
        });
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }

    // Call the onLoginSuccess callback if provided
    if (typeof onLoginSuccess === "function") {
      onLoginSuccess();
    }

    // Show success message
    toast.success("Login successful!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      onClose: () => {
        window.location.href = ROUTES.DASHBOARD;
      },
    });
  };

  return (
    <>
      {!showCaptcha ? (
        <>
          <div className="sidebar">
            <div className="nav-brand">
              <img
                src="src/assets/logo.svg"
                alt="SecurityQuest"
                className="nav-logo"
              />
            </div>
            <h3 className="sidebar-title">Login here!</h3>
          </div>
          <div className="content-wrapper">
            <div className="form-container">
              <h2>Welcome Back!</h2>
              <form className="login-form" onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="username">
                    Username:
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Enter your Username"
                      className="form-input"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                    <span className="char-count">
                      {formData.username.length}/{MAX_LENGTH}
                    </span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password:
                  </label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      className="form-input"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                    {/* First the button, then the character counter */}
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        style={{ color: "#ffffff" }}
                      />
                    </button>
                    <span className="char-count">
                      {formData.password.length}/{MAX_LENGTH}
                    </span>
                  </div>
                </div>

                {/* Remember Me and Forgot Password row */}
                <div className="login-options-row">
                  <div className="remember-me-container">
                    <label className="remember-me-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                        className="remember-me-checkbox"
                      />
                      <span>Keep me logged in </span>
                    </label>
                  </div>
                  <div className="forgot-password-container">
                    <Link
                      to={ROUTES.FORGOT_PASSWORD}
                      className="forgot-password-link"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "3px solid #ffffff",
                          borderTop: "3px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Verifying...
                    </div>
                  ) : (
                    <>
                      <span>Login</span>
                      <FontAwesomeIcon
                        icon={faRightToBracket}
                        style={{ marginLeft: "8px" }}
                      />
                    </>
                  )}
                </button>

                {/* Register Link */}
                <div className="register-container">
                  <span>Don't have an account? </span>
                  <Link to={ROUTES.REGISTER} className="register-link">
                    Register here
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }

            .login-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .char-count {
              top: 28px !important;
            }
            .toggle-password-btn {
              top: 28px !important;
            }
            .login-options-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 0.75rem 0 1rem 0;
            }
            .remember-me-container {
              display: flex;
              align-items: center;
              height: 10px;
            }
            .remember-me-label {
              display: flex;
              align-items: center;
              cursor: pointer;
              user-select: none;
              font-size: 0.9rem;
              margin-top: -5px;
            }
            .remember-me-checkbox {
              margin-right: 8px;
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
            .forgot-password-container {
              text-align: right;
              position: relative;
              z-index: 1;
              margin-top: -5px;
            }
            .forgot-password-link {
              color: #646cff;
              font-size: 0.9rem;
              text-decoration: none;
              display: inline-block;
            }
            .forgot-password-link:hover {
              text-decoration: underline;
            }
            .nav-brand {
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              margin-top: 0px;
            }
            .nav-logo {
              height: 75px;
              width: auto;
              max-width: 100%;
              display: block;
              margin-top: 5px;
            }
            .sidebar-title {
              font-size: 18px;
              margin-top: 30px;
              margin-bottom: 30px;
              width: 100%;
              padding: 0 10px;
              text-align: center;
              display: block;
            }
          `}</style>
        </>
      ) : (
        <CAPTCHA
          onSuccess={handleCaptchaSuccess}
          onCancel={() => setShowCaptcha(false)}
        />
      )}
    </>
  );
};

export default LoginForm;
