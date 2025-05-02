import { SignInButton } from "@clerk/clerk-react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Brain, CheckCircleIcon, Calculator, Sigma, Square, FunctionSquare, PieChart, Divide, Plus, Minus, X, Equal, Pi, Infinity as InfinityIcon, Database, FileSearch, GitBranch, Sparkles, Zap, ChevronDown, Triangle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  return mousePosition;
};

const FloatingMathSymbols = () => {
  const symbols = [
    { Icon: Sigma, top: "15%", left: "5%", delay: 0, duration: 25, color: "text-indigo-300/80", size: 80 },
    { Icon: Square, top: "25%", left: "85%", delay: 0, duration: 20, color: "text-purple-300/80", size: 80 },
    { Icon: Triangle, top: "35%", left: "75%", delay: 0, duration: 20, color: "text-orange-300/80", size: 80 },
    { Icon: FunctionSquare, top: "75%", left: "10%", delay: 1, duration: 30, color: "text-pink-300/80", size: 80 },
    { Icon: Calculator, top: "65%", left: "90%", delay: 1, duration: 35, color: "text-yellow-300/80", size: 80 },
    { Icon: PieChart, top: "45%", left: "15%", delay: 0, duration: 25, color: "text-blue-300/80", size: 80 },
    { Icon: Divide, top: "20%", left: "25%", delay: 1, duration: 40, color: "text-green-300/80", size: 80 },
    { Icon: Plus, top: "80%", left: "75%", delay: 1.5, duration: 30, color: "text-red-300/80", size: 80 },
    { Icon: Minus, top: "60%", left: "50%", delay: 1, duration: 35, color: "text-orange-300/80", size: 80 },
    { Icon: X, top: "35%", left: "65%", delay: 0.5, duration: 25, color: "text-teal-300/80", size: 80 },
    { Icon: Equal, top: "55%", left: "35%", delay: 1, duration: 20, color: "text-indigo-300/80", size: 80 },
    { Icon: Pi, top: "30%", left: "45%", delay: 0, duration: 40, color: "text-purple-300/80", size: 80 },
    { Icon: InfinityIcon, top: "70%", left: "25%", delay: 1.5, duration: 30, color: "text-pink-300/80", size: 80 },
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
            rotate: [0, Math.random() * 360 - 180, 0],
          }}
          transition={{
            duration: symbol.duration,
            delay: symbol.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
          className={`absolute pointer-events-none ${symbol.color}`}
          style={{ top: symbol.top, left: symbol.left }}
        >
          <Icon className={symbol.color} style={{ width: symbol.size, height: symbol.size }} />
        </motion.div>
      ))}
    </>
  );
};

const InteractiveGrid = () => {
  const { x, y } = useMousePosition();
  const gridSize = 15;
  const gridItems = Array.from({ length: gridSize * gridSize });
  return (
    <div className="absolute inset-0 grid grid-cols-15 grid-rows-15 gap-1 opacity-10 pointer-events-none">
      {gridItems.map((_, i) => {
        const col = i % gridSize;
        const row = Math.floor(i / gridSize);
        const distance = Math.sqrt(
          Math.pow(col - (x / window.innerWidth) * gridSize, 2) +
            Math.pow(row - (y / window.innerHeight) * gridSize, 2)
        );
        const scale = 1 - Math.min(distance / 10, 0.8);
        return (
          <motion.div
            key={i}
            animate={{
              scale,
              backgroundColor: `rgba(139, 92, 246, ${0.2 * scale})`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full h-full rounded-sm bg-purple-500"
          />
        );
      })}
    </div>
  );
};

const HeroText = () => {
  const texts = ["Solve", "Visualize", "Understand", "Master"];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative h-20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 text-6xl font-black bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  index: number;
}

const FeatureCard = ({ title, description, Icon, index }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-0.5"
    >
      <motion.div animate={{ opacity: isHovered ? 1 : 0 }} className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 blur-md" />
      <div className="relative h-full bg-gray-900 rounded-[calc(1rem-2px)] p-8 flex flex-col items-center">
        <motion.div animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.1 : 1 }} className="mb-6 p-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
          <Icon className="text-white" style={{ width: 32, height: 32 }} />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">{title}</h3>
        <p className="text-gray-400 text-center">{description}</p>
        <motion.div animate={{ width: isHovered ? "100%" : "0%", opacity: isHovered ? 1 : 0 }} className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
      </div>
    </motion.div>
  );
};

interface TeamMember {
  name: string;
  photo: string;
  dept_college: string;
  details: string;
  github: string;
  linkedin: string;
  leetcode: string;
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div whileHover="hover" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} className="relative rounded-2xl overflow-hidden">
      <motion.div variants={{ hover: { scale: 1.05 } }} className="relative h-full bg-gradient-to-br from-gray-900 to-gray-800 p-0.5">
        <motion.div animate={{ opacity: isHovered ? 1 : 0.5, scale: isHovered ? 1.2 : 1 }} className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-500/30" />
        <div className="relative h-full bg-gray-900 rounded-[calc(1rem-2px)] p-8 flex flex-col items-center">
          <motion.div animate={{ y: isHovered ? -10 : 0, rotate: isHovered ? 5 : 0 }} className="relative mb-6">
            <img src={member.photo} alt={member.name} className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-indigo-500 shadow-md" />
            <motion.div animate={{ scale: [1, 1.05, 1.1, 1.15], opacity: [0.3, 0.4, 0.5, 0.6] }} transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }} className="absolute inset-0 rounded-full border-4 border-indigo-300" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
          <p className="text-purple-400 mb-2">{member.dept_college}</p>
          <p className="text-gray-400 text-center mb-6">{member.details}</p>
          <div className="flex gap-4">
            {[
              { name: "GitHub", url: member.github, icon: "/github.svg" },
              { name: "LinkedIn", url: member.linkedin, icon: "/linkedin.svg" },
              { name: "LeetCode", url: member.leetcode, icon: "/leetcode.svg" },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-800 p-3 rounded-full hover:bg-gradient-to-r from-purple-500 to-indigo-500"
              >
                <img src={social.icon} alt={social.name} width={20} />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PricingCard = ({ title, price, period, features, isPopular = false }: { title: string; price: string; period: string; features: string[]; isPopular?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative rounded-2xl bg-gradient-to-br ${isPopular ? 'from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30' : 'from-gray-900/50 to-gray-800/50 border border-gray-800'} p-0.5 overflow-hidden`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
          POPULAR
        </div>
      )}
      <div className="relative h-full bg-gray-900 rounded-[calc(1rem-2px)] p-8 flex flex-col">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{price}</span>
          <span className="text-gray-400">/{period}</span>
        </div>
        <ul className="flex-1 space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-300">
              <CheckCircleIcon className="text-green-400 flex-shrink-0" style={{ width: 16, height: 16 }} />
              {feature}
            </li>
          ))}
        </ul>
        <SignInButton>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 rounded-lg font-bold ${isPopular ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Get Started
          </motion.button>
        </SignInButton>
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const handleMouseEnter = () => autoplay.current.stop();
  const handleMouseLeave = () => autoplay.current.play();
  const creators: TeamMember[] = [
    {
      name: "Arup Roy",
      photo: "https://avatars.githubusercontent.com/u/155263895?v=4",
      dept_college: "ECE 2025, FIEM",
      details: "JAVA Programmer, Frontend Developer",
      github: "https://github.com/aruproyy",
      linkedin: "https://www.linkedin.com/in/arup-roy299/",
      leetcode: "https://leetcode.com/u/Arup299/",
    },
    {
      name: "Debolina Saha",
      photo: "https://avatars.githubusercontent.com/u/156057665?v=4",
      dept_college: "ECE 2025, FIEM",
      details: "JAVA Programmer, UI/UX designer",
      github: "https://github.com/sdebolina",
      linkedin: "https://www.linkedin.com/in/debolina-saha-58b27a289",
      leetcode: "https://leetcode.com/u/Debolinaarya/",
    },
    {
      name: "Himesh Bhattacharjee",
      photo: "https://avatars.githubusercontent.com/u/155549081?v=4",
      dept_college: "ECE 2025, FIEM",
      details: "C++/Python Coder, Web+AI Developer",
      github: "https://github.com/HimeshBhattacharjee",
      linkedin: "https://www.linkedin.com/in/himeshbhattacharjee/",
      leetcode: "https://leetcode.com/u/traataphoenix/",
    },
    {
      name: "Priyanka Bal",
      photo: "https://avatars.githubusercontent.com/u/159651316?v=4",
      dept_college: "ECE 2025, FIEM",
      details: "JAVA Programmer, Web Developer",
      github: "https://github.com/priyanka-bal44",
      linkedin: "https://www.linkedin.com/in/priyanka-bal-168828288/",
      leetcode: "https://leetcode.com/u/priyanka-4444/",
    },
  ];
  const features = [
    {
      title: "Interactive Canvas",
      description: "Draw, write, solve, and visualize mathematical problems in real-time with our intuitive canvas.",
      Icon: Square,
    },
    {
      title: "AI-Powered Solutions",
      description: "Solve complex equations and problems using advanced AI models like Gemini and Mistral.",
      Icon: Brain,
    },
    {
      title: "History Management",
      description: "Effortlessly revisit and review previously generated solutions at any time.",
      Icon: Database,
    },
    {
      title: "Step-by-Step Explanations",
      description: "Understand the solution process with detailed breakdowns of each step.",
      Icon: FileSearch,
    },
    {
      title: "Real-Time Collaboration",
      description: "Work together with classmates or colleagues on the same problem simultaneously.",
      Icon: GitBranch,
    },
    {
      title: "Smart Suggestions",
      description: "Get intelligent recommendations for similar problems to deepen your understanding.",
      Icon: Sparkles,
    },
  ];
  return (
    <div className="font-sans bg-gray-950 text-white overflow-x-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <FloatingMathSymbols />
        <InteractiveGrid />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-indigo-900/30" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-3 mb-6 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 px-6 py-3 rounded-full border border-purple-500/30">
            <Zap className="text-yellow-400" style={{ width: 20, height: 20 }} />
            <span className="text-sm font-medium text-purple-200">NOW AVAILABLE</span>
          </motion.div>
          <HeroText />
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Math Problems</span> Like Never Before
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-xl text-purple-200 mb-10 max-w-3xl mx-auto">
            IntuitIQ combines cutting-edge AI with intuitive design to transform how you learn and solve mathematics.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="flex flex-col sm:flex-row justify-center gap-4">
            <SignInButton>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition flex items-center justify-center gap-2 text-lg">
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight style={{ width: 20, height: 20 }} className="relative z-10" />
                <motion.div
                  animate={{ x: [-100, 300], opacity: [0, 0.3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-y-0 w-20 bg-white/30 skew-x-[-30deg]"
                />
              </motion.button>
            </SignInButton>
            <motion.a href="#features" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-transparent border-2 border-purple-500/30 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500/10 transition flex items-center justify-center gap-2 text-lg">
              Explore Features
            </motion.a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute bottom-10 transform -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="text-purple-300 text-center flex flex-col items-center justify-center">
            <ChevronDown style={{ width: 24, height: 24 }} />
          </motion.div>
        </motion.div>
      </section>
      <section id="features" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Powerful Features</span>
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">Everything you need to master mathematics at any level</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} title={feature.title} description={feature.description} Icon={feature.Icon} index={index} />
            ))}
          </div>
        </div>
      </section>
      <section id="pricing" className="relative py-20 bg-gradient-to-br from-gray-900 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Simple Pricing</span>
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">Choose the plan that fits your needs</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              title="Starter"
              price="$0"
              period="month"
              features={[
                "Basic problem solving",
                "Limited AI queries (50/month)",
                "Community support",
                "Basic visualization tools"
              ]}
            />
            <PricingCard
              title="Pro"
              price="$9"
              period="month"
              features={[
                "Advanced problem solving",
                "500 AI queries/month",
                "Step-by-step solutions",
                "Priority support",
                "Collaboration features"
              ]}
              isPopular
            />
            <PricingCard
              title="Enterprise"
              price="$29"
              period="month"
              features={[
                "Unlimited AI queries",
                "Premium support",
                "Team management",
                "Advanced analytics",
                "API access",
                "Custom integrations"
              ]}
            />
          </div>
        </div>
      </section>
      <section className="relative py-20 bg-gradient-to-br from-gray-900 to-gray-950 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">Interactive Learning</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">Experience mathematics like never before with our dynamic, hands-on approach to problem solving.</p>
              <ul className="space-y-4">
                {["Drag-and-drop equation building", "Real-time visualization", "Instant feedback", "Adaptive difficulty"].map((item, index) => (
                  <motion.li key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="flex items-center gap-3 text-lg text-gray-300">
                    <CheckCircleIcon className="text-green-400 flex-shrink-0" style={{ width: 20, height: 20 }} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 pointer-events-none" />
                <div className="h-8 bg-gray-800 flex items-center px-4 border-b border-gray-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="bg-gray-900 p-8 aspect-video flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 5, repeat: Infinity }} className="text-center">
                    <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">∫x²dx</div>
                    <div className="text-4xl font-bold text-white">= ⅓x³ + C</div>
                  </motion.div>
                </div>
              </div>
              <motion.div animate={{ x: [0, 20, 0], y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }} className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />
              <motion.div animate={{ x: [0, -20, 0], y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }} className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>
      <section id="team" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Meet Our Team</span>
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">The brilliant minds behind IntuitIQ</p>
          </motion.div>
          <Carousel
            withIndicators
            loop
            height={500}
            slideGap="xl"
            plugins={[autoplay.current]}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="max-w-6xl mx-auto"
            styles={{
              indicator: {
                backgroundColor: "#8B5CF6",
                width: "30px",
                height: "4px",
                transition: "width 250ms ease",
                "&[data-active]": {
                  width: "40px",
                  backgroundColor: "#7C3AED",
                },
              },
              controls: {
                margin: "-60px 0",
              },
            }}
          >
            {creators.map((creator, idx) => (
              <Carousel.Slide key={idx}>
                <TeamMemberCard member={creator} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
      </section>
      <section className="relative py-32 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">Transform</span> Your Math Experience?
            </h2>
            <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">Join thousands of students and professionals who are solving math problems smarter with IntuitIQ.</p>
            <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
              <SignInButton>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-10 py-5 rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition flex items-center gap-3 mx-auto text-xl"
                >
                  Start Your Journey <ArrowRight style={{ width: 24, height: 24 }} />
                </motion.button>
              </SignInButton>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <footer className="relative py-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center mb-6 md:mb-0 md:text-left">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">IntuitIQ</h3>
              <p className="text-gray-400 mt-2">The smart way to solve math problems</p>
            </div>
            <div className="flex flex-col items-center justify-center sm:flex-row gap-6">
              <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
              <a href="#team" className="text-gray-400 hover:text-white transition">Team</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} IntuitIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}