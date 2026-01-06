import React, { createContext, useState, useContext, useEffect } from 'react';
import { getHistory } from '../services/historyService';
import { useAuth } from './authContext';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [loading_his, setLoading_his] = useState(true);
  const [reports, setReports] = useState([]); 
  const { user, loading_auth } = useAuth();

  const fetchHistory = async () => {
    console.log("🚀 fetchHistory trigger ho gaya!"); //  1
    try {
      setLoading_his(true);
      const res = await getHistory();
      
      console.log("✅ API Raw Response:", res); // 2


      const finalData = res?.data || res;
      setReports(finalData);

    } catch (error) {
      console.error("❌ Context API Error:", error);
      setReports([]); 
    } finally {
      setLoading_his(false);
    }
  };

  useEffect(() => {
   

    if (!loading_auth && user) {
      fetchHistory();
    } else {
      console.log("⏳ Wait kar raha hoon: Auth load ho rahi hai ya user login nahi hai.");
    }
  }, [user, loading_auth ]);

  return (
    <HistoryContext.Provider value={{ reports, loading_his, fetchHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};