// 날짜 포맷팅 함수들

export const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    return date.toLocaleDateString('ko-KR', options);
  };
  
  export const formatShortDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('ko-KR', options);
  };
  
  export const formatTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleTimeString('ko-KR', options);
  };
  
  export const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };
  
  export const isThisWeek = (date: Date): boolean => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo && date <= today;
  };
  
  export const isThisMonth = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth()
    );
  };
  
  export const getGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour < 6) return '새벽 일찍 수고하세요! 🌙';
    if (hour < 12) return '좋은 아침이에요! ☀️';
    if (hour < 18) return '좋은 오후에요! ⛅';
    if (hour < 22) return '좋은 저녁이에요! 🌅';
    return '늦은 밤 수고하세요! 🌙';
  };