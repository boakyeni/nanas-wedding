'use client'
import { useState } from 'react';
import ThankYou from './ThankYou';

const RSVP = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        attending: 'yes',
        plusOne: false,  
        plusOneName: '',
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

    const handleAttendingClick = (value) => {
        setFormData({
            ...formData,
            attending: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
          const response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          
          const data = await response.json();
        //   await new Promise(resolve => setTimeout(resolve, 1500))
          
          if (response.status === 201) {
            // Successfully submitted
            setSubmitted(true);
            setIsSubmitting(false);
          } else {
            // Use the error message from your Flask backend
            throw new Error(data.error || 'Submission failed. Please try again.');
          }
        } catch (err) {
          console.error('RSVP submission error:', err);
          setError('Something went wrong. Please try again.');
          setIsSubmitting(false);
        }
      };


    // Common style for selection buttons
    const buttonCommonClasses = "px-8 py-3 rounded-md border text-sm font-medium transition-all duration-300 shadow-sm";
    
    // Gold gradient for selected state
    const goldGradient = "linear-gradient(to right, #b29043, #f1c27d, #b29043)";
    
    // Deep purple for selected state (alternative to gold gradient)
    const purpleGradient = "linear-gradient(to right, #4a1d96, #7e22ce, #4a1d96)";

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
                            <div className="space-y-8">
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
                                    <p className="block text-sm font-medium text-gray-700 mb-3">Will you be attending?</p>
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                        <button
                                            type="button"
                                            className={`${buttonCommonClasses} ${formData.attending === 'yes' ? 'text-white ' : 'text-gray-700 border-gray-300 hover:border-purple-300'}`}
                                            style={formData.attending === 'yes' ? { background: goldGradient } : {}}
                                            onClick={() => handleAttendingClick('yes')}
                                        >
                                            Yes, I&apos;ll be there
                                        </button>
                                        <button
                                            type="button"
                                            className={`${buttonCommonClasses} ${formData.attending === 'no' ? 'text-white ' : 'text-gray-700 border-gray-300 hover:border-purple-300'}`}
                                            style={formData.attending === 'no' ? { background: purpleGradient } : {}}
                                            onClick={() => handleAttendingClick('no')}
                                        >
                                            No, I&apos;ll celebrate in spirit
                                        </button>
                                    </div>
                                </div>

                                {formData.attending === 'yes' && (
                                    <>
                                        <div>
                                            {/* <p className="block text-sm font-medium text-gray-700 mb-3">Are you bringing a plus one?</p>
                                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                                <button
                                                    type="button"
                                                    className={`${buttonCommonClasses} ${formData.plusOne ? 'text-white ' : 'text-gray-700 border-gray-300 hover:border-purple-300'}`}
                                                    style={formData.plusOne ? { background: goldGradient } : {}}
                                                    onClick={() => setFormData({ ...formData, plusOne: true })}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${buttonCommonClasses} ${formData.plusOne === false ? 'text-white ' : 'text-gray-700 border-gray-300 hover:border-purple-300'}`}
                                                    style={formData.plusOne === false ? { background: purpleGradient } : {}}
                                                    onClick={() => setFormData({ ...formData, plusOne: false, plusOneName: '' })}
                                                >
                                                    No
                                                </button>
                                            </div> */}

                                            {/* Show name input only if they are bringing a plus one */}
                                            {/* {formData.plusOne && (
                                                <div className="mt-6">
                                                    <label htmlFor="plusOneName" className="block text-sm font-medium text-gray-700">
                                                        Plus One's Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="plusOneName"
                                                        name="plusOneName"
                                                        value={formData.plusOneName || ''}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full px-4 py-3 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                        placeholder="Enter their full name"
                                                        required={formData.plusOne}
                                                    />
                                                </div>
                                            )} */}
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
                                        className="px-10 py-3 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                                        style={{ background: 'linear-gradient(to right, #4a1d96, #7e22ce, #4a1d96)' }}
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
                    <p>If you have any questions, please visit the <a href='/guide#faq' className='underline'>FAQs</a></p>
                    <p className="text-purple-700 font-medium"></p>
                </div>
            </div>
        </div>
    );
};

export default RSVP;