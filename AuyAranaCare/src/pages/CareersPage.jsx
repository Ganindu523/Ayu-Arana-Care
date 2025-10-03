import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { animated, useSpring } from 'react-spring';
import { Transition } from '@headlessui/react';

const CareersPage = () => {
    const [openBranch, setOpenBranch] = useState(null);
    const [openRole, setOpenRole] = useState(null);
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOpenCareers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/careers');
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to fetch career opportunities.');
                }
                const data = await res.json();
                setCareers(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching open careers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOpenCareers();
    }, []);

    const toggleBranch = (id) => {
        setOpenBranch(openBranch === id ? null : id);
        setOpenRole(null);
    };

    const toggleRole = (id) => {
        setOpenRole(openRole === id ? null : id);
    };

    if (loading) {
        return <div className="text-center p-10 text-gray-700">Loading career opportunities...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <header className="text-center mb-10">
                {/* Main heading color changed to maroon */}
                <h1 className="text-4xl font-bold" style={{ color: '#800000' }}>Career Opportunities</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Join the Ayu Arana Care family and make a difference in the lives of our elders. We are dedicated to providing compassionate care and fostering a supportive community. Explore our rewarding career paths and grow with us.
                </p>
            </header>

            {careers.length === 0 && !loading && (
                   <p className="text-center text-gray-500 py-8">Currently, there are no open career opportunities. Please check back later!</p>
            )}

            <div className="space-y-4">
                {careers.map((branch) => (
                    <div key={branch._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <button
                            onClick={() => toggleBranch(branch._id)}
                            className="w-full flex justify-between items-center p-5 bg-white hover:bg-gray-50 focus:outline-none"
                            // Branch button background when open changed to light maroon tint
                            style={{ backgroundColor: openBranch === branch._id ? 'rgba(128, 0, 0, 0.05)' : 'white' }}
                        >
                            {/* Branch name color changed to maroon */}
                            <h2 className="text-xl font-semibold" style={{ color: '#800000' }}>{branch.name}</h2>
                            {/* Branch chevron icon color changed to maroon */}
                            <ChevronDownIcon
                                className={`h-6 w-6 transform transition-transform duration-300 ${openBranch === branch._id ? 'rotate-180' : ''}`}
                                style={{ color: '#800000' }}
                            />
                        </button>
                        <Transition
                            show={openBranch === branch._id}
                            enter="transition-all duration-300 ease-out"
                            enterFrom="max-h-0 opacity-0"
                            enterTo="max-h-screen opacity-100"
                            leave="transition-all duration-200 ease-in"
                            leaveFrom="max-h-screen opacity-100"
                            leaveTo="max-h-0 opacity-0"
                        >
                            {() => {
                                const springProps = useSpring({
                                    from: { opacity: 0, transform: 'translateY(-10px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                    config: { tension: 280, friction: 30 },
                                    delay: 50
                                });
                                return (
                                    <animated.div
                                        className="border-t border-gray-200 p-2 sm:p-4"
                                        // Inner background for roles container changed to a very light maroon tint
                                        style={{ ...springProps, backgroundColor: 'rgba(128, 0, 0, 0.02)' }}
                                    >
                                        <div className="space-y-3">
                                            {branch.roles.map((role) => (
                                                role.status === 'Open' && (
                                                    <div key={role._id} className="border bg-white border-gray-200 rounded-md">
                                                        <button
                                                            onClick={() => toggleRole(role._id)}
                                                            className="w-full flex justify-between items-center p-4 text-left"
                                                            // Role button background when open changed to a slightly lighter maroon tint
                                                            style={{ backgroundColor: openRole === role._id ? 'rgba(128, 0, 0, 0.03)' : 'white' }}
                                                        >
                                                            {/* Role title color changed to maroon */}
                                                            <span className="font-medium" style={{ color: '#800000' }}>{role.title}</span>
                                                            {/* Role chevron icon color changed to maroon */}
                                                            <ChevronDownIcon
                                                                className={`h-5 w-5 transform transition-transform duration-200 ${openRole === role._id ? 'rotate-180' : ''}`}
                                                                style={{ color: '#800000' }}
                                                            />
                                                        </button>
                                                        <Transition show={openRole === role._id}>
                                                            {() => {
                                                                const roleSpringProps = useSpring({
                                                                    from: { opacity: 0, transform: 'translateY(-5px)' },
                                                                    to: { opacity: 1, transform: 'translateY(0)' },
                                                                    config: { tension: 250, friction: 25 },
                                                                    delay: 30
                                                                });
                                                                return (
                                                                    <animated.div style={roleSpringProps} className="px-4 pb-4 border-t border-gray-100">
                                                                        <p className="mt-3 text-gray-600">{role.description}</p>
                                                                        <div className="mt-4">
                                                                            <h4 className="font-semibold text-gray-700 flex items-center">
                                                                                Requirements
                                                                            </h4>
                                                                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                                                                                {role.requirements.map((req, index) => (
                                                                                    <li key={index}>{req}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    </animated.div>
                                                                );
                                                            }}
                                                        </Transition>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </animated.div>
                                );
                            }}
                        </Transition>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareersPage;