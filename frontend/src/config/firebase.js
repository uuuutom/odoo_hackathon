import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "odoo-hakathon.firebaseapp.com",
  projectId: "odoo-hakathon",
  storageBucket: "odoo-hakathon.firebasestorage.app",
  messagingSenderId: "1000120027029",
  appId: "1:1000120027029:web:fbeafaa78e604cfeb3d89c",
  measurementId: "G-7XFV2FR0DF",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope("email");
provider.addScope("profile");
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("user:email");

export { auth, provider };
