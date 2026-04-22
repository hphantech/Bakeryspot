/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Instagram, MapPin, Calendar, Heart, ArrowRight, Menu, X, Clock, Star, Quote, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const WORKSHOP_BENEFITS = [
  'Leer decoratieskills onder leiding van een echte bakexpert',
  'Ontdek je creatieve kant en maak een kunstwerk precies naar jouw smaak',
  'Leer decoreren als een pro!',
  'Geniet van een fijne en gezellige middag waarbij je leert in een kleine groep',
  'Neem je meesterwerk mee naar huis voor 6 tot 8 personen (t.w.v. 35 euro)'
];

const REVIEWS = [
  {
    author: 'Naomi Picton',
    rating: 5,
    date: '2 maanden geleden',
    content: 'I had a really lovely time at the cake decorating workshop last weekend. It was fun to learn different techniques and try them out myself. Christa communicated clearly, gave great instructions, and was very open and flexible about what we wanted to try.',
    scores: { 'Decorating': 5, 'Service': 5, 'Atmosphere': 5 }
  },
  {
    author: 'Lisa van Vliet',
    rating: 5,
    date: '2 maanden geleden',
    content: 'The cake workshop was super fun and enjoyable. Christa puts a lot of care and attention into the workshop. She takes you step by step through the cake decorating process. It\'s educational for the true enthusiast, but also a great way to have a fun outing. Everyone goes home with a completely different cake; you create something truly unique and personal. The cake was also delicious!',
    scores: { 'Food': 5, 'Service': 5, 'Atmosphere': 5 }
  },
  {
    author: 'Chidi Solomon',
    rating: 5,
    date: '2 maanden geleden',
    content: 'Delicious food, amazing service.',
    scores: { 'Food': 5, 'Service': 5, 'Atmosphere': 5 }
  },
  {
    author: 'BLB L',
    rating: 5,
    date: '2 maanden geleden',
    content: 'Ik heb samen met mijn moeder de cake workshop gedaan. Ik heb hier veel van geleerd! Christa gaf ons duidelijke en goede instructies en hielp waar nodig. Ook de sfeer was super gezellig met de mensen waar wij mee waren.',
    scores: { 'Eten': 5, 'Service': 5, 'Sfeer': 5 }
  }
];

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

const EVENT_TYPES = [
  'Babyshowers',
  'Vrijgezellenfeestjes',
  'Verjaardagsfeestjes',
  'Kinderfeestjes',
  'Bedrijfsuitjes',
  'Familie-uitjes',
  'Vriendinnenuitjes',
  'Moeder-dochter uitjes',
  'Privé- workshop'
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [igFeed, setIgFeed] = useState<InstagramPost[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    async function fetchFeed() {
      try {
        const response = await fetch('/api/instagram-feed');
        const data = await response.json();
        setIgFeed(data);
      } catch (error) {
        console.error("Failed to fetch IG feed", error);
      } finally {
        setIsLoadingFeed(false);
      }
    }
    fetchFeed();
  }, []);

  const nextReview = useCallback(() => {
    setCurrentReview((prev) => (prev + 1) % REVIEWS.length);
  }, []);

  const prevReview = useCallback(() => {
    setCurrentReview((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextReview, 5000);
    return () => clearInterval(timer);
  }, [nextReview]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div className="min-h-screen selection:bg-story-pink selection:text-story-burgundy">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-6 py-6 border-b border-story-pink/30 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-story-pink p-0.5 bg-white">
            <img src="/Images/Logo.jpg" alt="Bakery Spot Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tighter uppercase leading-none text-story-burgundy">Bakery Spot</span>
            <span className="text-[10px] uppercase tracking-[0.2em] italic text-story-burgundy opacity-70">Utrecht & Omstreken</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-10 items-center text-xs uppercase tracking-widest font-black text-story-burgundy">
          <a href="#home" className="hover:opacity-60 transition-opacity">Home</a>
          <a href="#workshops" className="hover:opacity-60 transition-opacity">Workshop</a>
          <a href="#for-who" className="hover:opacity-60 transition-opacity">Voor wie?</a>
          <a href="#vlog" className="hover:opacity-60 transition-opacity">Vlog</a>
          <a href="#instagram" className="hover:opacity-60 transition-opacity">Feed</a>
          <a href="#reviews" className="hover:opacity-60 transition-opacity">Reviews</a>
          <a href="https://www.instagram.com/bakeryspotnetherlands/" target="_blank" rel="noopener noreferrer" className="pill-button bg-story-burgundy text-white hover:opacity-90 shadow-xl">
            Booking via IG
          </a>
        </div>

        <button className="md:hidden text-story-burgundy" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-40 bg-story-cream pt-32 px-8 flex flex-col gap-8 text-2xl font-black uppercase text-center text-story-burgundy"
        >
          <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#workshops" onClick={() => setIsMenuOpen(false)}>Workshop</a>
          <a href="#for-who" onClick={() => setIsMenuOpen(false)}>Voor wie?</a>
          <a href="#vlog" onClick={() => setIsMenuOpen(false)}>Vlog</a>
          <a href="#instagram" onClick={() => setIsMenuOpen(false)}>Feed</a>
          <a href="#reviews" onClick={() => setIsMenuOpen(false)}>Reviews</a>
          <a 
            href="https://www.instagram.com/bakeryspotnetherlands/" 
            className="mt-4 bg-story-burgundy text-white py-5 rounded-full text-lg uppercase tracking-widest font-black"
            onClick={() => setIsMenuOpen(false)}
          >
            DM on Instagram
          </a>
        </motion.div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen md:h-screen flex items-center overflow-hidden pt-20">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/Images/Hero.png" 
            className="w-full h-full object-cover"
            alt="Bakery Spot Hero"
            onError={(e) => {
              // Fallback if Hero.png is empty or fails
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=2000";
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-story-cream via-story-cream/60 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-story-pink shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-story-pink animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-story-burgundy">Utrecht's Favorite Workshop</span>
              </div>
              
              <h1 className="text-7xl md:text-[8rem] font-black leading-[0.8] text-story-burgundy tracking-tighter uppercase">
                Art <br />
                <span className="text-story-pink drop-shadow-[4px_4px_0px_#7d3c4a]">Of Cake</span>
              </h1>

              <div className="max-w-xl space-y-6">
                <p className="text-xl md:text-2xl text-story-burgundy/80 font-medium leading-tight">
                  Ontdek de leukste én lekkerste bento cake workshop van het moment in onze sfeervolle studio.
                </p>
                <p className="text-story-burgundy/60 leading-relaxed font-medium">
                  Of je nu een babyshower plant, een vrijgezellenfeestje viert of gewoon een creatieve middag wilt: wij nemen je stap voor stap mee in de prachtige wereld van cake decorating.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#workshops" className="pill-button bg-story-burgundy text-white px-12 py-6 text-lg hover:scale-105 transition-transform shadow-2xl">
                  Bekijk Workshops
                </a>
                <a href="#vlog" className="pill-button bg-white text-story-burgundy border-2 border-story-burgundy px-8 py-6 text-lg flex items-center gap-3 group">
                  <span className="w-10 h-10 rounded-full bg-story-pink/20 flex items-center justify-center group-hover:bg-story-pink group-hover:text-white transition-colors">
                    <Play size={16} className="ml-0.5" />
                  </span>
                  Bekijk de Sfeer
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="relative">
                <div className="story-card bg-white p-12 relative z-10 rotate-3 transform transition-transform hover:rotate-0 duration-700">
                  <div className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-story-pink p-1 overflow-hidden">
                    <img src="/Images/Logo.jpg" className="w-full h-full object-contain" alt="Bakery Spot Logo" />
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="font-script text-4xl text-story-burgundy">Bakery Spot</h3>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-story-pink text-story-pink" />)}
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-40">100+ Happy Students</p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-story-pink/20 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-black text-story-burgundy">Bento</p>
                      <p className="text-[9px] uppercase font-bold opacity-40">Specialists</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-story-burgundy">Utrecht</p>
                      <p className="text-[9px] uppercase font-bold opacity-40">Location</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-story-pink/20 rounded-[3.5rem] blur-2xl -z-10 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workshop Section */}
      <section id="workshops" className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* Main Workshop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl rotate-[-2deg] relative z-10">
                <img 
                  src="/Images/RandomIGposts/Screenshot 2026-04-22 at 16-12-57 Instagram.png" 
                  alt="Workshop Bento Cakes" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-story-pink rounded-full blur-3xl opacity-30 -z-0" />
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="font-script text-7xl text-story-burgundy">Catering & Events</h2>
                <p className="text-xl font-bold text-story-burgundy leading-tight">
                  Laat je creativiteit de vrije loop, leer nieuwe skills én ga naar huis met een prachtige taart voor 6 tot 8 personen!
                </p>
              </div>

              {/* Specific Session Info from Story */}
              <div className="p-8 bg-story-pink/10 rounded-[2.5rem] border border-story-pink/30 space-y-6">
                <h4 className="text-xs uppercase font-black tracking-widest text-story-burgundy opacity-40">Volgende Sessie</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs uppercase font-bold opacity-50 tracking-widest">Datum</p>
                    <p className="font-black text-xl">Zondag 10 mei</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase font-bold opacity-50 tracking-widest">Tijd</p>
                    <p className="font-black text-xl">14:00 - 16:30</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase font-bold opacity-50 tracking-widest">Locatie</p>
                    <p className="font-black text-xl uppercase">Nieuwegein</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase font-bold opacity-50 tracking-widest">Prijs</p>
                    <p className="font-black text-xl text-story-pink drop-shadow-[1px_1px_0px_#7d3c4a]">€50,-</p>
                  </div>
                </div>
              </div>

              <div className="story-card space-y-6">
                 <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                   <Heart className="text-story-pink fill-story-pink" /> Wat kan je verwachten?
                 </h3>
                 <ul className="space-y-4">
                   {WORKSHOP_BENEFITS.map((benefit, i) => (
                     <li key={i} className="flex items-start gap-4 text-story-burgundy/80 font-medium">
                       <span className="w-2 h-2 rounded-full bg-story-pink shrink-0 mt-2" />
                       {benefit}
                     </li>
                   ))}
                 </ul>
              </div>

              <a 
                href="https://www.instagram.com/bakeryspotnetherlands/" 
                target="_blank" 
                className="pill-button bg-story-burgundy text-white w-full py-5 flex items-center justify-center gap-4 text-lg brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none font-black"
              >
                Schrijf je in via DM <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section id="for-who" className="py-24 px-6 bg-story-cream">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="font-script text-8xl text-story-burgundy">Voor wie?</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <p className="text-xl text-story-burgundy font-medium leading-relaxed italic">
                "Ontdek de kunst van het cake versieren en maak jouw perfecte taart! Leer tips en tricks om je eigen meesterwerk te creëren in een fijne en gezellige setting."
              </p>
              <p className="text-lg text-story-burgundy opacity-80">
                Van basisdecoraties tot creatieve hoogstandjes – deze workshop is voor iedereen die interesse heeft in bakken, van lekkere taartjes houdt of van gezelligheid houdt!
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-12 rounded-[3.5rem] border border-story-pink shadow-xl">
             <div className="text-left space-y-8 order-2 md:order-1">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-story-burgundy tracking-tight">
                    Schrijf je in op de groepsmomenten met een vastgestelde datum of huur ons in voor jouw evenement*, zoals bijvoorbeeld:
                  </h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {EVENT_TYPES.map((event, i) => (
                      <li key={i} className="flex items-center gap-3 text-story-burgundy font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-story-pink" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-6 border-t border-story-pink/20">
                  <p className="text-sm font-medium text-story-burgundy/60 italic mb-6">
                    Stuur vrijblijvend een bericht voor meer informatie over een cakeworkshop voor jouw evenement!
                  </p>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-30">
                    *groepen op eigen locatie in overleg
                  </p>
                </div>
             </div>

             <div className="order-1 md:order-2">
                <div className="relative inline-block">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-story-cream shadow-2xl relative z-10 mx-auto">
                    <img 
                      src="/Images/RandomIGposts/Screenshot 2026-04-22 at 16-13-30 Instagram.png" 
                      alt="Special Event Cake" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-story-pink/20 rounded-full blur-2xl -z-0" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Vlog Section */}
      <section id="vlog" className="py-24 px-6 bg-story-pink/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
               <h2 className="text-story-burgundy text-xs font-black uppercase tracking-[0.5em]">Experience</h2>
               <h3 className="text-6xl font-black uppercase tracking-tighter leading-none">Workshop <br/><span className="text-story-pink drop-shadow-[1px_1px_0px_#7d3c4a]">Vlog</span></h3>
               <p className="text-xl font-medium text-story-burgundy/70 leading-relaxed italic">
                 "Benieuwd naar de sfeer? Bekijk onze nieuwste vlog en ontdek hoe een middagje bakken eruit ziet in onze studio!"
               </p>
               <div className="flex gap-4">
                 <div className="bg-white p-6 rounded-3xl border border-story-pink shadow-lg flex-1">
                    <p className="text-4xl font-black text-story-burgundy mb-2">100+</p>
                    <p className="text-[10px] uppercase font-bold opacity-40">Tevreden cursisten</p>
                 </div>
                 <div className="bg-white p-6 rounded-3xl border border-story-pink shadow-lg flex-1">
                    <p className="text-4xl font-black text-story-burgundy mb-2">5/5</p>
                    <p className="text-[10px] uppercase font-bold opacity-40">Google Rating</p>
                 </div>
               </div>
            </div>
            <div className="order-1 lg:order-2">
               <div className="aspect-[9/16] max-w-[400px] mx-auto rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl relative group">
                  <video 
                    controls
                    className="w-full h-full object-cover"
                    poster="/Images/RandomIGposts/Screenshot 2026-04-22 at 16-14-27 Instagram.png"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  >
                    <source src="/Images/Videos/workshop_vlog.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                       <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50">
                          <Play fill="white" className="ml-1" />
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section id="instagram" className="py-24 px-6 bg-white overflow-hidden border-t border-story-pink/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <h2 className="text-story-burgundy text-xs font-black uppercase tracking-[0.5em]">Social Feed</h2>
               <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
                 Onze <span className="text-story-pink underline decoration-story-pink/30 decoration-8 underline-offset-8">Instagram</span>
               </h3>
            </div>
            <a 
              href="https://www.instagram.com/bakeryspotnetherlands/" 
              target="_blank" 
              className="text-story-burgundy font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:text-story-pink transition-colors group"
            >
              Follow @bakeryspotnetherlands <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {isLoadingFeed ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-story-pink/5 animate-pulse border border-story-pink/20" />
              ))
            ) : igFeed.length > 0 ? (
              igFeed.map((post, i) => (
                <motion.a 
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                  className={`aspect-square rounded-2xl overflow-hidden shadow-lg border border-story-pink group relative ${i % 2 === 0 ? 'mt-8' : ''}`}
                >
                  <img src={post.media_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.caption || 'Instagram Post'} />
                  <div className="absolute inset-0 bg-story-burgundy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Instagram className="text-white" size={32} />
                  </div>
                </motion.a>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-story-cream rounded-[3rem] border border-dashed border-story-pink/40">
                <p className="text-story-burgundy/40 font-black uppercase tracking-widest text-sm">
                  Feed tijdelijk niet beschikbaar. Bekijk onze Instagram voor updates!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-32 px-6 bg-story-cream/50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-story-burgundy text-xs font-black uppercase tracking-[0.5em] mb-4">Ervaringen</h2>
             <h3 className="text-5xl font-black uppercase tracking-tighter">Wat zeggen onze cursisten?</h3>
          </div>

          <div className="relative group">
            <div className="overflow-hidden min-h-[450px] md:min-h-[400px]">
              <motion.div 
                key={currentReview}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="story-card bg-white p-10 md:p-12 relative h-full flex flex-col"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-story-burgundy rounded-full flex items-center justify-center text-white font-black text-xl">
                      {REVIEWS[currentReview].author[0]}
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight">{REVIEWS[currentReview].author}</h4>
                      <p className="text-[10px] uppercase font-bold opacity-40">{REVIEWS[currentReview].date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(REVIEWS[currentReview].rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-story-pink text-story-pink" />
                    ))}
                  </div>
                </div>

                <p className="text-xl font-medium text-story-burgundy leading-relaxed italic mb-8 flex-grow">
                  "{REVIEWS[currentReview].content}"
                </p>

                <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-story-pink/20">
                   {Object.entries(REVIEWS[currentReview].scores).map(([label, score]) => (
                     <div key={label} className="flex items-center gap-2">
                       <span className="text-[10px] uppercase font-black opacity-40">{label}:</span>
                       <span className="font-black text-story-burgundy">{score}/5</span>
                     </div>
                   ))}
                </div>

                <div className="absolute top-6 right-10 text-story-pink opacity-10">
                   <Quote size={80} />
                </div>
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full md:-ml-12 p-3 rounded-full bg-white border border-story-pink shadow-xl text-story-burgundy hover:bg-story-pink hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full md:-mr-12 p-3 rounded-full bg-white border border-story-pink shadow-xl text-story-burgundy hover:bg-story-pink hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-10">
               {REVIEWS.map((_, i) => (
                 <button 
                   key={i} 
                   onClick={() => setCurrentReview(i)}
                   className={`h-2 rounded-full transition-all duration-300 ${i === currentReview ? 'w-8 bg-story-burgundy' : 'w-2 bg-story-pink opacity-40'}`}
                 />
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-story-cream px-6 py-32 border-t border-story-pink">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <img src="/public/Images/Logo.jpg" alt="Logo Footer" className="w-16 h-16 object-contain" />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tighter uppercase text-story-burgundy leading-none">Bakery Spot</span>
                <span className="text-[10px] uppercase font-bold tracking-widest italic opacity-50">Cakes and more</span>
              </div>
            </div>
            <p className="text-story-burgundy/60 leading-relaxed max-w-sm font-medium italic">
              "Ontdek de magie van het creëren van een prachtige cake, in een gezellige en fijne setting!"
            </p>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] opacity-40">Info & Links</h4>
            <div className="flex flex-col gap-4 font-black uppercase text-sm">
              <a href="#home">Home</a>
              <a href="#workshops">Workshops</a>
              <a href="https://www.instagram.com/bakeryspotnetherlands/">Privacy Policy</a>
            </div>
          </div>

          <div className="space-y-8">
             <h4 className="text-xs font-black uppercase tracking-[0.4em] opacity-40">Get in touch</h4>
             <a 
               href="https://www.instagram.com/bakeryspotnetherlands/" 
               target="_blank" 
               className="story-card flex items-center justify-between hover:bg-logo-pink/5 transition-all group"
             >
               <div>
                  <p className="text-xs font-bold opacity-50 mb-1 tracking-widest uppercase">Response time</p>
                  <p className="text-xl font-script tracking-tight">Within 24 hours</p>
               </div>
               <div className="p-4 bg-story-burgundy text-white rounded-2xl group-hover:scale-110 transition-transform">
                 <Instagram size={24} />
               </div>
             </a>
          </div>
        </div>
        <div className="mt-32 pt-12 border-t border-story-pink/20 text-center flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30">© {new Date().getFullYear()} Bakery Spot Utrecht</p>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-story-burgundy/40">
             <MapPin size={12} /> Nieuwegein / Utrecht
          </div>
        </div>
      </footer>
    </div>
  );
}
