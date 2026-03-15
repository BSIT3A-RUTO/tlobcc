import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';

const MapSection: React.FC = () => {
  return (
    <section id="location" className="py-24 px-6 md:px-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Visit Us</h2>
              <p className="text-lg text-slate-600">We'd love to welcome you to our church family. Join us this Sunday.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">Location</h4>
                  <p className="text-slate-600">Navotas City, Metro Manila<br/>Philippines</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">Service Times</h4>
                  <p className="text-slate-600">Sunday Worship: 9:00 AM<br/>Kids Church: 9:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">Contact</h4>
                  <p className="text-slate-600">+63 912 345 6789<br/>info@tlobcc.org</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full h-[500px] rounded-3xl overflow-hidden shadow-md border border-slate-200"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3860.283151813473!2d120.9452!3d14.6403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b5a8b7e0e7a5%3A0x6b8c8d2a1b0b0b0b!2sNavotas%20City!5e0!3m2!1sen!2sph!4v1620000000000!5m2!1sen!2sph" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MapSection;
