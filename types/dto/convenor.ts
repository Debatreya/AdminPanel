//  Active Convenor (authority user)

export interface ConvenorDTO {
  id: string;        // User._id
  name: string;
  imgurl: string;
  tech: number;
}


//   Active Co-Convenor (subdocument)
 
export interface CoConvenorDTO {
  id: string;        // Subdocument _id
  name: string;
  imgurl: string;
  tech: number;
}

// Immutable Convenor History Entry

export interface ConvenorHistoryDTO {
  name: string;
  imgurl: string;
  tech: number;
}

//  Immutable Co-Convenor History Entry
export interface CoConvenorHistoryDTO {
  name: string;
  imgurl: string;
  tech: number;
}

//    Response DTOs
//  Society + Convenor Data (used in GET routes)
export interface SocietyConvenorsResponse {
  id: string;
  name: string;
  logo: string;

  currentConvenor: ConvenorDTO;
  currentCoConvenors: CoConvenorDTO[];

  convenorHistory?: Record<number, ConvenorHistoryDTO[]>;
  coConvenorHistory?: Record<number, CoConvenorHistoryDTO[]>;
}

// Get all societies convenors
export interface GetAllConvenorsResponse {
  success: true;
  data: SocietyConvenorsResponse[];
}

//  Get single society convenors

export interface GetSingleConvenorResponse {
  success: true;
  data: SocietyConvenorsResponse;
}

// Generic success response (POST / PATCH)

export interface ConvenorActionResponse {
  success: true;
  message: string;
}

// Error response
export interface ConvenorErrorResponse {
  success?: false;
  message: string;
}
