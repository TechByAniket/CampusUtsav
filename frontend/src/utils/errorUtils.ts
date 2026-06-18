/**
 * Standard utility to transform Axios/Network errors into human-readable 
 * strings that include the official backend response payload.
 */
export const handleServiceError = (error: any, context: string): string => {
  const backendMessage = error.response?.data?.message || error.response?.data || error.message;
  const formattedError = `${context}: ${backendMessage}`;
  
  console.error(`[API ERROR] ${formattedError}`, error);
  return formattedError;
};
