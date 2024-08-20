import { axiosInstance } from "./axios";

interface UploadFileResponse {
  data: {
    url: string;
  }
}

export const uploadFile = (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post('/fileUpload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
