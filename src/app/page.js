'use client'
import { useRouter } from "next/navigation";
import { Clock, BarChart3, Trophy, CheckCircle, ArrowRight, Users, Zap, Target } from "lucide-react";

export default function Home() {
  const router = useRouter();

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

  const benefits = [
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
                onClick={() => router.push("/auth/verify?type=student")}
              >
                <Users className="w-4 h-4" />
                Student Login
              </button>
              <button
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center gap-2"
                onClick={() => router.push("/auth/verify?type=teacher")}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                className="bg-black text-white px-8 py-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-semibold flex items-center gap-2 text-lg"
                onClick={() => router.push("/auth/verify?type=teacher")}
              >
                Begin Assessment Creation
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                className="bg-white text-black border border-gray-300 px-8 py-4 rounded-md hover:bg-gray-50 transition-colors duration-200 font-semibold text-lg"
                onClick={() => router.push("/auth/verify?type=student")}
              >
                Join Assessment
              </button>
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
                {benefits.map((benefit, index) => (
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