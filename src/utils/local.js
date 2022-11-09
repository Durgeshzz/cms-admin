
   export const setUserDetails = (userId) => {
    localStorage.setItem('userId', userId);
  }
  export const removeUserDetails=()=>
  {
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
  }
  export const getUserDetails = () =>{
    return localStorage.getItem('userId')
  }

  export const setName = (name) =>{
    localStorage.setItem('userName',name)
  }
  export const getName = () =>{
    return localStorage.getItem('userName')
  }

   export const setAuthToken= (token) => {
    localStorage.setItem('token', token);
  }
  export const getAuthToken = () => {
    return localStorage.getItem('token') || null;
  }
  export const removeAuthToken = () => {
    return localStorage.removeItem('token') 
  }

