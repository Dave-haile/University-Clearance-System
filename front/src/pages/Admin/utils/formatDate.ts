import { format } from "date-fns";

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatMemberSinceDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format as "Month Day" (e.g., "May 22")
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });
};

export const getFullMemberSinceDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format as "Month Day, Year" (e.g., "May 22, 2025")
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// For editing/updating the date if needed
export const editMemberSinceDate = (dateString: string, newDate: Date): string => {
  const isoString = newDate.toISOString();
  return isoString.replace('T', ' ').split('.')[0] + '.000000Z';
};