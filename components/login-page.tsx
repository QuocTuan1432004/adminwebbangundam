"use client";

import * as React from "react";
import {
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  Mail,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginPageWithAuth() {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [isResetSent, setIsResetSent] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    if (email === "admin@gundokai.com" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "adminUser",
        JSON.stringify({ email, name: "Admin" })
      );
      router.push("/dashboard");
    } else {
      alert("Email hoặc mật khẩu không đúng!");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

    setIsResetSent(true);
    setIsLoading(false);
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setIsResetSent(false);
    setForgotEmail("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-10 left-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl transition-all duration-500 hover:shadow-3xl">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative group">
                  <img
                    src="/images/ChatGPT Image 08_43_04 23 thg 7, 2025.png"
                    alt="GUNDŌKAI Logo"
                    className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-white/40"
                  />
                  <div className="absolute -top-1 -right-1 transition-all duration-300 group-hover:scale-110">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="space-y-3">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent">
                  GUNDŌKAI
                </CardTitle>
                <div className="text-xl text-white/70 font-medium tracking-wider">
                  軍道会
                </div>
                <CardDescription className="text-white/60 text-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    {showForgotPassword
                      ? "Reset Password"
                      : "Admin Control Panel"}
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {!showForgotPassword ? (
                // Login Form
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-white/90 font-medium flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Email Address
                        <span className="text-red-400">•</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@gundokai.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-200 hover:bg-white/15"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-white/90 font-medium flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Password
                        <span className="text-red-400">•</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl pr-12 transition-all duration-200 hover:bg-white/15"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                        className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-white/70 cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-blue-300 hover:text-blue-200 p-0 h-auto transition-colors duration-200"
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? "Đang đăng nhập..." : "Sign In to Dashboard"}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </Button>
                </form>
              ) : (
                // Forgot Password Form
                <div className="space-y-6">
                  {!isResetSent ? (
                    <>
                      <div className="text-center space-y-2 mb-6">
                        <h3 className="text-xl font-semibold text-white/90">
                          Reset Your Password
                        </h3>
                        <p className="text-white/60 text-sm">
                          Enter your email address and we'll send you a link to
                          reset your password.
                        </p>
                      </div>

                      <form
                        onSubmit={handleForgotPassword}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label
                            htmlFor="forgot-email"
                            className="text-white/90 font-medium flex items-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            Email Address
                            <span className="text-red-400">•</span>
                          </Label>
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="Enter your email address"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                            className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-200 hover:bg-white/15"
                          />
                        </div>

                        <div className="space-y-3 pt-2">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {isLoading
                              ? "Sending Reset Link..."
                              : "Send Reset Link"}
                            {!isLoading && <Mail className="w-5 h-5" />}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetForgotPassword}
                            className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                          </Button>
                        </div>
                      </form>
                    </>
                  ) : (
                    // Reset Link Sent Confirmation
                    <div className="text-center space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white/90">
                          Reset Link Sent!
                        </h3>
                        <p className="text-white/60 text-sm">
                          We've sent a password reset link to{" "}
                          <span className="text-blue-300 font-medium">
                            {forgotEmail}
                          </span>
                        </p>
                        <p className="text-white/40 text-xs">
                          Please check your email and follow the instructions to
                          reset your password.
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForgotPassword}
                        className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center space-y-2 pt-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  System Status: Online
                </div>
                <div className="text-xs text-white/40">
                  GUNDŌKAI Admin Panel v2.0 • © 2024 All rights reserved
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
