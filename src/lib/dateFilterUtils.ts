export type DatePreset = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom' | '';

/**
 * Returns a standardized local date string 'YYYY-MM-DD' for a given Date object.
 * Safe for IST since it uses local getters.
 */
export const toLocalDateString = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get standardized date preset ranges (From/To).
 * 'week' refers to Monday to Sunday of the current week.
 * 'month' refers to 1st to last day of current month.
 * 'year' refers to Jan 1st to Dec 31st.
 */
export const getDatePresetRange = (preset: DatePreset): { dateFrom: string; dateTo: string } => {
  const today = new Date();
  const todayStr = toLocalDateString(today);
  
  if (preset === 'today') {
    return { dateFrom: todayStr, dateTo: todayStr };
  }
  
  if (preset === 'week') {
    // Current day of week (0: Sun, 1: Mon, ..., 6: Sat)
    const currentDay = today.getDay();
    // Calculate Monday
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay; 
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    
    // Calculate Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return { 
      dateFrom: toLocalDateString(monday), 
      dateTo: toLocalDateString(sunday) 
    };
  }
  
  if (preset === 'month') {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 0th day of next month is last day of current month
    
    return { 
      dateFrom: toLocalDateString(firstDay), 
      dateTo: toLocalDateString(lastDay) 
    };
  }
  
  if (preset === 'year') {
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    
    return { 
      dateFrom: toLocalDateString(firstDay), 
      dateTo: toLocalDateString(lastDay) 
    };
  }
  
  return { dateFrom: '', dateTo: '' };
};
