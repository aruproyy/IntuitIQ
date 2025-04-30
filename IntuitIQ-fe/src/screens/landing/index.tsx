import { SignInButton } from '@clerk/clerk-react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { 
  ArrowRight, 
  Brain, 
  CheckCheck, 
  CheckCircleIcon, 
  Wallet, 
  Calculator,
  Sigma,
  Square,
  FunctionSquare,
  PieChart,
  Divide,
  Plus,
  Minus,
  X,
  Equal,
  Pi,
  Infinity as InfinityIcon
} from 'lucide-react';
import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Enhanced Floating Math Symbols Component
const FloatingMathSymbols = () => {
  const symbols = [
    { 
      Icon: Sigma,
      top: '15%', 
      left: '5%', 
      delay: 0, 
      duration: 25,
      color: 'text-indigo-300/80',
      size: 48
    },
    { 
      Icon: Square,
      top: '25%', 
      left: '85%', 
      delay: 2, 
      duration: 20,
      color: 'text-purple-300/80',
      size: 48
    },
    { 
      Icon: FunctionSquare,
      top: '75%', 
      left: '10%', 
      delay: 4, 
      duration: 30,
      color: 'text-pink-300/80',
      size: 48
    },
    { 
      Icon: Calculator,
      top: '65%', 
      left: '90%', 
      delay: 1, 
      duration: 35,
      color: 'text-yellow-300/80',
      size: 48
    },
    { 
      Icon: PieChart,
      top: '45%', 
      left: '15%', 
      delay: 3, 
      duration: 25,
      color: 'text-blue-300/80',
      size: 48
    },
    { 
      Icon: Divide,
      top: '20%', 
      left: '25%', 
      delay: 5, 
      duration: 40,
      color: 'text-green-300/80',
      size: 48
    },
    { 
      Icon: Plus,
      top: '80%', 
      left: '75%', 
      delay: 2.5, 
      duration: 30,
      color: 'text-red-300/80',
      size: 48
    },
    { 
      Icon: Minus,
      top: '60%', 
      left: '50%', 
      delay: 1.5, 
      duration: 35,
      color: 'text-orange-300/80',
      size: 48
    },
    { 
      Icon: X,
      top: '35%', 
      left: '65%', 
      delay: 3.5, 
      duration: 25,
      color: 'text-teal-300/80',
      size: 48
    },
    { 
      Icon: Equal,
      top: '55%', 
      left: '35%', 
      delay: 4.5, 
      duration: 20,
      color: 'text-indigo-300/80',
      size: 48
    },
    { 
      Icon: Pi,
      top: '30%', 
      left: '45%', 
      delay: 6, 
      duration: 40,
      color: 'text-purple-300/80',
      size: 48
    },
    { 
      Icon: InfinityIcon,
      top: '70%', 
      left: '25%', 
      delay: 7, 
      duration: 30,
      color: 'text-pink-300/80',
      size: 48
    },
  ];

  return (
    <>
      {symbols.map(({ Icon, ...symbol }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.2, 0.8],
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            rotate: [0, Math.random() * 360 - 180, 0]
          }}
          transition={{
            duration: symbol.duration,
            delay: symbol.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          className={`absolute pointer-events-none ${symbol.color}`}
          style={{ top: symbol.top, left: symbol.left }}
        >
          <Icon size={symbol.size} className={symbol.color} />
        </motion.div>
      ))}
    </>
  );
};

// Animated component wrapper
const AnimatedSection = ({ children, delay = 0.2 }: { children: React.ReactNode; delay?: number }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
  const handleMouseEnter = () => autoplay.current.stop();
  const handleMouseLeave = () => autoplay.current.play();

  const creators = [
    {
      name: "Arup Roy",
      photo: "https://avatars.githubusercontent.com/u/155263895?v=4",
      dept_college: "ECE 2025, Future Institute of Engineering and Management",
      details: "JAVA Programmer, Frontend Developer",
      github: "https://github.com/aruproyy",
      linkedin: "https://www.linkedin.com/in/arup-roy299/",
      leetcode: "https://leetcode.com/u/Arup299/"
    },
    {
      name: "Debolina Saha",
      photo: "https://avatars.githubusercontent.com/u/156057665?v=4",
      dept_college: "ECE 2025, Future Institute of Engineering and Management",
      details: "JAVA Programmer, UI/UX designer",
      github: "https://github.com/sdebolina",
      linkedin: "https://www.linkedin.com/in/debolina-saha-58b27a289",
      leetcode: "https://leetcode.com/u/Debolinaarya/"
    },
    {
      name: "Himesh Bhattacharjee",
      photo: "https://avatars.githubusercontent.com/u/155549081?v=4",
      dept_college: "ECE 2025, Future Institute of Engineering and Management",
      details: "C++/Python Coder, Web Developer, AI/ML Enthusiast",
      github: "https://github.com/HimeshBhattacharjee",
      linkedin: "https://www.linkedin.com/in/himeshbhattacharjee/",
      leetcode: "https://leetcode.com/u/traataphoenix/"
    },
    {
      name: "Priyanka Bal",
      photo: "https://avatars.githubusercontent.com/u/159651316?v=4",
      dept_college: "ECE 2025, Future Institute of Engineering and Management",
      details: "JAVA Programmer, Web Developer",
      github: "https://github.com/priyanka-bal44",
      linkedin: "https://www.linkedin.com/in/priyanka-bal-168828288/",
      leetcode: "https://leetcode.com/u/priyanka-4444/"
    },
  ];

  // Features data
  const features = [
    {
      title: "Interactive Canvas",
      description: "Draw, write, solve, and visualize mathematical problems in real-time with our intuitive canvas.",
      Icon: Square,
      animation: {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
      }
    },
    {
      title: "AI-Powered Solutions",
      description: "Solve complex equations and problems using advanced AI models like Gemini and Mistral.",
      Icon: Brain,
      animation: {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
      }
    },
    {
      title: "History Management",
      description: "Effortlessly revisit and review previously generated solutions at any time.",
      Icon: FunctionSquare,
      animation: {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
      }
    }
  ];

  return (
    <div className="font-sans overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 overflow-hidden">
        <FloatingMathSymbols />
        
        {/* Animated background elements */}
        <motion.div 
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, 200, 0],
            y: [0, -150, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
          >
            <motion.span 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
              className="inline-block"
            >
              Solve
            </motion.span> <span className="text-yellow-300">Math Problems</span> Like Never Before
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-indigo-200 mb-8"
          >
            IntuitIQ combines AI power with intuitive design to help you master mathematics.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <SignInButton>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-lg hover:bg-indigo-100 transition flex items-center gap-2 text-lg"
              >
                Get Started <ArrowRight size={20} />
              </motion.button>
            </SignInButton>
            
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition flex items-center gap-2 text-lg"
            >
              Learn More
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 mb-6 bg-indigo-100 px-6 py-3 rounded-full"
              >
                <CheckCheck className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-bold text-indigo-800">Why Choose IntuitIQ?</h2>
              </motion.div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Discover the powerful features that make IntuitIQ the ultimate math companion.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ Icon, ...feature }, idx) => (
              <AnimatedSection key={idx} delay={0.1 * idx}>
                <motion.div
                  variants={feature.animation}
                  whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.3)" }}
                  className="bg-white p-8 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all h-full flex flex-col items-center text-center relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      x: [-100, 300],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear"
                    }}
                    className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100/20 rounded-full blur-xl"
                  />
                  
                  <motion.div 
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="mb-6 p-4 bg-indigo-100 rounded-full"
                  >
                    <Icon size={48} className="text-indigo-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <motion.div
                whileHover={{ rotate: -5 }}
                className="inline-flex items-center gap-3 mb-6 bg-indigo-100 px-6 py-3 rounded-full"
              >
                <Wallet className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-bold text-indigo-800">Simple Pricing</h2>
              </motion.div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Get all features without worrying about costs.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-xl border-2 border-indigo-200 max-w-md mx-auto relative overflow-hidden"
            >
              <motion.div
                animate={{
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
                className="absolute top-10 right-10 text-indigo-300/30"
              >
                <Pi size={80} />
              </motion.div>
              
              <motion.div
                animate={{
                  x: [0, -30, 0],
                  y: [0, 20, 0],
                  rotate: [0, -180, -360]
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
                className="absolute bottom-10 left-10 text-purple-300/30"
              >
                <InfinityIcon size={80} />
              </motion.div>

              <h3 className="text-3xl font-bold text-center text-gray-800 mb-6 relative z-10">Free Forever</h3>
              
              <div className="space-y-4 mb-8 relative z-10">
                {[
                  "Interactive Canvas",
                  "AI-Powered Solutions",
                  "Step-by-Step Explanations",
                  "Real-Time Equation Solving",
                  "Unlimited History"
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                <div>
                  <span className="text-5xl font-bold text-gray-800">₹0</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
                <SignInButton>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium text-lg"
                  >
                    Start Calculating
                  </motion.button>
                </SignInButton>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>

      {/* Team Section */}
      <div id="team" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 mb-6 bg-indigo-100 px-6 py-3 rounded-full"
              >
                <Brain className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-bold text-indigo-800">Meet the Team</h2>
              </motion.div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                The brilliant minds behind IntuitIQ
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Carousel
              withIndicators
              loop
              height={450}
              slideGap="md"
              plugins={[autoplay.current]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="max-w-6xl mx-auto"
              styles={{
                indicator: {
                  backgroundColor: '#4F46E5',
                  width: '12px',
                  height: '4px',
                  transition: 'width 250ms ease',
                  '&[data-active]': {
                    width: '40px',
                  },
                },
              }}
            >
              {creators.map((creator, idx) => (
                <Carousel.Slide key={idx}>
                  <motion.div
                    whileHover={{ scale: 0.98 }}
                    className="bg-white rounded-xl shadow-lg h-full flex flex-col lg:flex-row items-center p-8 gap-8 relative overflow-hidden"
                  >
                    <motion.div
                      animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 25,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear"
                      }}
                      className="absolute top-5 right-5 text-indigo-100/20"
                    >
                      <Sigma size={80} />
                    </motion.div>
                    
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10"
                    >
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        className="relative"
                      >
                        <img
                          src={creator.photo}
                          alt={creator.name}
                          className="w-32 h-32 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-indigo-500 shadow-md"
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                          className="absolute inset-0 rounded-full border-4 border-indigo-300"
                        />
                      </motion.div>
                    </motion.div>
                    <div className="text-center lg:text-left relative z-10">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {creator.name}
                      </h3>
                      <p className="text-gray-700 font-medium mb-2 text-lg">{creator.dept_college}</p>
                      <p className="text-gray-600 mb-6 text-lg">{creator.details}</p>
                      <div className="flex justify-center lg:justify-start gap-4">
                        {[
                          { name: 'GitHub', url: creator.github, icon: '/github.svg' },
                          { name: 'LinkedIn', url: creator.linkedin, icon: '/linkedin.svg' },
                          { name: 'LeetCode', url: creator.leetcode, icon: '/leetcode.svg' },
                        ].map((social, i) => (
                          <motion.a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -5, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white p-3 rounded-full shadow-md hover:shadow-lg hover:bg-indigo-50 transition"
                          >
                            <img src={social.icon} alt={social.name} width={24} />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </AnimatedSection>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-700 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Math Experience?</h2>
            <p className="text-indigo-200 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of students and professionals who are solving math problems smarter with IntuitIQ.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block"
            >
              <SignInButton>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-indigo-700 font-bold px-10 py-5 rounded-lg hover:bg-indigo-50 transition flex items-center gap-3 mx-auto text-xl"
                >
                  Get Started for Free <ArrowRight size={24} />
                </motion.button>
              </SignInButton>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                IntuitIQ
              </h3>
              <p className="text-gray-400 mt-2 text-lg">The smart way to solve math problems</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 text-lg">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
              <a href="#team" className="text-gray-300 hover:text-white transition">Team</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-lg">
            <p>&copy; {new Date().getFullYear()} IntuitIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}