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

  useEffect(() => {
    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(data);
    }, (error) => {
      console.error("Firestore error (appointments):", error);
    });

    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        setServices(data);
      } else {
        // Apenas use local em vez de sobrescrever o banco de dados prematuramente
        setServices(initialServices);
      }
    }, (error) => {
      console.error("Firestore error (services):", error);
      setServices(initialServices);
    });

    const unsubBarbers = onSnapshot(collection(db, 'barbers'), (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barber));
        setBarbers(data);
      } else {
        setBarbers(initialBarbers);
      }
    }, (error) => {
      console.error("Firestore error (barbers):", error);
      setBarbers(initialBarbers);
    });

    const unsubSettings = onSnapshot(doc(db, 'config', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as Settings);
      } else {
        setSettings(initialSettings);
      }
    }, (error) => {
      console.error("Firestore error (settings):", error);
      setSettings(initialSettings);
    });

    const unsubSiteContent = onSnapshot(doc(db, 'config', 'siteContent'), (snapshot) => {
      if (snapshot.exists()) {
        setSiteContent(snapshot.data() as SiteContent);
      } else {
        setSiteContent(initialSiteContent);
      }
    }, (error) => {
      console.error("Firestore error (siteContent):", error);
      setSiteContent(initialSiteContent);
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
    try {
      await setDoc(doc(db, 'config', 'siteContent'), newContent);
    } catch (error) {
      console.error("Erro ao atualizar siteContent no Firestore:", error);
      throw error;
    }
  };

  const addService = async (service: Service) => {
    try {
      await setDoc(doc(db, 'services', service.id), service);
    } catch (e) {
      console.error("Firestore error (addService):", e);
      throw e;
    }
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    try {
      await updateDoc(doc(db, 'services', id), service);
    } catch (e) {
      console.error("Firestore error (updateService):", e);
      throw e;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.error("Firestore error (deleteService):", e);
      throw e;
    }
  };

  const addBarber = async (barber: Barber) => {
    try {
      await setDoc(doc(db, 'barbers', barber.id), barber);
    } catch (e) {
      console.error("Firestore error (addBarber):", e);
      throw e;
    }
  };

  const updateBarber = async (id: string, barber: Partial<Barber>) => {
    try {
      await updateDoc(doc(db, 'barbers', id), barber);
    } catch (e) {
      console.error("Firestore error (updateBarber):", e);
      throw e;
    }
  };

  const deleteBarber = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'barbers', id));
    } catch (e) {
      console.error("Firestore error (deleteBarber):", e);
      throw e;
    }
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
