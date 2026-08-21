"use client";

import { useState, useRef, useEffect } from 'react';
import { auth, db } from '@/lib/firebase'; 
import { collection, query, orderBy, onSnapshot, writeBatch, doc, limit, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'stats' | 'success';
  date: string;
  read: boolean;
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Identificar o usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setNotifications([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Escutar notificações no Firebase em tempo real
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, `users/${userId}/notifications`),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifsData: Notification[] = [];
      
      snapshot.forEach((document) => {
        const data = document.data();
        
        let dateStr = 'Recente';
        if (data.createdAt?.toDate) {
           const dateObj = data.createdAt.toDate();
           dateStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }

        notifsData.push({
          id: document.id,
          title: data.title || '',
          message: data.message || '',
          type: data.type || 'system',
          date: data.date || dateStr,
          read: data.read || false,
        });
      });
      
      setNotifications(notifsData);
    });

    return () => unsubscribe();
  }, [userId]);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // 3. Marcar como lida
  const markAllAsRead = async () => {
    if (!userId) return;
    
    const unreadNotifs = notifications.filter(n => !n.read);
    if (unreadNotifs.length === 0) return;

    try {
      const batch = writeBatch(db);
      unreadNotifs.forEach((notif) => {
        const notifRef = doc(db, `users/${userId}/notifications`, notif.id);
        batch.update(notifRef, { read: true });
      });
      await batch.commit();
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  // 4. Apagar a notificação individual
  const deleteNotification = async (notifId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, `users/${userId}/notifications`, notifId));
    } catch (error) {
      console.error("Erro ao apagar notificação:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'stats': return '📊';
      case 'success': return '🔥';
      case 'system': return '🚀';
      case 'warning': return '⚠️';
      default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Botão do Sino */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-zinc-900"></span>
          </span>
        )}
      </button>

      {/* Dropdown de Notificações Limpo */}
      {isOpen && (
        <div className="absolute right-0 top-10 mt-3 w-80 sm:w-96 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
            <h3 className="text-sm font-bold text-white">Notificações</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-87.5 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm">
                Nenhuma notificação por enquanto.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors flex gap-3 ${!notif.read ? 'bg-blue-900/10' : ''}`}
                >
                  <div className="text-xl shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm font-semibold ${!notif.read ? 'text-white' : 'text-zinc-300'}`}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                          {notif.date}
                        </span>
                        {/* Botão X para apagar */}
                        <button 
                          onClick={() => deleteNotification(notif.id)}
                          className="text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Apagar notificação"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}