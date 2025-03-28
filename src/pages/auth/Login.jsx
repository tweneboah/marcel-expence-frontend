import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setFormError("");

    // Validate form
    if (!email || !password) {
      setFormError("Please enter both email and password");
      return;
    }

    try {
      const data = await login({ email, password });

      // Redirect based on user role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Use the error message from the server
      setFormError(
        err.message ||
          err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

  // Use either the form error or the authentication error
  const displayError = formError || authError;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#abff4f] via-[#FFFFFF] to-[#08bdbd]">
      <motion.div
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-[#29bf12]/20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="mt-2 text-3xl font-bold text-[#08bdbd]">
            Welcome Back
          </h2>
          <p className="mt-2 text-[#29bf12]">
            Log in to access your expense account
          </p>
        </motion.div>

        {displayError && (
          <motion.div
            className="p-4 mb-4 text-sm text-[#f21b3f] bg-[#f21b3f]/10 rounded-lg border border-[#f21b3f]/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {displayError}
          </motion.div>
        )}

        <motion.form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#29bf12]">
                <FiMail />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="block w-full px-10 py-3 border border-[#abff4f] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29bf12] focus:border-[#29bf12] transition-all duration-200"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#29bf12]">
                <FiLock />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="block w-full px-10 py-3 border border-[#abff4f] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29bf12] focus:border-[#29bf12] transition-all duration-200"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className="group relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-[#08bdbd] border border-transparent rounded-lg shadow-md hover:bg-[#29bf12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#08bdbd] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={loading}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiLogIn className="w-5 h-5 text-white" />
              </span>
              {loading ? "Logging in..." : "Login"}
            </button>
          </motion.div>
        </motion.form>

        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#ff9914] hover:text-[#f21b3f] transition-colors duration-200"
            >
              Register Now
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
