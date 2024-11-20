// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';


interface UserToken {
  data: {
    _id: string;
    username: string;
    email: string;
  };
  exp: number;
  iat: number;
}

// create a new class to instantiate for a user
class AuthService {
  // get user data
  // getProfile() {
  //   return jwtDecode(this.getToken() || '');
  // }
  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }
  getProfile(): UserToken|null {
    const token = this.getToken();
    console.log("auth getProfile() -> token : ",token)
    if (token) {
      console.log("auth getProfile() -> token : inside if ",token)
      try {
        console.log("auth getProfile() -> jwtDecode<UserToken>(token) ",jwtDecode<UserToken>(token))
        return jwtDecode<UserToken>(token);
    
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
    return null;
  }
  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } 
      
      return false;
    } catch (err) {
      return false;
    }
  }

 

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
