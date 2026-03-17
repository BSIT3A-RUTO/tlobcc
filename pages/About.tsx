import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Music } from 'lucide-react';
import GradientText from '../components/GlitchText';
import { getPastors, PastorRecord } from '../services/contentService';
import { useState, useEffect } from 'react';

const About: React.FC = () => {
  const [pastors, setPastors] = useState<PastorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPastors();
        if (data.length > 0) {
          setPastors(data);
        }
      } catch {
        // fallback empty
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="pt-32 pb-20">
      {/* EXPERIENCE SECTION */}
      <section className="relative z-10 py-10 md:py-20 bg-black/20 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] bg-[#4fb7b3]/20 rounded-full blur-[40px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                Our <br/> <GradientText text="MISSION" className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-12 font-light leading-relaxed drop-shadow-md">
                We are a community of believers dedicated to loving God, reaching people with the gospel, and making disciples who make disciples.
              </p>
              
              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: Globe, title: 'Loving God', desc: 'Through passionate worship and devotion to His Word.' },
                  { icon: Zap, title: 'Reaching People', desc: 'Sharing the hope of Christ with our community and the world.' },
                  { icon: Music, title: 'Making Disciples', desc: 'Growing together in faith and equipping believers for ministry.' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading">{feature.title}</h4>
                      <p className="text-sm text-gray-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[400px] md:h-[700px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] rounded-3xl rotate-3 opacity-30 blur-xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop" 
                  alt="Worship" 
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <div className="text-5xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-50">
                    01
                  </div>
                  <div className="text-lg md:text-xl font-bold tracking-widest uppercase mt-2 text-white">
                    Join Our Family
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PASTORAL TEAM */}
          <div className="mt-32 border-t border-white/10 pt-20">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-6xl font-heading font-bold uppercase mb-4">
                Meet Our <span className="text-[#4fb7b3]">Team</span>
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">Dedicated leaders serving our church family and community.</p>
            </div>
            
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading team...</div>
            ) : pastors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No team members yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pastors.map((pastor, i) => (
                  <div key={pastor.id} className="group relative overflow-hidden bg-white/5 border border-white/10">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img src={pastor.image} alt={pastor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform">
                      <h4 className="text-xl font-bold font-heading text-white">{pastor.name}</h4>
                      <p className="text-[#a8fbd3] text-sm font-mono uppercase tracking-widest mt-1">{pastor.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
