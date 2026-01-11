// ImgBB Types
export interface ImgBBImageData {
  filename: string;
  name: string;
  url: string;
}

export interface ImgBBUploadResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: ImgBBImageData;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export interface ImgBBUploadResult {
  url: string;
  deleteUrl: string;
  imageData: ImgBBImageData;
}
