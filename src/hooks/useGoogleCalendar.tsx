import { useQuery } from "@tanstack/react-query";

export const useGoogleCalendar = () => {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      // This is a placeholder that returns mock data
      return {
        items: []
      };
    },
    enabled: false // Disabled for now since we're using mock data
  });
};