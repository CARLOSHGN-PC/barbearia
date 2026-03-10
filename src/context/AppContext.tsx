import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment, Barber, Service, Settings, SiteContent } from '../types';
import { initialBarbers, initialServices, initialSettings, initialSiteContent } from '../data/initialData';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface AppContextType {
  appointments: Appointment[];
  services: Service[];
  barbers: Barber[];
  settings: Settings;
  siteContent: SiteContent;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status'], feeApplied?: boolean) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  updateSiteContent: (content: SiteContent) => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addBarber: (barber: Barber) => Promise<void>;
  updateBarber: (id: string, barber: Partial<Barber>) => Promise<void>;
  deleteBarber: (id: string) => Promise<void>;
  resetData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let appsLoaded = false;
    let servicesLoaded = false;
    let barbersLoaded = false;
    let settingsLoaded = false;
    let contentLoaded = false;

    const checkInit = () => {
      if (appsLoaded && servicesLoaded && barbersLoaded && settingsLoaded && contentLoaded) {
        setInitialized(true);
      }
    };

    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(data);
      appsLoaded = true; checkInit();
    });

    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        setServices(data);
      } else {
        // Initialize if empty
        initialServices.forEach(async (service) => {
          await setDoc(doc(db, 'services', service.id), service);
        });
      }
      servicesLoaded = true; checkInit();
    });

    const unsubBarbers = onSnapshot(collection(db, 'barbers'), (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barber));
        setBarbers(data);
      } else {
        // Initialize if empty
        initialBarbers.forEach(async (barber) => {
          await setDoc(doc(db, 'barbers', barber.id), barber);
        });
      }
      barbersLoaded = true; checkInit();
    });

    const unsubSettings = onSnapshot(doc(db, 'config', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as Settings);
      } else {
        setDoc(doc(db, 'config', 'settings'), initialSettings);
      }
      settingsLoaded = true; checkInit();
    });

    const unsubSiteContent = onSnapshot(doc(db, 'config', 'siteContent'), (snapshot) => {
      if (snapshot.exists()) {
        setSiteContent(snapshot.data() as SiteContent);
      } else {
        setDoc(doc(db, 'config', 'siteContent'), initialSiteContent);
      }
      contentLoaded = true; checkInit();
    });

    return () => {
      unsubAppointments();
      unsubServices();
      unsubBarbers();
      unsubSettings();
      unsubSiteContent();
    };
  }, []);

  const addAppointment = async (appointment: Appointment) => {
    await setDoc(doc(db, 'appointments', appointment.id), appointment);
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status'], feeApplied?: boolean) => {
    const updateData: any = { status };
    if (feeApplied !== undefined) {
      updateData.cancellationFeeApplied = feeApplied;
    }
    await updateDoc(doc(db, 'appointments', id), updateData);
  };

  const updateAppointment = async (id: string, appointment: Partial<Appointment>) => {
    await updateDoc(doc(db, 'appointments', id), appointment);
  };

  const deleteAppointment = async (id: string) => {
    await deleteDoc(doc(db, 'appointments', id));
  };

  const updateSettings = async (newSettings: Settings) => {
    await setDoc(doc(db, 'config', 'settings'), newSettings);
  };

  const updateSiteContent = async (newContent: SiteContent) => {
    await setDoc(doc(db, 'config', 'siteContent'), newContent);
  };

  const addService = async (service: Service) => {
    await setDoc(doc(db, 'services', service.id), service);
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    await updateDoc(doc(db, 'services', id), service);
  };

  const deleteService = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
  };

  const addBarber = async (barber: Barber) => {
    await setDoc(doc(db, 'barbers', barber.id), barber);
  };

  const updateBarber = async (id: string, barber: Partial<Barber>) => {
    await updateDoc(doc(db, 'barbers', id), barber);
  };

  const deleteBarber = async (id: string) => {
    await deleteDoc(doc(db, 'barbers', id));
  };

  const resetData = async () => {
    // Note: Resetting all data in Firestore requires a bit more logic,
    // usually handled via admin SDK or deleting and recreating collections.
    // For this context, we'll recreate the defaults. Note that this doesn't
    // delete appointments for safety unless specifically coded.

    for (const service of initialServices) {
      await setDoc(doc(db, 'services', service.id), service);
    }
    for (const barber of initialBarbers) {
      await setDoc(doc(db, 'barbers', barber.id), barber);
    }
    await setDoc(doc(db, 'config', 'settings'), initialSettings);
    await setDoc(doc(db, 'config', 'siteContent'), initialSiteContent);
  };

  if (!initialized) {
    return null; // Or a loading spinner
  }

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
