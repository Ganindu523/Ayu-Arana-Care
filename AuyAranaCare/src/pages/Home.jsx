// C:\Users\ASUS\Desktop\ayu arana care\test-app\frontend\src\pages\Home.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated, useTransition, useTrail } from 'react-spring';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, ShieldCheckIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

// --- Slideshow Image Paths ---
const slides = ['/images/slide1.jpg', 'images/slide2.jpg', 'images/slide3.jpg', 'images/slide4.jpg'];

// --- Data for the "Why Choose Us" section ---
const features = [
    {
        icon: HeartIcon,
        title: 'Compassionate Care',
        description: 'Our core philosophy is to provide care with empathy, respect, and kindness, treating every resident like family.',
    },
    {
        icon: ShieldCheckIcon,
        title: 'Safe & Secure Environment',
        description: 'We ensure a safe, clean, and secure home with 24/7 monitoring and professional staff always on duty.',
    },
    {
        icon: UserGroupIcon,
        title: 'Community & Connection',
        description: 'We foster a vibrant community, keeping families connected and residents engaged with life and each other.',
    },
];

// --- Custom Hook for Scroll Animations ---
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

// --- Animated Section Component ---
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

// --- Main Home Page Component ---
export default function Home() {
    const [index, setIndex] = useState(0); // For slideshow
    const [feedbackData, setFeedbackData] = useState([]); // Fetched feedback for home page
    const [feedbackLoading, setFeedbackLoading] = useState(true);

    // Feedback Slider specific state
    const TESTIMONIALS_PER_PAGE = 3; // Number of testimonials to show per slide
    const [feedbackPageIndex, setFeedbackPageIndex] = useState(0); // Current page index for feedback

    // Ref for the testimonial card to manage hover state directly
    const testimonialCardRefs = useRef([]);
    if (testimonialCardRefs.current.length !== feedbackData.length) {
      testimonialCardRefs.current = Array(feedbackData.length).fill().map((_, i) => testimonialCardRefs.current[i] || React.createRef());
    }

    // Fetch all feedback for home page
    useEffect(() => {
        const fetchFeedbackForHome = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/feedback/home');
                setFeedbackData(response.data);
            } catch (error) {
                console.error("Error fetching home page feedback:", error);
                // Optional: set some dummy data if fetch fails for development
                // For testing purposes, uncomment this to ensure slider works with more data
                // setFeedbackData([
                //     { _id: '1', message: 'Elder Care Home\'s compassionate team understood my mom\'s needs, giving me confidence in my decision for her care.', name: 'Ruwan de Silva', occupation: 'Senior Software Engineer' },
                //     { _id: '2', message: 'Moving my dad to ElderCare Home was easy thanks to their personalized approach and welcoming environment.', name: 'Silvia Peiris', occupation: 'Bank Officer' },
                //     { _id: '3', message: 'Eager to explore options for my loved one\'s care, I stumbled upon ElderCare\'s digital platform. Little did I know, this virtual portal would become my lifeline, offering a wealth of information and support as I navigated the journey ahead.', name: 'Jeewan Mahanama', occupation: 'Accountant' },
                //     { _id: '4', message: 'Best service from a dedicated team. Highly recommend for elder care. They truly care about the residents.', name: 'Teran Perera', occupation: 'Student' },
                //     { _id: '5', message: 'The communication is excellent and the staff is very kind and supportive.', name: 'Vimu Fernando', occupation: 'Developer' },
                //     { _id: '6', message: 'My family and I are very grateful for the wonderful environment provided. It feels like a true home.', name: 'K.W.M.K.V.Bandara', occupation: 'Engineer' },
                //     { _id: '7', message: 'Happy happy happy with the care and attention my relative receives every day here.', name: 'Chamod Alwis', occupation: 'Designer' },
                //     { _id: '8', message: 'Good good good, truly a blessing to find such a caring place for our elders.', name: 'Chamod Tharusha Alwis', occupation: 'Marketing Specialist' },
                //     { _id: '9', message: 'Exceptional support and peace of mind knowing my loved one is in such capable hands. Fantastic service.', name: 'Srimani Alwis', occupation: 'Lawyer' },
                // ]);
            } finally {
                setFeedbackLoading(false);
            }
        };
        fetchFeedbackForHome();
    }, []);

    // Auto-advance slideshow
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((state) => (state + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Feedback Slider Auto-advance (Optional)
    useEffect(() => {
        if (feedbackData.length > TESTIMONIALS_PER_PAGE) { // Only auto-advance if there are more than one page
            const totalPages = Math.ceil(feedbackData.length / TESTIMONIALS_PER_PAGE);
            const feedbackInterval = setInterval(() => {
                setFeedbackPageIndex(prevIndex => (prevIndex + 1) % totalPages);
            }, 5000); // Change feedback page every 5 seconds
            return () => clearInterval(feedbackInterval);
        }
        return () => { /* noop */ };
    }, [feedbackData, TESTIMONIALS_PER_PAGE]);

    // Slideshow navigation functions
    const prevSlide = () => setIndex((state) => (state - 1 + slides.length) % slides.length);
    const nextSlide = () => setIndex((state) => (state + 1) % slides.length);

    // Slideshow transitions configuration
    const slideshowTransitions = useTransition(index, {
        key: index,
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0, position: 'absolute' },
        config: { mass: 1, tension: 200, friction: 20 },
    });

    // Feedback Slider animation
    const totalFeedbackPages = Math.ceil(feedbackData.length / TESTIMONIALS_PER_PAGE);
    const sliderAnimation = useSpring({
        transform: `translateX(-${feedbackPageIndex * 100}%)`,
        config: { tension: 200, friction: 30 }
    });

    // Navigation for feedback slider
    const nextFeedbackPage = () => {
        setFeedbackPageIndex((prevIndex) => (prevIndex + 1) % totalFeedbackPages);
    };

    const prevFeedbackPage = () => {
        setFeedbackPageIndex((prevIndex) => (prevIndex - 1 + totalFeedbackPages) % totalFeedbackPages);
    };

    // Animation for the feature cards
    const [trailRef, isInView] = useInView({ threshold: 0.3, triggerOnce: true });
    const trail = useTrail(features.length, {
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        config: { mass: 1, tension: 280, friction: 30 },
        delay: 200,
    });

    return (
        // Main page background set to bg-gray-100
        <div className="bg-gray-100 text-gray-800">
            {/* --- Hero Section --- */}
            <AnimatedSection>
                {/* Inherits bg-gray-100 from parent */}
                <div className="text-center py-16 px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" style={{ color: '#800000' }}>
                        Welcome to Ayu Arana Care
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Bringing Families Closer, Caring from the Heart.
                    </p>
                </div>
            </AnimatedSection>

            {/* --- Slideshow Section --- */}
            <div className="relative w-full max-w-screen-2xl mx-auto h-64 md:h-[500px] rounded-2xl shadow-2xl overflow-hidden mb-24">
                {slideshowTransitions((style, i) => (
                    <animated.img
                        key={slides[i]}
                        src={slides[i]}
                        alt={`Slide ${i + 1}`}
                        className="absolute w-full h-full object-cover object-center z-10"
                        style={{ ...style }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/1200x500/ff0000/ffffff?text=Image+Load+Error";
                            console.error(`Failed to load slideshow image: ${slides[i]}`);
                        }}
                    />
                ))}
                {/* Navigation Buttons */}
                <div className="absolute inset-0 flex items-center justify-between p-4 z-20">
                    <button onClick={prevSlide} className="bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none" aria-label="Previous Slide">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button onClick={nextSlide} className="bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none" aria-label="Next Slide">
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                </div>
                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => setIndex(i)} className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === i ? 'bg-white scale-125' : 'bg-white/50'}`}></button>
                    ))}
                </div>
            </div>

            {/* --- About Us Section --- */}
            {/* Set to bg-gray-100 explicitly */}
            <AnimatedSection className="max-w-screen-xl mx-auto px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-16 items-center bg-gray-100">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#800000' }}>About Us</h2>
                    <p className="text-gray-600 leading-relaxed">
                        At Ayu Arana Care, we are dedicated to providing a nurturing, safe, and engaging environment for our elderly residents. Our mission is to bridge the distance between families and their loved ones through transparent communication and compassionate care. We believe in upholding the dignity and independence of every individual, ensuring they receive the personalized attention they deserve.
                    </p>
                    <a href="/about" className="hover:underline mt-6 inline-block font-semibold" style={{ color: '#800000' }}>
                        Learn More About Our Mission &rarr;
                    </a>
                </div>
                <div className="flex justify-center">
                    <img src="/images/about.png" alt="Group of happy elders and staff" className="rounded-2xl shadow-xl w-full max-w-md object-cover"/>
                </div>
            </AnimatedSection>

            {/* --- Feedback Slider Section --- */}
            {/* Changed to bg-gray-100 to match overall background */}
            <div className="bg-gray-100 py-16 px-4 mb-24 relative overflow-hidden">
                <AnimatedSection>
                    {/* Heading color changed to #800000 and size to text-3xl font-bold */}
                    <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#800000' }}>What They Are Talking About Our Caring</h2>
                    {/* Added description with text-gray-600 color */}
                    <p className="mt-4 text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
                        We provide more than just care; we provide a home.
                    </p>
                </AnimatedSection>

                {feedbackLoading ? (
                    <p className="col-span-full text-center text-gray-600 mt-8">Loading testimonials...</p>
                ) : feedbackData.length === 0 ? (
                    <p className="col-span-full text-center text-gray-600 mt-8">No testimonials to display yet.</p>
                ) : (
                    <div className="max-w-screen-xl mx-auto relative">
                        <animated.div
                            style={{
                                ...sliderAnimation,
                                '--items-per-page': TESTIMONIALS_PER_PAGE,
                                '--gap': '1.5rem', /* equivalent to Tailwind's gap-x-6 */
                            }}
                            className="flex gap-x-6" // Apply gap to the flex container
                        >
                            {feedbackData.map((feedback, i) => (
                                <div
                                    key={feedback._id}
                                    className="flex-shrink-0 p-3" // Padding for card wrapper
                                    style={{
                                        width: `calc(100% / var(--items-per-page) - (var(--gap) * (var(--items-per-page) - 1) / var(--items-per-page)))`,
                                    }}
                                >
                                    <div
                                        className="group rounded-xl shadow-lg flex flex-col justify-between h-full min-h-[200px] sm:min-h-[250px] md:min-h-[280px]
                                                   transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-2"
                                        // Default background: bg-red-50, changes to white on hover
                                        style={{ backgroundColor: 'rgb(254 242 242)' }} /* Tailwind's bg-red-50 */
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(254 242 242)'}
                                    >
                                        <div className="flex items-start p-3">
                                            <div
                                                className="rounded-full p-2 transition-colors duration-300"
                                                // Default background: #800000, On Hover: White
                                                style={{ backgroundColor: '#800000' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#800000'}
                                            >
                                                <ChatBubbleLeftRightIcon
                                                    className="h-6 w-6 transition-colors duration-300"
                                                    // Default icon color: white, On Hover: #800000
                                                    style={{ color: 'white' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = '#800000'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-base leading-relaxed mb-6 flex-grow px-3">
                                            {feedback.message}
                                        </p>
                                        <div className="px-3 pb-3">
                                            <p className="font-semibold text-lg text-gray-900">{feedback.name}</p>
                                            {feedback.occupation && <p className="text-gray-500 text-sm">{feedback.occupation}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </animated.div>

                        {/* Navigation Buttons */}
                        {feedbackData.length > TESTIMONIALS_PER_PAGE && (
                            <>
                                <button
                                    onClick={prevFeedbackPage}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none z-10"
                                    aria-label="Previous Testimonial"
                                >
                                    <ChevronLeftIcon className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextFeedbackPage}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none z-10"
                                    aria-label="Next Testimonial"
                                >
                                    <ChevronRightIcon className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Navigation Dots */}
                {feedbackData.length > TESTIMONIALS_PER_PAGE && (
                    <div className="mt-8 flex justify-center space-x-2">
                        {Array.from({ length: totalFeedbackPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setFeedbackPageIndex(i)}
                                // Changed active dot color to #800000
                                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${feedbackPageIndex === i ? 'scale-125' : 'bg-gray-300'}`}
                                style={{ backgroundColor: feedbackPageIndex === i ? '#800000' : '' }} // Apply maroon only if active
                                aria-label={`Go to testimonial page ${i + 1}`}
                            ></button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Why Choose Us Section --- */}
            {/* Set to bg-gray-100 explicitly */}
            <div className="bg-gray-100 py-24">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <AnimatedSection>
                        <h2 className="text-3xl font-bold" style={{ color: '#800000' }}>Why Choose Ayu Arana?</h2>
                        <p className="mt-4 text-lg text-gray-600">We provide more than just care; we provide a home.</p>
                    </AnimatedSection>
                    <div ref={trailRef} className="mt-12 grid md:grid-cols-3 gap-8">
                        {trail.map((style, i) => {
                            const Icon = features[i].icon;
                            return (
                                <animated.div
                                    key={features[i].title}
                                    style={{ backgroundColor: 'rgb(254 242 242)', ...style }} /* Default bg-red-50 */
                                    className="group rounded-2xl shadow-lg p-8 transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-2"
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(254 242 242)'}
                                >
                                    <div className="flex items-start justify-center mb-4"> {/* Centered icon horizontally */}
                                        <div
                                            className="rounded-full p-2 transition-colors duration-300"
                                            style={{ backgroundColor: '#800000' }} /* Default background: #800000 */
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#800000'}
                                        >
                                            <Icon
                                                className="h-12 w-12 transition-colors duration-300"
                                                style={{ color: 'white' }} /* Default icon color: white */
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#800000'} /* On Hover: #800000 */
                                                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{features[i].title}</h3>
                                    <p className="text-gray-600">{features[i].description}</p>
                                </animated.div>
                            );
                        })}
                    </div>
                </div>
            </div >

            {/* --- About Our Nurses Section --- */}
            {/* Set to bg-gray-100 explicitly */}
            <AnimatedSection className="max-w-screen-xl mx-auto px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-16 items-center bg-gray-100">
                <div className="flex justify-center md:order-2">
                    <img src="/images/nurse.png" alt="A caring nurse with a resident" className="rounded-2xl shadow-xl w-full max-w-md object-cover" />
                </div>
                <div className="text-center md:text-left md:order-1">
                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#800000' }}>Our Dedicated Nursing Team</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our team of professional nurses and caregivers is the heart of Ayu Arana Care. Each member is highly trained, experienced, and chosen for their empathy and dedication to elder care. They provide not just medical assistance but also companionship, emotional support, and a friendly face, ensuring your loved ones feel at home and cherished every day.
                    </p>
                </div>
            </AnimatedSection>

        </div >
    );
}

