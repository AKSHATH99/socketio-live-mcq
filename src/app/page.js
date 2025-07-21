'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock, BarChart3, Trophy, CheckCircle, ArrowRight, Users, Zap, Target, Mail, GraduationCap, BookOpen } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-black">MCQ<span className="text-gray-600">Live</span></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="bg-white text-black border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center gap-2"
                onClick={() => router.push("student/auth/signin")}
              >
                <Users className="w-4 h-4" />
                Student Login
              </button>
              <button
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center gap-2"
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Create Live MCQ Tests
              <span className="block text-gray-600">In Minutes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Move beyond Google Forms with <strong className="text-black">live MCQ assessments</strong> that show
              real-time participation, instant scoring, and dynamic leaderboards. Watch students compete live
              while you get immediate results.
            </p>

            {/* Enhanced Login Form */}
            <div className="max-w-lg mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-black mb-2">Get Started</h3>
                  <p className="text-gray-600">Create your account to begin</p>
                </div>

                {/* User Type Selection - Enhanced */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-4">Select Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "student", icon: <GraduationCap className="w-5 h-5" />, label: "Student", desc: "Take assessments" },
                      { type: "teacher", icon: <BookOpen className="w-5 h-5" />, label: "Teacher", desc: "Create tests" }
                    ].map(({ type, icon, label, desc }) => (
                      <button
                        key={type}
                        onClick={() => setUserType(type)}
                        className={`relative p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                          userType === type
                            ? "bg-black text-white border-black shadow-md"
                            : "bg-white border-gray-300 text-black hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            userType === type ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            {icon}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{label}</div>
                            <div className={`text-xs ${userType === type ? "text-gray-300" : "text-gray-500"}`}>
                              {desc}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Benefits Preview */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-black mb-3">What you'll get:</h4>
                  <ul className="space-y-2">
                    {benefits[userType].map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Email Input - Enhanced */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className={`w-full pl-11 pr-10 py-3 rounded-lg border-2 focus:outline-none transition-all duration-200 ${
                        email === ""
                          ? "border-gray-300 focus:border-black"
                          : isValidEmail
                          ? "border-gray-400 bg-gray-50 focus:border-black"
                          : "border-gray-300 focus:border-gray-500"
                      }`}
                    />
                    {email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isValidEmail ? (
                          <CheckCircle className="w-5 h-5 text-black" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                        )}
                      </div>
                    )}
                  </div>
                  {email && !isValidEmail && (
                    <p className="text-gray-600 text-sm mt-2 animate-in slide-in-from-top-1 duration-200">
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
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                    email
                      ? "bg-black hover:bg-gray-800 shadow-md hover:shadow-lg"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">
              Student Dashboard Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how students track their progress with comprehensive analytics, test results, and performance metrics
            </p>
          </div>

          {/* Dashboard Image with Styling */}
          <div className="relative max-w-6xl mx-auto">
            {/* Main dashboard container with subtle shadows */}
            <div className="relative bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200">
              {/* Dashboard Image */}
              <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <img
                  src="dashboard.png"
                  alt="Student Dashboard Interface showing analytics, test results, and performance metrics"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Fading border effects */}
              <div className="absolute inset-0 rounded-2xl">
                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                {/* Left fade */}
                <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                {/* Right fade */}
                <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 opacity-20 blur-xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-6">
              Advanced Assessment Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive testing solutions designed for modern educational and professional environments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="text-black mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">
                Streamlined Assessment Process
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your testing methodology with our efficient, user-friendly platform that delivers
                professional results while saving valuable time and resources.
              </p>
              <div className="space-y-4">
                {benefitsList.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-black mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    <Zap className="w-12 h-12 mx-auto mb-2" />
                    Instant
                  </div>
                  <p className="text-gray-600">Result Generation</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    <Users className="w-12 h-12 mx-auto mb-2" />
                    Unlimited
                  </div>
                  <p className="text-gray-600">Participants</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    Advanced
                  </div>
                  <p className="text-gray-600">Analytics</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    <Trophy className="w-12 h-12 mx-auto mb-2" />
                    Real-time
                  </div>
                  <p className="text-gray-600">Leaderboards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your First Live Test
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Create engaging MCQ tests with real-time results in under 5 minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              onClick={() => router.push("/auth/verify?type=teacher")}
            >
              <Target className="w-4 h-4" />
              Teacher Login
            </button>
            <button
              className="bg-transparent text-white border border-gray-600 px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
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
              <div className="text-2xl font-bold mb-4">MCQ<span className="text-gray-600">Live</span></div>
              <p className="text-gray-600">
                Professional assessment solutions for modern educational environments
              </p>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}