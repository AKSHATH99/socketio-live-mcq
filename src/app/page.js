'use client'
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Clock, BarChart3, Trophy, CheckCircle, ArrowRight, Users, Zap, Target, Mail, GraduationCap, BookOpen, Sparkles, Star, Globe, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggler";
import { useTheme } from "@/Contexts/Themecontext";

export default function Home() {
  const router = useRouter();
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // const isDark = document.documentElement.classList.contains("dark");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const benefits = {
    student: [
      "Join live competitions",
      "Track your progress",
      "Instant feedback"
    ],
    teacher: [
      "Create tests in minutes",
      "Real-time analytics",
      "Engage your students"
    ]
  };

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Testing",
      description: "Create and deploy MCQ assessments instantly with live participation tracking"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Instant Analytics",
      description: "Comprehensive performance analysis and detailed reporting for informed decision-making"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Live Leaderboards",
      description: "Engage participants with dynamic rankings and competitive assessment environment"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision Results",
      description: "Accurate scoring with immediate feedback and detailed performance metrics"
    }
  ];

  const benefitsList = [
    "Eliminate manual grading and reduce administrative overhead",
    "Provide immediate feedback to enhance learning outcomes",
    "Track progress with comprehensive analytics dashboard",
    "Scale assessments effortlessly for any group size"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Enhanced Header Navigation */}
      <nav className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  MCQ<span className="text-gray-600 dark:text-gray-400">Live</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-black dark:text-white border border-gray-300/50 dark:border-gray-600/50 px-6 py-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50"
                onClick={() => router.push("student/auth/signin")}
              >
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Student Login
              </button>
              <button
                className="group bg-gradient-to-r from-black to-gray-900 dark:from-white dark:to-gray-200 text-white dark:text-black px-6 py-3 rounded-xl hover:from-gray-900 hover:to-black dark:hover:from-gray-200 dark:hover:to-white transition-all duration-300 font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-black/25 dark:hover:shadow-white/25 hover:-translate-y-0.5"
                onClick={() => router.push("teacher/auth/signin")}
              >
                <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Teacher Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background decorations - Gray only */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-300/20 dark:bg-gray-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gray-400/20 dark:bg-gray-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gray-200/20 dark:bg-gray-700/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Floating badges */}
            <div className="flex justify-center mb-8">
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-black dark:text-white mb-8 leading-none tracking-tight">
              Create Live MCQ Tests
              <span className="block bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 dark:from-gray-400 dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent">
                In Minutes
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Move beyond Google Forms with <strong className="text-black dark:text-white">live MCQ assessments</strong> that show
              real-time participation, instant scoring, and dynamic leaderboards. Watch students compete live
              while you get immediate results.
            </p>

            {/* Enhanced Login Form */}
            <div className="max-w-xl mx-auto">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 hover:shadow-3xl hover:bg-white/80 dark:hover:bg-gray-800/80">
                {/* Header */}
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-black dark:text-white mb-3">Get Started</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Create your account to begin your journey</p>
                </div>

                {/* User Type Selection - Enhanced */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-black dark:text-white mb-6 text-center">Select Account Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { type: "student", icon: <GraduationCap className="w-6 h-6" />, label: "Student", desc: "Take assessments" },
                      { type: "teacher", icon: <BookOpen className="w-6 h-6" />, label: "Teacher", desc: "Create tests" }
                    ].map(({ type, icon, label, desc }) => (
                      <button
                        key={type}
                        onClick={() => setUserType(type)}
                        className={`relative p-6 rounded-2xl text-left transition-all duration-300 border-2 group hover:scale-105 ${userType === type
                          ? "bg-gradient-to-br from-black to-gray-900 dark:from-white dark:to-gray-100 text-white dark:text-black border-black dark:border-white shadow-xl"
                          : "bg-white/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50 text-black dark:text-white hover:border-gray-400 dark:hover:border-gray-500 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-lg"
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl transition-all duration-300 ${userType === type
                            ? "bg-white/20 dark:bg-black/20 text-white dark:text-black"
                            : "bg-gradient-to-br from-gray-500 to-gray-700 text-white shadow-lg group-hover:scale-110"
                            }`}>
                            {icon}
                          </div>
                          <div>
                            <div className="font-bold text-lg mb-1">{label}</div>
                            <div className={`text-sm ${userType === type ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"}`}>
                              {desc}
                            </div>
                          </div>
                        </div>
                        {userType === type && (
                          <div className="absolute top-3 right-3">
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Benefits Preview */}
                <div className="mb-8 p-6 bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
                  <h4 className="font-bold text-black dark:text-white mb-4 text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    What you&apos;ll get:

                  </h4>
                  <ul className="space-y-3">
                    {benefits[userType].map((benefit, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300 flex items-center gap-3 group">
                        <div className="w-2 h-2 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 rounded-full group-hover:scale-150 transition-transform"></div>
                        <span className="group-hover:text-black dark:group-hover:text-white transition-colors">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Google Sign-in Button */}
                <a href={`/api/auth/google?role=${userType}`}
                  className="flex items-center justify-center px-6 py-4 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl shadow-lg bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 font-semibold hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:ring-offset-2 mb-6 group backdrop-blur-sm">
                  <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </a>

                {/* Email Input - Enhanced */}
                <div className="mb-8">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className={`w-full pl-14 pr-12 py-4 rounded-2xl border-2 focus:outline-none transition-all duration-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg ${email === ""
                        ? "border-gray-300/50 dark:border-gray-600/50 focus:border-black dark:focus:border-white focus:shadow-lg"
                        : isValidEmail
                          ? "border-gray-400 dark:border-gray-500 bg-gray-50/50 dark:bg-gray-600/20 focus:border-black dark:focus:border-white shadow-lg"
                          : "border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-500"
                        }`}
                    />
                    {email && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {isValidEmail ? (
                          <CheckCircle className="w-6 h-6 text-black dark:text-white animate-pulse" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 animate-pulse"></div>
                        )}
                      </div>
                    )}
                  </div>
                  {email && !isValidEmail && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 animate-in slide-in-from-top-1 duration-300 flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                {/* Submit Button - Enhanced */}
                <button
                  onClick={() =>
                    router.push(`/auth/verify?type=${userType}&email=${encodeURIComponent(email)}`)
                  }
                  disabled={!email}
                  className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 group ${email
                    ? "bg-gradient-to-r from-black to-gray-900 dark:from-white dark:to-gray-100 text-white dark:text-black hover:from-gray-900 hover:to-black dark:hover:from-gray-200 dark:hover:to-white shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                    : "bg-gray-300/50 dark:bg-gray-600/50 cursor-not-allowed text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {email ? (
                    <>
                      Sign Up
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    "Enter your email to continue"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
              Student Dashboard Experience
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              See how students track their progress with comprehensive analytics, test results, and performance metrics
            </p>
          </div>

          {/* Dashboard Image with Enhanced Styling */}
          <div className="relative max-w-6xl mx-auto group">
            {/* Outer glow layers - Gray only */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-1000"></div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-1000"></div>

            {/* Main dashboard container */}
            <div className="relative bg-gradient-to-br from-gray-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-700/90 rounded-3xl p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl group-hover:shadow-3xl transition-all duration-500">
              {/* Dashboard Image Container */}
              <div className="relative bg-white dark:bg-gray-600 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-600/50 overflow-hidden group-hover:shadow-2xl transition-shadow duration-500">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  {/* <div className="text-center">
                    <BarChart3 className="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Dashboard Preview</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Analytics • Progress • Results</p>
                  </div> */}
                  <img src={theme === "dark" ? "dahsboard-dark.png" : "dashboard.png"} alt="Dashboard Preview" className="w-full h-full object-cover" />
                  {/* <img src="dashboard.png" alt="Dashboard Preview" className="w-full h-full object-cover" /> */}
                </div>
              </div>

              {/* Floating feature badges */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800/50 rounded-full mb-6">
              <Zap className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Advanced Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
              Assessment Capabilities
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive testing solutions designed for modern educational and professional environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                {/* Background glow - Gray only */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                {/* Card */}
                <div className="relative bg-white/80 dark:bg-gray-700/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-600/50 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-white dark:group-hover:bg-gray-700">
                  <div className="text-black dark:text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-r from-gray-600 to-black dark:from-gray-400 dark:to-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 text-white dark:text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800/50 rounded-full mb-6">
                <Shield className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Benefits</span>
              </div>
              <h2 className="text-5xl font-black text-black dark:text-white mb-8 leading-tight">
                Streamlined Assessment Process
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                Transform your testing methodology with our efficient, user-friendly platform that delivers
                professional results while saving valuable time and resources.
              </p>
              <div className="space-y-6">
                {benefitsList.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-600 to-black dark:from-gray-400 dark:to-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { icon: Zap, label: "Instant", desc: "Result Generation" },
                  { icon: Users, label: "Unlimited", desc: "Participants" },
                  { icon: BarChart3, label: "Advanced", desc: "Analytics" },
                  { icon: Trophy, label: "Real-time", desc: "Leaderboards" }
                ].map(({ icon: Icon, label, desc }, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-gray-600 to-black dark:from-gray-400 dark:to-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                      <Icon className="w-8 h-8 text-white dark:text-black" />
                    </div>
                    <div className="text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all duration-300">
                      {label}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="relative py-32 overflow-hidden">
        {/* Background with gradients - Gray only */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 dark:from-black dark:via-gray-950 dark:to-black"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Start Your First Live Test
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create engaging MCQ tests with real-time results in under 5 minutes
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <button
              className="group w-full sm:w-auto bg-white text-black px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              onClick={() => router.push("/auth/verify?type=teacher")}
            >
              <Target className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Teacher Login
            </button>
            <button
              className="group w-full sm:w-auto bg-transparent text-white border-2 border-white/30 px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 backdrop-blur-sm"
              onClick={() => router.push("/auth/verify?type=student")}
            >
              <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Student Login
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>Works Everywhere</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-black dark:bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-4xl font-black mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              MCQ<span className="text-gray-600 dark:text-gray-400">Live</span>
            </div>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Professional assessment solutions for modern educational environments
            </p>

            {/* Social proof mockup */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <span>1000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span>50k+ Tests Created</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                <span>99.9% Uptime</span>
              </div>
            </div>

            <div className="text-gray-600 text-sm">
              © 2024 MCQLive. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}