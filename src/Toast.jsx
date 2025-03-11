import { Toaster, toast } from "react-hot-toast";

const ToastNotification = () => {
  return <Toaster position="top-right" reverseOrder={false} />;
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    style: { background: "white", color: "black" },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 3000,
    style: { background: "#D32F2F", color: "#fff" },
  });
};

export const showCustomMessage = (message) => {
  toast.error(message, {
    duration: 3000,
    style: { background: "#D32F2F", color: "#fff" },
  });
};

export default ToastNotification;
