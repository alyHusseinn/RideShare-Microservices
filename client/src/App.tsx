import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { CreateTrip } from "./components/CreateTrip";
import { DriverDashboard } from "./components/DriverDashboard";
import { RiderDashboard } from "./components/RiderDashboard";
import { useSocket } from "./hooks/useSocket";
import { useAuth } from "./context/AuthContext";

const AppContent = () => {
  const { user } = useAuth();
  const socket = useSocket(user);

  // if (user && !socket) {
  //   return <div>Connecting...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {user?.role === "driver" ? (
                  <DriverDashboard socket={socket!} />
                ) : (
                  <RiderDashboard socket={socket!} />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/create-trip"
            element={
              <ProtectedRoute allowedRole="rider">
                <CreateTrip />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );

};
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
