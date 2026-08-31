// Date and Time Formatter ensuring Korean Standard Time (KST, UTC+9) & high-precision formatting
export const formatPostDateTime = (isoDateString: string, _slug?: string): string => {
  if (!isoDateString) return '';
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return isoDateString;

    // Use Intl.DateTimeFormat with Asia/Seoul timezone for consistent representation
    const parts = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(d);

    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour').padStart(2, '0');
    const minute = getPart('minute').padStart(2, '0');
    const second = getPart('second').padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${hour}:${minute}:${second}`;
  } catch {
    return isoDateString;
  }
};

export const formatShortDate = (isoDateString: string): string => {
  if (!isoDateString) return '';
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return isoDateString;

    const parts = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(d);

    const year = parts.find(p => p.type === 'year')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';

    return `${year}.${month}.${day}`;
  } catch {
    return isoDateString;
  }
};
