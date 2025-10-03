import React, { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ContactForm from "../components/ContactForm";
import { useSpring, animated, useTrail } from 'react-spring';

// --- Import Heroicons for Services ---
import {
    HeartIcon,
    HomeModernIcon,
    SwatchIcon,
    BoltIcon,
    PuzzlePieceIcon,
    VideoCameraIcon,
    TruckIcon,
    MusicalNoteIcon,
    ClockIcon,
    BanknotesIcon,
    PlusCircleIcon,
    EyeIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

// --- Custom Hook for Scroll Animations (Copied from Home.jsx) ---
const useInView = (options) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isInView];
};

// --- Animated Section Component (Copied from Home.jsx) ---
const AnimatedSection = ({ children, className }) => {
    const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });
    const animation = useSpring({
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        config: { tension: 280, friction: 40 },
    });

    return (
        <animated.div ref={ref} style={animation} className={className}>
            {children}
        </animated.div>
    );
};

// --- Data for Our Services Section (Updated with Heroicon components) ---
const servicesData = [
    {
        id: 'service1',
        title: 'Medical Care',
        description: '24/7 nursing supervision, precise medication management, and regular physician visits ensure continuous health monitoring.',
        icon: PlusCircleIcon,
        image: '/images/service-medical.jpg',
    },
    {
        id: 'service2',
        title: 'Housekeeping/Laundry Services',
        description: 'Relax and enjoy a hassle-free lifestyle, with our attentive housekeeping and laundry services taking care of the daily tasks, allowing you to focus on what truly matters.',
        icon: HomeModernIcon,
        image: '/images/service-housekeeping.jpg',
    },
    {
        id: 'service3',
        title: 'Nutritious Meals',
        description: 'Enjoy delicious, dietitian-approved meals prepared fresh daily, tailored to individual dietary needs. Assisted dining services ensure nourishing experiences.',
        icon: SwatchIcon,
        image: '/images/service-meals.jpg',
    },
    {
        id: 'service4',
        title: 'Physical Therapy and Rehabilitation',
        description: 'We offer on-site Physical, Occupational, and Speech Therapy to enhance functional abilities and aid recovery. Our programs include post-operative care and fall prevention.',
        icon: BoltIcon,
        image: '/images/service-therapy.jpg',
    },
    {
        id: 'service5',
        title: 'Social/Recreational Activities',
        description: 'Engage in diverse social and recreational activities, from creative workshops and group games to stimulating discussions. We encourage interaction and well-being.',
        icon: PuzzlePieceIcon,
        image: '/images/service-activities.jpg',
    },
    {
        id: 'service6',
        title: 'Video Conferencing Facility',
        description: 'Stay connected with loved ones near and far through our cutting-edge video conferencing facilities, bridging distances and fostering meaningful connections.',
        icon: VideoCameraIcon,
        image: '/images/service-video-call.jpg',
    },
    {
        id: 'service7',
        title: 'Transportation',
        description: 'Embark on seamless adventures beyond our doors with our reliable transportation services, ensuring your mobility needs are met with convenience and care.',
        icon: TruckIcon,
        image: '/images/service-transport.jpg',
    },
    {
        id: 'service8',
        title: 'Music, Art Activities/Library Facilities',
        description: 'Ignite your creativity and expand your horizons with our vibrant array of music, art activities, and well-stocked library facilities, offering endless opportunities for personal growth and enrichment.',
        icon: MusicalNoteIcon,
        image: '/images/service-art-music.jpg',
    },
    {
        id: 'service9',
        title: '24-hour Staff Availability',
        description: 'Our dedicated team is available around the clock, providing continuous care and immediate assistance whenever needed, ensuring peace of mind for residents and families.',
        icon: ClockIcon,
        image: '/images/service-24hr.jpg',
    },
    {
        id: 'service10',
        title: 'Affordable Packages',
        description: 'Experience exceptional care without compromising your budget. Our flexible and affordable packages are designed to provide high-quality services tailored to various financial needs.',
        icon: BanknotesIcon,
        image: '/images/service-packages.jpg',
    },
];


const About = () => {
    // Animation for the service cards
    const [trailRef, isInViewServices] = useInView({ threshold: 0.2, triggerOnce: true });
    const serviceTrail = useTrail(servicesData.length, {
        opacity: isInViewServices ? 1 : 0,
        transform: isInViewServices ? 'translateY(0)' : 'translateY(30px)',
        config: { mass: 1, tension: 280, friction: 30 },
        delay: 200,
    });


    return (
        <div className="bg-gray-100 text-gray-800">
            {/* Original About Us Section (NO CHANGES) - Wrapped in AnimatedSection */}
            <AnimatedSection className="px-6 py-12 max-w-5xl mx-auto">
                {/* Changed h1 color */}
                <h1 className="text-4xl font-bold mb-4 text-center" style={{ color: '#800000' }}>Ayu Arana Care: Guiding Your Life's Journey, Every Single Day.</h1>
                <p className="text-lg text-center text-gray-600">
                    Welcome to Ayu Arana Care – your trusted elder care service provider.
                    We aim to create a compassionate, safe, and enriching environment
                    where seniors thrive physically, mentally, and emotionally.
                </p>
            </AnimatedSection>

            {/* Vision and Mission Section - Wrapped in AnimatedSection */}
            <AnimatedSection className="px-6 py-12 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Our Vision Box */}
                <div
                    className="group relative overflow-hidden bg-red-50 rounded-lg shadow-md p-8 flex flex-col items-center text-center
                                transform transition-all duration-500 ease-in-out
                                hover:shadow-xl hover:-translate-y-1 hover:z-10
                                hover:bg-gradient-to-t from-[#800000] to-[#B22222]" // Darker maroon gradient on hover
                >
                    {/* Background icon for aesthetic, adjust opacity and position as needed */}
                    <EyeIcon className="absolute bottom-[-10%] right-[-10%] h-40 w-40 text-red-100 opacity-30 transition-all duration-500 ease-in-out group-hover:text-red-800 group-hover:opacity-10" />

                    <EyeIcon className="h-16 w-16 text-red-700 mb-4 transition-colors duration-500 ease-in-out group-hover:text-white" />
                    {/* Changed h2 color to be consistent with Home.jsx */}
                    <h2 className="text-3xl font-bold mb-4 transition-colors duration-500 ease-in-out group-hover:text-white" style={{ color: '#800000' }}>Our Vision</h2>
                    <p className="text-lg text-gray-700 transition-colors duration-500 ease-in-out group-hover:text-white">
                        To be the leading platform that seamlessly connects families with their loved ones in elder care, fostering peace of mind and active involvement in their well-being.
                    </p>
                </div>

                {/* Our Mission Box */}
                <div
                    className="group relative overflow-hidden bg-red-50 rounded-lg shadow-md p-8 flex flex-col items-center text-center
                                transform transition-all duration-500 ease-in-out
                                hover:shadow-xl hover:-translate-y-1 hover:z-10
                                hover:bg-gradient-to-t from-[#800000] to-[#B22222]" // Darker maroon gradient on hover
                >
                    {/* Background icon for aesthetic, adjust opacity and position as needed */}
                    <SparklesIcon className="absolute bottom-[-10%] right-[-10%] h-40 w-40 text-red-100 opacity-30 transition-all duration-500 ease-in-out group-hover:text-red-800 group-hover:opacity-10" />

                    <SparklesIcon className="h-16 w-16 text-red-700 mb-4 transition-colors duration-500 ease-in-out group-hover:text-white" />
                    {/* Changed h2 color to be consistent with Home.jsx */}
                    <h2 className="text-3xl font-bold mb-4 transition-colors duration-500 ease-in-out group-hover:text-white" style={{ color: '#800000' }}>Our Mission</h2>
                    <p className="text-lg text-gray-700 transition-colors duration-500 ease-in-out group-hover:text-white">
                        Ayu Arana Care is dedicated to bridging the communication gap between elder care centers and families by providing a timely, accessible, and user-friendly platform. We aim to empower families with real-time updates, reduce anxiety caused by distance, and facilitate seamless interactions, ensuring every elder receives comprehensive and connected care.
                    </p>
                </div>
            </AnimatedSection>

            {/* Our Services Section - Modified for animation */}
            <section className="bg-gray-100 text-gray-800 py-12">
                <div className="max-w-screen-xl mx-auto px-6">
                    {/* The new hero-like section for Services - Wrapped in AnimatedSection */}
                    <AnimatedSection className="md:flex md:items-start md:space-x-8 mb-10">
                        {/* Text Content */}
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            {/* Changed h2 color to be consistent with Home.jsx */}
                            <h2 className="text-4xl font-bold mb-4 text-center md:text-left" style={{ color: '#800000' }}>Our Services</h2>
                            <br></br>
                            <p className="text-lg text-center md:text-left text-gray-600 mb-4">
                                Discover our comprehensive range of services designed to provide unparalleled support and engaging activities, ensuring the highest standards of well-being and an enriched quality of life for all seniors.
                            </p>
                            <p className="text-lg text-center md:text-left text-gray-600">
                                From medical care to recreational programs, we are committed to creating a nurturing and vibrant community.
                            </p>
                        </div>
                        {/* Image */}
                        <div className="md:w-1/2 flex justify-center">
                            <img
                                src="/images/services.jpeg"
                                alt="Safe and Secure Elderly Care"
                                className="rounded-lg shadow-lg w-full max-w-lg"
                            />
                        </div>
                    </AnimatedSection>

                    {/* The original services grid content - Modified to use useTrail animation */}
                    <div ref={trailRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {serviceTrail.map((style, i) => {
                            const service = servicesData[i];
                            const Icon = service.icon;
                            return (
                                <animated.div
                                    key={service.id}
                                    style={style}
                                    className="flex items-start bg-white rounded-lg shadow-md p-6
                                            transform transition-all duration-300 ease-in-out
                                            hover:shadow-xl hover:-translate-y-1 hover:bg-[#FFF5F5]
                                            cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-opacity-50"
                                    tabIndex="0"
                                >
                                    {/* Service Icon: Now rendering Heroicon component */}
                                    <div className="flex-shrink-0 mr-4 text-4xl
                                                    w-16 h-16 flex items-center justify-center
                                                    rounded-full bg-red-100 // Lighter red/maroon tint for initial background
                                                    group-hover:bg-[#800000] transition-colors duration-300"> {/* Darker maroon background on hover */}
                                        <Icon className="h-10 w-10 text-red-700 group-hover:text-white transition-colors duration-300" /> {/* Lighter maroon for icon, white on hover for contrast */}
                                    </div>
                                    {/* Service Text Content */}
                                    <div>
                                        {/* Changed h3 color */}
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-[#800000] transition-colors duration-300" style={{ color: '#800000' }}>{service.title}</h3>
                                        <p className="text-gray-700 text-sm">{service.description}</p>
                                    </div>
                                </animated.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Us Section - Wrapped in AnimatedSection */}
            <AnimatedSection className="px-6 py-12 max-w-3xl mx-auto bg-gray-100">
                {/* Changed h2 color */}
                <h2 className="text-4xl font-bold mb-4 text-center" style={{ color: '#800000' }}>Contact Us</h2>
                <ContactForm />
            </AnimatedSection>
        </div>
    );
};

export default About;