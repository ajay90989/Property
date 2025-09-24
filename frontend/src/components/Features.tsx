import { Shield, Search, TrendingUp, Users, Headphones, Award } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "Every property is verified by our expert team for authenticity and legal compliance.",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Advanced filters and AI-powered recommendations to find your perfect property match.",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Real-time market data, price trends, and investment analysis to make informed decisions.",
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Users,
      title: "Expert Agents",
      description: "Connect with certified, top-rated agents who specialize in your area of interest.",
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you at every step of your property journey.",
      color: "text-pink-600 bg-pink-100",
    },
    {
      icon: Award,
      title: "Trusted Platform",
      description: "Award-winning platform trusted by thousands of buyers, sellers, and agents nationwide.",
      color: "text-indigo-600 bg-indigo-100",
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Property?
          </h2>
          <p className="text-lg text-gray-600">
            Experience the difference with our comprehensive real estate platform designed for modern property seekers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ready to Find Your Dream Property?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Join thousands of satisfied customers who found their perfect property through Property
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Find My Property
              </button>
              <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
                List My Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}