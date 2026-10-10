export const getErrorMessage = (error, fallback = "Something went wrong") => {

  if (error?.response?.data?.message) return error.response.data.message;

  if (error?.isAxiosError && !error.response) return "Cannot reach the server. Try again.";

  if (!error?.isAxiosError && error?.message) return error.message;
  return fallback;
};