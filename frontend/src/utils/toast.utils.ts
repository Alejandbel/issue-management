import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export function handleAxiosErrorMessageToast(error: AxiosError): null {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const errorMessage = error?.response?.data?.message;

  if (errorMessage) {
    toast.error(errorMessage);
  }

  return null;
}
