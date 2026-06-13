import register from "./register.js";
import signIn from "./sign-in.js";
import signOut from "./sign-out.js";

const authController = {
  register: register,
  signIn: signIn,
  signOut: signOut,
};

export default authController;
