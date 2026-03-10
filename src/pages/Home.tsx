import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Scissors, ShieldAlert, Star, User, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export const Home = () => {
  const { services, barbers, settings, siteContent } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-zinc-950 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteContent.heroImage} 
            alt="Barbearia" 
            className="w-full h-full object-cover opacity-30 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-amber-500 font-serif italic tracking-widest uppercase text-sm md:text-base mb-6 block">{siteContent.slogan}</span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 uppercase tracking-tighter leading-none" dangerouslySetInnerHTML={{ __html: siteContent.heroTitle }}>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              {siteContent.heroSubtitle}
            </p>
            <Link 
              to="/agendar" 
              className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-zinc-950 px-10 py-5 rounded-sm font-bold text-lg uppercase tracking-widest transition-all transform hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.5)]"
            >
              <Calendar className="w-5 h-5 mr-3" />
              Agendar Agora
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-32 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 bg-amber-500/20 transform translate-x-4 translate-y-4 rounded-sm"></div>
              <img 
                src="https://picsum.photos/seed/barbershop-interior/800/1000" 
                alt="Interior da Barbearia" 
                className="relative z-10 w-full h-auto object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6">Nossa História</h2>
                <div className="w-24 h-1 bg-amber-500"></div>
              </div>
              <div className="text-lg text-zinc-300 font-light leading-relaxed space-y-6 whitespace-pre-line">
                {siteContent.aboutText}
              </div>
              <div className="pt-8">
                <Link 
                  to="/agendar" 
                  className="inline-flex items-center justify-center bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-950 px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-all"
                >
                  Conheça Nossos Serviços
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-32 bg-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6">Nossos Serviços</motion.h2>
            <motion.div variants={itemVariants} className="w-24 h-1 bg-amber-500 mx-auto"></motion.div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {services.map(service => (
              <motion.div 
                key={service.id} 
                variants={itemVariants}
                className="bg-zinc-950 p-8 rounded-sm border border-zinc-800/50 hover:border-amber-500/30 transition-all duration-300 group flex justify-between items-center hover:bg-zinc-900"
              >
                <div>
                  <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-amber-500 transition-colors uppercase tracking-wide">{service.name}</h3>
                  <p className="text-zinc-500 flex items-center gap-2 mt-3 text-sm font-mono uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-zinc-600" /> {service.durationMinutes} min
                  </p>
                </div>
                <div className="text-3xl font-serif font-bold text-white group-hover:scale-110 transition-transform origin-right">
                  <span className="text-amber-500 text-lg mr-1">R$</span>
                  {service.price.toFixed(2).replace('.', ',')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Barbers Section */}
      <section id="barbeiros" className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6">Nossos Profissionais</motion.h2>
            <motion.div variants={itemVariants} className="w-24 h-1 bg-amber-500 mx-auto"></motion.div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-center max-w-6xl mx-auto"
          >
            {barbers.map(barber => (
              <motion.div 
                key={barber.id} 
                variants={itemVariants}
                className="bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800 text-center group"
              >
                <div className="h-80 overflow-hidden relative">
                  <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={barber.imageUrl} 
                    alt={barber.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 relative bg-zinc-900 z-20">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-widest">{barber.name}</h3>
                  <p className="text-amber-500 text-sm font-serif italic mt-2">Master Barber</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info & Policy Section */}
      <section className="py-32 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            
            {/* Hours */}
            <motion.div variants={itemVariants} className="bg-zinc-950 p-10 md:p-12 rounded-sm border border-zinc-800">
              <div className="flex items-center gap-4 mb-8">
                <Clock className="w-10 h-10 text-amber-500" />
                <h3 className="text-3xl font-bold text-white uppercase tracking-tight">Horários</h3>
              </div>
              <ul className="space-y-6">
                {['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'].map((day, index) => {
                  const hours = settings.businessHours[index];
                  return (
                    <li key={day} className="flex justify-between items-center text-zinc-300 border-b border-zinc-800/50 pb-4 last:border-0 last:pb-0">
                      <span className="text-lg uppercase tracking-wide">{day}</span>
                      {hours.isClosed ? (
                        <span className="font-mono uppercase text-sm tracking-widest bg-zinc-900 px-3 py-1 rounded-sm text-zinc-500">Fechado</span>
                      ) : (
                        <span className="font-mono text-xl text-white">{hours.open} - {hours.close}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Policy */}
            <motion.div variants={itemVariants} className="bg-zinc-950 p-10 md:p-12 rounded-sm border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <ShieldAlert className="w-10 h-10 text-amber-500" />
                  <h3 className="text-3xl font-bold text-white uppercase tracking-tight">Política de Cancelamento</h3>
                </div>
                <p className="text-zinc-300 mb-8 leading-relaxed text-lg font-light">
                  {siteContent.cancellationPolicyText
                    .replace('{hours}', settings.cancellationFeeHoursLimit.toString())
                    .replace('{fee}', `R$ ${settings.cancellationFee.toFixed(2).replace('.', ',')}`)}
                </p>
                <div className="bg-zinc-900 p-6 rounded-sm border border-zinc-800">
                  <ul className="space-y-5 text-base text-zinc-400">
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                      <span className="leading-relaxed">Cancelamentos com <strong>mais de {settings.cancellationFeeHoursLimit} horas</strong> de antecedência são <strong className="text-green-400">gratuitos</strong>.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                      <span className="leading-relaxed">Cancelamentos com <strong>menos de {settings.cancellationFeeHoursLimit} horas</strong> ou não comparecimento estão sujeitos a uma taxa de <strong className="text-red-400">R$ {settings.cancellationFee.toFixed(2).replace('.', ',')}</strong>.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

