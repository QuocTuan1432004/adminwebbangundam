
import{API_BASE_URL} from '@hooks/API';

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
}

