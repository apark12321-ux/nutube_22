// Seeded pseudo-random function based on post slug or publishedAt
const getDeterministicTimeForPost = (isoDateString: string, slug: string = '') => {
  const d = new Date(isoDateString);
  
  // If the date string already has a specific non-zero time (not 00:00:00 or default), use it
  const hasSpecificTime = d.getUTCHours() !== 0 || d.getUTCMinutes() !== 0 || d.getUTCSeconds() !== 0;
  
  if (hasSpecificTime) {
    // Generate deterministic Korean local time format
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
  }

  // Generate a deterministic pseudo-random hour/minute/second based on slug/date string
  let hash = 0;
  const seed = `${isoDateString}-${slug}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  
  const absHash = Math.abs(hash);
  // Spread upload hours between 08:00 and 22:59
  const hour = 8 + (absHash % 15);
  const minute = (absHash >> 4) % 60;
  const second = (absHash >> 8) % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = pad(hour);
  const minutes = pad(minute);
  const seconds = pad(second);

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
};

export const formatPostDateTime = (isoString: string, slug?: string): string => {
  if (!isoString) return '';
  return getDeterministicTimeForPost(isoString, slug);
};
