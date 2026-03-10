import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment, Barber, Service, Settings, SiteContent } from '../types';
import { initialBarbers, initialServices, initialSettings, initialSiteContent } from '../data/initialData';

interface AppContextType {
  appointments: Appointment[];
  services: Service[];
  barbers: Barber[];
  settings: Settings;
  siteContent: SiteContent;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status'], feeApplied?: boolean) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  updateSettings: (settings: Settings) => void;
  updateSiteContent: (content: SiteContent) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addBarber: (barber: Barber) => void;
  updateBarber: (id: string, barber: Partial<Barber>) => void;
  deleteBarber: (id: string) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('barbershop_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('barbershop_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [barbers, setBarbers] = useState<Barber[]>(() => {
    const saved = localStorage.getItem('barbershop_barbers');
    return saved ? JSON.parse(saved) : initialBarbers;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('barbershop_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('barbershop_site_content');
    return saved ? JSON.parse(saved) : initialSiteContent;
  });

  useEffect(() => {
    localStorage.setItem('barbershop_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('barbershop_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('barbershop_barbers', JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem('barbershop_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('barbershop_site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status'], feeApplied?: boolean) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status, cancellationFeeApplied: feeApplied ?? app.cancellationFeeApplied } : app
      )
    );
  };

  const updateAppointment = (id: string, appointment: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...appointment } : app))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const updateSiteContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
  };

  const addService = (service: Service) => setServices((prev) => [...prev, service]);
  const updateService = (id: string, service: Partial<Service>) => setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...service } : s)));
  const deleteService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id));

  const addBarber = (barber: Barber) => setBarbers((prev) => [...prev, barber]);
  const updateBarber = (id: string, barber: Partial<Barber>) => setBarbers((prev) => prev.map((b) => (b.id === id ? { ...b, ...barber } : b)));
  const deleteBarber = (id: string) => setBarbers((prev) => prev.filter((b) => b.id !== id));

  const resetData = () => {
    setAppointments([]);
    setServices(initialServices);
    setBarbers(initialBarbers);
    setSettings(initialSettings);
    setSiteContent(initialSiteContent);
  };

  return (
    <AppContext.Provider value={{
      appointments, services, barbers, settings, siteContent,
      addAppointment, updateAppointmentStatus, updateAppointment, deleteAppointment,
      updateSettings, updateSiteContent,
      addService, updateService, deleteService,
      addBarber, updateBarber, deleteBarber,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
