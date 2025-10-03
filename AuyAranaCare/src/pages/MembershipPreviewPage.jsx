import React, { useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// --- Data for the membership plans ---
// This data can be fetched from your backend API in a real application.
const plans = [
  {
    id: 'basic',
    name: 'Basic Care',
    price: '30,000',
    currency: 'LKR',
    period: '/ month',
    description: 'Our Basic Care plan is the perfect starting point for families who want to stay connected and informed. It provides essential monitoring and regular communication, ensuring you have peace of mind knowing your loved one is safe and well-cared-for. This plan covers all the fundamentals with weekly updates and access to our community life.',
    features: [
      'Weekly Digital Health Summaries',
      'Access to Community Photo & Video Gallery',
      'Monthly Personal Activity Reports',
      'Standard Direct Messaging with Care Staff',
      '24/7 Emergency Support Notifications',
      'Access to Center Events Calendar',
    ],
    cta: 'Choose Basic Plan',
  },
  {
    id: 'enhanced',
    name: 'Enhanced Care',
    price: '45,000',
    currency: 'LKR',
    period: '/ month',
    description: 'For families seeking a more proactive role in their elder\'s care, the Enhanced Care plan offers deeper insights and more frequent, detailed communication. This package includes more direct access to medical updates and facilitates virtual face-to-face interactions, bridging the distance with technology and personalized attention.',
    features: [
      'All features from Basic Care',
      'Bi-Weekly Detailed Medical Status Updates',
      'Real-time Vitals Monitoring (on request)',
      'Priority Direct Messaging with Care Staff',
      'Twice-monthly Video Call Sessions (15 mins each)',
      'Ability to Submit One Check-up Request per Month',
    ],
    cta: 'Choose Enhanced Plan',
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: '60,000',
    currency: 'LKR',
    period: '/ month',
    description: 'Our Premium Care plan provides the ultimate peace of mind through comprehensive, high-touch engagement. Designed for families who desire the highest level of involvement, this all-inclusive package offers personalized consultations, unlimited access to services, and the most detailed reporting, ensuring every aspect of your loved one\'s care is managed and communicated with excellence.',
    features: [
      'All features from Enhanced Care',
      'Weekly Detailed Medical Status Updates',
      'On-demand Video Call Sessions (up to 4 per month)',
      'Unlimited Check-up Requests',
      'Monthly Personal Consultation with Head Nurse',
      'Personalized Meal & Activity Plan Access',
    ],
    cta: 'Choose Premium Plan',
  },
];

export default function MembershipPreviewPage() {
  // State to track the currently selected plan. 'basic' is the default.
  const [selectedPlanId, setSelectedPlanId] = useState('basic');

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* --- Page Header --- */}
        <div className="text-center">
          {/* Main heading color changed to maroon */}
          <h1 className="text-4xl font-bold" style={{ color: '#800000' }}>
            Our Membership Plans
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan to stay connected with your beloved elders.
          </p>
        </div>

        {/* --- Horizontal Plan Selector --- */}
        <div className="mt-10 flex justify-center bg-gray-200 p-2 rounded-xl shadow-inner">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`w-1/3 py-3 px-4 text-center text-sm sm:text-base font-semibold rounded-lg transition-colors duration-300 focus:outline-none ${
                selectedPlanId === plan.id
                  // Selected button: text changed to maroon
                  ? 'bg-white text-[#800000] shadow-md'
                  // Unselected button: hover background changed to a light maroon tint
                  : 'text-gray-600 hover:bg-red-100' // Use red-100 for a light maroon tint
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>

        {/* --- Animated Plan Details Container --- */}
        <div className="mt-8 relative h-auto sm:h-[30rem] overflow-hidden">
          {plans.map((plan) => (
            <Transition
              as={Fragment}
              key={plan.id}
              show={selectedPlanId === plan.id}
              // Animation for the new plan coming in
              enter="transform transition-all ease-in-out duration-500"
              enterFrom="opacity-0 translate-x-12"
              enterTo="opacity-100 translate-x-0"
              // Animation for the old plan going out
              leave="transform transition-all ease-in-out duration-500 absolute w-full top-0"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 -translate-x-12"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left Side: Plan Details */}
                  <div>
                    {/* Plan name color changed to maroon */}
                    <h3 className="text-2xl font-bold" style={{ color: '#800000' }}>{plan.name}</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">{plan.description}</p>
                    <div className="mt-6">
                      {/* Price color changed to maroon */}
                      <p className="text-4xl font-extrabold" style={{ color: '#800000' }}>
                        {plan.price}
                        <span className="ml-1 text-xl font-medium text-red-400"> {/* Currency/period color changed to a lighter maroon tint */}
                           {plan.currency}{plan.period}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Features List */}
                  <div>
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {/* CheckCircleIcon color changed to maroon */}
                          <CheckCircleIcon className="flex-shrink-0 h-6 w-6 mr-3" style={{ color: '#800000' }} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Transition>
          ))}
        </div>
      </div>
    </div>
  );
}