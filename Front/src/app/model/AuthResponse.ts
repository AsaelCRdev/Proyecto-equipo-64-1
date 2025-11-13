import { Buyer } from './Buyer';
export interface AuthResponse {
  isAdmin: Boolean;
  isUser: Boolean;
  buyer: Buyer;
}
