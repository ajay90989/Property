import { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  User,
  Building,
  Calendar,
  Send,
  CheckCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ContactPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: 'residential'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: "123 Business District, Bangalore, Karnataka 560001",
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 98765 43210",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@bhoolink.com",
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "Mon-Sat: 9:00 AM - 7:00 PM\nSun: 10:00 AM - 4:00 PM",
      action: "Schedule Visit"
    }
  ];

  const officeLocations = [
    {
      city: "Mumbai",
      address: "456 Business Park, Bandra West, Mumbai 400050",
      phone: "+91 98765 43211",
      email: "mumbai@bhoolink.com"
    },
    {
      city: "Delhi",
      address: "789 Corporate Center, Connaught Place, New Delhi 110001",
      phone: "+91 98765 43212",
      email: "delhi@bhoolink.com"
    },
    {
      city: "Pune",
      address: "321 Tech Hub, Koregaon Park, Pune 411001",
      phone: "+91 98765 43213",
      email: "pune@bhoolink.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Get in Touch with BhooLink</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Ready to find your dream property or start your real estate journey? Our expert team is here to help you every step of the way.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="investment">Investment</option>
                        <option value="rental">Rental</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What can we help you with?"
                      required
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Tell us about your requirements, budget, preferred location, etc."
                      required
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <info.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                    <p className="text-gray-600 mb-3 whitespace-pre-line">{info.details}</p>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      {info.action}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">Need Immediate Help?</h3>
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us Now
                </Button>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Office Locations */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Office Locations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit us at any of our locations across major cities in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officeLocations.map((location, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{location.city}</h3>
                  <p className="text-gray-600 mb-4">{location.address}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{location.phone}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{location.email}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50">
                    Get Directions
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get quick answers to common questions about our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white">
              <h3 className="font-semibold text-gray-900 mb-3">How quickly can I expect a response?</h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 2-4 hours during business hours and within 24 hours on weekends.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="font-semibold text-gray-900 mb-3">Do you charge for initial consultations?</h3>
              <p className="text-gray-600">
                No, all initial consultations and property searches are completely free. We only charge commission upon successful transactions.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="font-semibold text-gray-900 mb-3">Can you help with property financing?</h3>
              <p className="text-gray-600">
                Yes, we have partnerships with leading banks and financial institutions to help you secure the best home loan rates and terms.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="font-semibold text-gray-900 mb-3">Do you handle legal documentation?</h3>
              <p className="text-gray-600">
                We work with experienced legal professionals to ensure all property documentation is properly verified and processed.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Property Journey?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you're buying, selling, or investing, our expert team is here to guide you through every step of the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => onNavigate('properties')}
            >
              Browse Properties
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => onNavigate('agents')}
            >
              Meet Our Agents
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}