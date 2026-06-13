import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MessageSquare } from "lucide-react";
import { api } from "../../services/api";

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.auth.login(email, password);

      // Check if response is valid JSON
      if (typeof response === 'string' && response.includes('<!DOCTYPE')) {
        setError("Server error: Backend not properly configured. Please check the server logs.");
        console.error("HTML response received:", response);
        return;
      }

      if (response.success) {
        // Store user data and token in localStorage
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userId", response.data.user_id);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userEmail", response.data.email);

        // Call onLogin with user data
        onLogin(response.data);

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
      } catch (err: any) {
        const errorMsg = err.message || "An error occurred during login";
        setError(errorMsg);
      }
      setLoading(false);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <MessageSquare className="size-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-900">MessageHub</h1>
          </div>

          <div className="space-y-4 text-blue-900">
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="text-lg text-blue-700">
              Manage your SMS and WhatsApp messaging campaigns with ease.
            </p>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-center gap-2">
                <div className="size-2 bg-blue-600 rounded-full"></div>
                Send bulk messages efficiently
              </li>
              <li className="flex items-center gap-2">
                <div className="size-2 bg-blue-600 rounded-full"></div>
                Schedule messages for optimal timing
              </li>
              <li className="flex items-center gap-2">
                <div className="size-2 bg-blue-600 rounded-full"></div>
                Track delivery and engagement
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

