import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { contactService } from '../services/contactService';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const subjects = [
    'General Inquiry',
    'Property Information',
    'Schedule Viewing',
    'Investment Consultation',
    'Rental Assistance',
    'Technical Support',
    'Other'
  ];

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Message length validation
    if (formData.message && formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await contactService.submitContact(formData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setErrors({ submit: error.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <Button 
            onClick={() => setSuccess(false)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <MessageSquare className="mr-3 h-8 w-8 text-blue-600" />
          Contact Us
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="mr-2 h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="mr-2 h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Phone and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="mr-2 h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2">
                Subject *
              </Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => handleInputChange('subject', value)}
              >
                <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2">
              Message *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us how we can help you..."
              rows={6}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            <p className="text-gray-500 text-sm mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
