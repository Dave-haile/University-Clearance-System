export const generateAvatar = (name: string): string => {
  const formattedName = encodeURIComponent(name);
  return `https://api.dicebear.com/6.x/initials/svg?seed=${formattedName}`;
};
