import React, { useState, useEffect, Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { CheckCircleIcon, XMarkIcon, StarIcon, CreditCardIcon, CalendarIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/UserContext.jsx';

// This data can be fetched from your backend API in a real application.
const plans = [
  {
    id: 'basic',
    name: 'Basic Care',
    price: '30,000',
    currency: 'LKR',
    period: '/ month',
    description: 'Essential monitoring and regular communication to ensure your loved one is safe and well-cared-for.',
    features: [
      'Weekly Digital Health Summaries',
      'Access to Community Photo & Video Gallery',
      'Monthly Personal Activity Reports',
      'Standard Direct Messaging with Care Staff',
    ],
  },
  {
    id: 'enhanced',
    name: 'Enhanced Care',
    price: '45,000',
    currency: 'LKR',
    period: '/ month',
    description: 'Deeper insights and more frequent, detailed communication for a more proactive role in your elder\'s care.',
    features: [
      'All features from Basic Care',
      'Bi-Weekly Detailed Medical Status Updates',
      'Priority Direct Messaging with Care Staff',
      'Twice-monthly Video Call Sessions',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: '60,000',
    currency: 'LKR',
    period: '/ month',
    description: 'The ultimate peace of mind through comprehensive, high-touch engagement and personalized consultations.',
    features: [
      'All features from Enhanced Care',
      'Weekly Detailed Medical Status Updates',
      'On-demand Video Call Sessions',
      'Monthly Personal Consultation with Head Nurse',
    ],
  },
];

export default function MembershipPage() {
  // We can still use the context for user info if needed elsewhere
  const { user } = useAuth(); 
  const [currentPlanId, setCurrentPlanId] = useState('none');
  const [selectedPlanId, setSelectedPlanId] = useState('none');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  // Fetch the user's current membership plan on component load
  useEffect(() => {
    const fetchMembership = async () => {
      // Get the token directly from localStorage to bypass any context timing issues.
      const token = localStorage.getItem('userToken');

      // If the token does not exist in storage, then the user is truly not logged in.
      if (!token) {
        setLoading(false);
        setError("You must be logged in to view this page.");
        return;
      }

      // If a token exists, we can proceed to fetch the membership data.
      setError('');
      
      try {
        const response = await fetch('/api/membership', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Could not fetch your membership status. Please try logging in again.');
        }

        const data = await response.json();
        setCurrentPlanId(data.planId);
        setSelectedPlanId(data.planId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Run the fetch function when the component mounts.
    fetchMembership();
  }, []); // The empty dependency array ensures this effect runs only once.

  const handleSelectPlan = (planId) => {
    if (planId !== currentPlanId) {
      setSelectedPlanId(planId);
      setIsModalOpen(true);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) {
        setError("Your session has expired. Please log in again.");
        return;
    }

    setPaymentSubmitting(true);
    setError('');

    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    try {
      const response = await fetch('/api/payments/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: parseFloat(selectedPlan.price.replace(/,/g, '')),
          currency: selectedPlan.currency,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process payment.');
      }
      setCurrentPlanId(data.planId);
      setIsModalOpen(false);
      alert('Payment successful! Your membership has been updated.');
    } catch (err) {
      setError(err.message);
      alert(`Payment Failed: ${err.message}`);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const selectedPlanForModal = plans.find(p => p.id === selectedPlanId);

  // --- RENDER LOGIC ---
  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center p-12 text-gray-500">Loading your membership details...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
             <div className="text-center p-12 text-red-600 font-semibold">{error}</div>
        </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            {/* Main heading color changed to maroon */}
            <h1 className="text-4xl font-extrabold sm:text-5xl" style={{ color: '#800000' }}>Manage Your Membership</h1>
            <p className="mt-4 text-xl text-gray-600">Choose the plan that best fits your needs to stay connected.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlanId;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl shadow-lg p-8 text-center flex flex-col relative transition-transform transform hover:scale-105 ${
                    isCurrent ? 'bg-[#800000] text-white ring-4' : 'bg-white text-gray-900'
                  }`}
                  style={{
                    // Apply light maroon ring for current plan
                    ...(isCurrent && { 'borderColor': 'rgba(128, 0, 0, 0.3)', 'boxShadow': '0 0 0 4px rgba(128, 0, 0, 0.3)' })
                  }}
                >
                  {isCurrent && (
                    <div className="absolute top-0 right-0 -mt-3 -mr-3">
                      {/* Current plan badge background changed to maroon */}
                      <span className="flex items-center text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#800000' }}>
                        <StarIcon className="h-4 w-4 mr-1" />
                        Current Plan
                      </span>
                    </div>
                  )}
                  {/* Plan name color for non-current plans changed to maroon */}
                  <h3 className="text-2xl font-bold" style={{ color: isCurrent ? 'white' : '#800000' }}>{plan.name}</h3>
                  <p className={`mt-4 text-4xl font-extrabold ${isCurrent ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                    <span className={`ml-1 text-xl font-medium ${
                      // Price currency/period color for current plan changed to light maroon
                      isCurrent ? 'text-red-200' : 'text-gray-500' // Using red-200 for a light maroon tint
                    }`}>
                      {plan.currency}{plan.period}
                    </span>
                  </p>
                  {/* Description color for current plan changed to light maroon */}
                  <p className={`mt-4 flex-grow ${isCurrent ? 'text-red-100' : 'text-gray-600'}`}>{plan.description}</p>
                  <ul className="mt-6 space-y-4 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {/* CheckCircleIcon color changed to maroon theme */}
                        <CheckCircleIcon className={`flex-shrink-0 h-6 w-6 mr-3 ${isCurrent ? 'text-red-300' : 'text-[#800000]'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent}
                    className={`w-full mt-8 py-3 px-6 font-semibold rounded-lg shadow-md transition-colors duration-300 ${
                      isCurrent
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        // Select Plan button color changed to maroon
                        : 'bg-[#800000] text-white hover:bg-[#660000]' // Darker maroon on hover
                    }`}
                  >
                    {isCurrent ? 'Your Current Plan' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-60" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Dialog title color changed to maroon */}
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 flex justify-between items-center" style={{ color: '#800000' }}>Confirm & Pay<button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200"><XMarkIcon className="h-6 w-6 text-gray-500" /></button></Dialog.Title>
                <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-4">
                  <div><p className="text-sm text-gray-600">You are upgrading to the <strong>{selectedPlanForModal?.name}</strong> plan.</p></div>
                  {/* Total Due Today background changed to light maroon tint */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(128, 0, 0, 0.05)' }}><p className="text-lg font-semibold">Total Due Today:</p><p className="text-3xl font-bold">{selectedPlanForModal?.price} <span className="text-base font-medium">{selectedPlanForModal?.currency}</span></p></div>
                  
                  {/* Simulated Card Form - Input fields and icons remain neutral gray for usability */}
                  <div><label className="block text-sm font-medium text-gray-700">Cardholder Name</label><div className="relative mt-1"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon className="h-5 w-5 text-gray-400"/></div><input type="text" required className="w-full rounded-md border-gray-300 pl-10 py-2" placeholder="J. Doe"/></div></div>
                  <div><label className="block text-sm font-medium text-gray-700">Card Number</label><div className="relative mt-1"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><CreditCardIcon className="h-5 w-5 text-gray-400"/></div><input type="text" required className="w-full rounded-md border-gray-300 pl-10 py-2" placeholder="0000 0000 0000 0000"/></div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">Expiry (MM/YY)</label><div className="relative mt-1"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><CalendarIcon className="h-5 w-5 text-gray-400"/></div><input type="text" required className="w-full rounded-md border-gray-300 pl-10 py-2" placeholder="MM/YY"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700">CVC</label><div className="relative mt-1"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><LockClosedIcon className="h-5 w-5 text-gray-400"/></div><input type="text" required className="w-full rounded-md border-gray-300 pl-10 py-2" placeholder="123"/></div></div>
                  </div>

                  <div className="mt-6">
                    {/* Payment button color changed to maroon */}
                    <button type="submit" disabled={paymentSubmitting} className="w-full inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#660000] focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 disabled:bg-gray-400" style={{ backgroundColor: '#800000' }}>
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      {paymentSubmitting ? 'Processing...' : `Pay ${selectedPlanForModal?.price} ${selectedPlanForModal?.currency}`}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div></div>
        </Dialog>
      </Transition>
    </>
  );
}