import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

class Firebase {
  constructor(configOptions) {
    this.configOptions = configOptions || {
      apiKey: "AIzaSyBFt8aPFMT3sd2SU0LVobRaua83uUyT1tg",
      authDomain: "mobiledetector-c1e63.firebaseapp.com",
      databaseURL:
        "https://mobiledetector-c1e63-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "mobiledetector-c1e63",
      storageBucket: "mobiledetector-c1e63.appspot.com",
      messagingSenderId: "839635090969",
      appId: "1:839635090969:web:4037a1d239e76f21b7b488",
      measurementId: "G-82EP9CMVFM",
    };
    this.app = null;
    this.analytics = null;
  }

  initialize() {
    if (!getApps || !getApps() || !getApps().length) {
      this.app = initializeApp(this.configOptions);
    } else {
      this.app = getApp();
    }
    // this.analytics = getAnalytics(this.app);
  }
}

const firebase = new Firebase();
export default firebase;
