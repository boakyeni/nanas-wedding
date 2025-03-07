'use client'
import { useState } from 'react';
import { useRouter } from 'next/router';
import ThankYou from './ThankYou';

const RSVP = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    guests: 0,
    dietaryRestrictions: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      attending: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
        // Send data to your backend
        // const response = await fetch('/api/rsvp', { 
        //   method: 'POST', 
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(formData) 
        // });
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Check if the request was successful
        if (true) {
          setSubmitted(true);
          setIsSubmitting(false);
          
          
        } else {
          // Handle API error responses
          const errorData = await response.json();
          throw new Error(errorData.error || 'Submission failed');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-purple-100">
      {/* Decorative header with gold pattern */}
      <div className="h-16" style={{ background: 'linear-gradient(to right, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)' }}></div>
      
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* RSVP Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-amber-200">
          {/* Card Header */}
          <div className="p-6 text-center" style={{ background: 'linear-gradient(to right, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)' }}>
            <h1 className="text-3xl font-serif text-white">RSVP</h1>
            <p className="text-amber-100 mt-2 font-light">We look forward to celebrating with you</p>
          </div>
          
          {submitted ? (
            <ThankYou />
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-b29043 text-stone-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">Will you be attending?</p>
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <input
                        id="attending-yes"
                        name="attending"
                        type="radio"
                        value="yes"
                        checked={formData.attending === 'yes'}
                        onChange={handleRadioChange}
                        className="h-5 w-5 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="attending-yes" className="ml-2 text-sm text-gray-700">
                        Yes, I'll be there
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="attending-no"
                        name="attending"
                        type="radio"
                        value="no"
                        checked={formData.attending === 'no'}
                        onChange={handleRadioChange}
                        className="h-5 w-5 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="attending-no" className="ml-2 text-sm text-gray-700">
                        No, I'll celebrate in spirit
                      </label>
                    </div>
                  </div>
                </div>
                
                {formData.attending === 'yes' && (
                  <>
                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Number of Additional Guests</label>
                      <input
                        type="number"
                        pattern="[0-9]*"
                        id="guests"
                        name="guests"
                        min="0"
                        max="5"
                        value={formData.guests}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Not including yourself</p>
                    </div>
                    
                    <div>
                      <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
                      <input
                        type="text"
                        id="dietaryRestrictions"
                        name="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={handleChange}
                        placeholder="Vegetarian, Vegan, Gluten-free, etc."
                        className="mt-1 block w-full px-4 py-3 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  ></textarea>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-900 text-white font-medium rounded-md shadow-md hover:from-purple-800 hover:to-purple-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="flex justify-center mt-12">
          <div className="w-16 h-1 rounded-full" style={{ background: 'linear-gradient(to right, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)' }}></div>
        </div>
        
        <div className="mt-12 text-center text-gray-600">
          <p>If you have any questions, please contact us at</p>
          <p className="text-purple-700 font-medium">celebrate@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default RSVP;