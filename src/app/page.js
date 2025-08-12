'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock, BarChart3, Trophy, CheckCircle, ArrowRight, Users, Zap, Target, Mail, GraduationCap, BookOpen } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggler";

export default function Home() {
  const router = useRouter();
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-black dark:text-white">MCQ<span className="text-gray-600 dark:text-gray-400">Live</span></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center gap-2"
                onClick={() => router.push("student/auth/signin")}
              >
                <Users className="w-4 h-4" />
                Student Login
              </button>
              <button
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center gap-2"
                onClick={() => router.push("teacher/auth/signin")}
              >
                <Target className="w-4 h-4" />
                Teacher Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-6 leading-tight">
              Create Live MCQ Tests
              <span className="block text-gray-600 dark:text-gray-400">In Minutes</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Move beyond Google Forms with <strong className="text-black dark:text-white">live MCQ assessments</strong> that show
              real-time participation, instant scoring, and dynamic leaderboards. Watch students compete live
              while you get immediate results.
            </p>

            {/* Enhanced Login Form */}
            <div className="max-w-lg mx-auto">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Get Started</h3>
                  <p className="text-gray-600 dark:text-gray-400">Create your account to begin</p>
                </div>

                {/* User Type Selection - Enhanced */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black dark:text-white mb-4">Select Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "student", icon: <GraduationCap className="w-5 h-5" />, label: "Student", desc: "Take assessments" },
                      { type: "teacher", icon: <BookOpen className="w-5 h-5" />, label: "Teacher", desc: "Create tests" }
                    ].map(({ type, icon, label, desc }) => (
                      <button
                        key={type}
                        onClick={() => setUserType(type)}
                        className={`relative p-4 rounded-lg text-left transition-all duration-200 border-2 ${userType === type
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md"
                          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${userType === type ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-black" : "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                            }`}>
                            {icon}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{label}</div>
                            <div className={`text-xs ${userType === type ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"}`}>
                              {desc}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Benefits Preview */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-black dark:text-white mb-3">What you&apos;s ll get:</h4>
                  <ul className="space-y-2">
                    {benefits[userType].map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <a href={`/api/auth/google?role=${userType}`}
                  class="flex items-center justify-center px-4 py-3 border my-10 
         border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium 
         hover:bg-gray-50 hover:shadow-md transition-all duration-200 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
         dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 
         dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900">

                  <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </a>

                {/* Email Input - Enhanced */}
                <div className="mb-6">
                  {/* <label className="block text-sm font-medium text-black dark:text-white mb-2">Email Address</label> */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className={`w-full pl-11 pr-10 py-3 rounded-lg border-2 focus:outline-none transition-all duration-200 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${email === ""
                        ? "border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                        : isValidEmail
                          ? "border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 focus:border-black dark:focus:border-white"
                          : "border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-500"
                        }`}
                    />
                    {email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isValidEmail ? (
                          <CheckCircle className="w-5 h-5 text-black dark:text-white" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400 dark:border-gray-500"></div>
                        )}
                      </div>
                    )}
                  </div>
                  {email && !isValidEmail && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 animate-in slide-in-from-top-1 duration-200">
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
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${email
                    ? "bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md hover:shadow-lg"
                    : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {email ? (
                    <>
                      Sign Up
                      <ArrowRight className="w-5 h-5" />
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

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black dark:text-white mb-6">
              Student Dashboard Experience
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how students track their progress with comprehensive analytics, test results, and performance metrics
            </p>
          </div>

          {/* Dashboard Image with Styling */}
          <div className="relative max-w-6xl mx-auto">
            {/* Main dashboard container with subtle shadows */}
            <div className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              {/* Dashboard Image */}
              <div className="relative bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden">
                <img
                  src="dashboard.png"
                  alt="Student Dashboard Interface showing analytics, test results, and performance metrics"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Fading border effects */}
              <div className="absolute inset-0 rounded-2xl">
                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
                {/* Left fade */}
                <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
                {/* Right fade */}
                <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 opacity-20 blur-xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
              Advanced Assessment Capabilities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive testing solutions designed for modern educational and professional environments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                <div className="text-black dark:text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                Streamlined Assessment Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Transform your testing methodology with our efficient, user-friendly platform that delivers
                professional results while saving valuable time and resources.
              </p>
              <div className="space-y-4">
                {benefitsList.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-black dark:text-white mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black dark:text-white mb-2">
                    <Zap className="w-12 h-12 mx-auto mb-2" />
                    Instant
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Result Generation</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black dark:text-white mb-2">
                    <Users className="w-12 h-12 mx-auto mb-2" />
                    Unlimited
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Participants</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black dark:text-white mb-2">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    Advanced
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Analytics</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black dark:text-white mb-2">
                    <Trophy className="w-12 h-12 mx-auto mb-2" />
                    Real-time
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Leaderboards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your First Live Test
          </h2>
          <p className="text-lg text-gray-300 dark:text-gray-400 mb-6">
            Create engaging MCQ tests with real-time results in under 5 minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="bg-white dark:bg-gray-800 text-black dark:text-white px-6 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              onClick={() => router.push("/auth/verify?type=teacher")}
            >
              <Target className="w-4 h-4" />
              Teacher Login
            </button>
            <button
              className="bg-transparent text-white border border-gray-600 dark:border-gray-500 px-6 py-3 rounded-md hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              onClick={() => router.push("/auth/verify?type=student")}
            >
              <Users className="w-4 h-4" />
              Student Login
            </button>
          </div>
        </div>
        <footer className="text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="text-2xl font-bold mb-4">MCQ<span className="text-gray-600 dark:text-gray-400">Live</span></div>
              <p className="text-gray-600 dark:text-gray-400">
                Professional assessment solutions for modern educational environments
              </p>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}