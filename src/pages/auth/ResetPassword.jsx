import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import { FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  // Validate the token format minimally
  useEffect(() => {
    if (!resettoken || resettoken.length < 20) {
      setError("Invalid reset token. Please request a new reset link.");
    }
  }, [resettoken]);

  const validatePassword = () => {
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await resetPassword(resettoken, password);
      setIsSuccess(true);
      toast.success("Password reset successful");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to reset password";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/logo.png"
          alt="AussenDienst GmbH"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSuccess ? (
            <div className="text-center">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-3">
                  <FiCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Password reset successful
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Your password has been reset. You will be redirected to the
                login page shortly.
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              {validationError && (
                <div className="text-sm text-red-600">{validationError}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || error}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    (isLoading || error) && "opacity-70 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>

              <div className="text-sm text-center">
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
