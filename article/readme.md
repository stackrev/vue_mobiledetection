# Vue and Capacitor - Porting to Mobile Apps made Easy.
 <!-- title: Vue and Capacitor - Porting to Mobile Apps made Easy. -->
![Image: Capacitors](capcitors.PNG "Capacitors")

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Vue and Capacitor - Porting to Mobile Apps made Easy.](#vue-and-capacitor---porting-to-mobile-apps-made-easy)
  - [Build your Web App](#build-your-web-app)
- [Add some Capacitors](#add-some-capacitors)
  - [Device Specifics](#device-specifics)
    - [SDKs and Licences](#sdks-and-licences)
    - [Device Developer Mode](#device-developer-mode)
- [Run your App](#run-your-app)
  - [Leverage Capacitor APIs](#leverage-capacitor-apis)
- [Firebase for More Power](#firebase-for-more-power)
  - [Authenticate with Google](#authenticate-with-google)
  - [Add the Firebase SDK](#add-the-firebase-sdk)
  - [Fun with databases](#fun-with-databases)
- [Conclusion](#conclusion)
  - [References](#references)
  - [Github](#github)

<!-- /code_chunk_output -->
- [Vue and Capacitor - Porting to Mobile Apps made Easy.](#vue-and-capacitor---porting-to-mobile-apps-made-easy)
  - [Build your Web App](#build-your-web-app)
- [Add some Capacitors](#add-some-capacitors)
  - [Device Specifics](#device-specifics)
    - [SDKs and Licences](#sdks-and-licences)
    - [Device Developer Mode](#device-developer-mode)
- [Run your App](#run-your-app)
  - [Leverage Capacitor APIs](#leverage-capacitor-apis)
- [Firebase for More Power](#firebase-for-more-power)
  - [Authenticate with Google](#authenticate-with-google)
  - [Add the Firebase SDK](#add-the-firebase-sdk)
  - [Fun with databases](#fun-with-databases)
- [Conclusion](#conclusion)
  - [References](#references)
  - [Github](#github)


Capacitor - a cross-platform that operates on native runtime to build apps that can run natively on iOS and Android, AKA Web Native apps.

Why use this modern native container approach? It's for you, who want to build web-first without sacrificing access to native device SDKs.

## Build your Web App

We start by spinning a simple Vue application using vue cli, and choose the default preset (babel + eslint):

`vue create app`

In the components folder, we add a new component that will detect if we are running in a mobile device or not:

```javascript
export default {
  name: "IsThisMobile",
  data() {
    return {
      userAgent: "",
      vendor: "",
      opera: "",
      uaParsed: null,
    };
  },

  computed: {
    isMobile(){
      let device = this.uaParsed?.getDevice();
      return device !== null ? (device?.model === "mobile") : (window.innerWidth < 600);
    }
  },
  
  mounted() {
    this.loadBrowserHostData();
  },

  methods: {
    /**
     * Loads all data with the browser and it's host.
     */
    loadBrowserHostData() {
      this.userAgent= navigator?.userAgent || "NA";
      this.vendor= navigator?.vendor || "NA";
      this.opera = navigator?.opera || "NA";
      if (navigator?.userAgent != null) {
        this.uaParsed = new UAParser(navigator.userAgent);
      }
    },
  },
};
```

Making use of a the User Agent (UA), available [here](https://www.npmjs.com/package/ua-parser-js), we can easily parse the UA string and get relevant information.
The UA string is a defined HTTP standard in [RFC7231](https://datatracker.ietf.org/doc/html/rfc7231#section-5.5.3). In general it comes with this format:

`User-Agent = product *( RWS ( product / comment ) )`

Start the server with **yarn serve**, and you should information about your host:

```bash
User Agent string: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36

Browser metadata:
vendor: Google Inc.
opera: NA
Browser: { "name": "Chrome", "version": "104.0.0.0", "major": "104" }
Device: {}
Engine: { "name": "Blink", "version": "104.0.0.0" }
OS: { "name": "Windows", "version": "10" }
CPU: { "architecture": "amd64" }
```

# Add some Capacitors

Now the fun part. Adding [capacitor](https://capacitorjs.com/) to the mix will allow our simple web app to be deployed on mobiles.

`vue add capacitor`

You'll be asked what is this for either *IOS* or *Android*, choose whichever you target device is.

Or use the more modern Capacitor CLI (you need to choose between IOS and Android):

```bash
npm init @capacitor/app
yarn add @capacitor/core
yarn add @capacitor/cli
npx cap init

npx cap add android | ios
```

Build your webapp and then sync it to capacitor:

`yarn capacitor:build --android|ios` 

Or using the capacitor cli:

```bash
yarn build
npx cap sync
```

Note that both these commands also do a `npx cap sync`, which syncs the web code and plugins with the native project.

## Device Specifics

Depending on what flavor of device you are running, you might run into these additional configurations:

### SDKs and Licences

 You would need to accept and download specific tools, SDKs and licences for both Xcode or Android Studio. Follow the relevant instructions.

For android, we opened our Android studio and went to tools->SDK Manager. From there we installed the APIs required and the android SDK we will build against:

![Image: Android Studio SDK](androidStudioSDK.PNG "Android Studio SDK")

### Device Developer Mode

To run on your device, you will need to enable developer options and USB wire debugging. 

This is different for everymodel, the model used here - a galaxy 10 - required we tap 7 times on its build number before developer options was available.

![Image: Samsung Developer Options](devOptionsSamsung.jpg "Samsung Developer Options")

# Run your App

Once you resolve any needs required by your device, build your device bundles (e.g. APK for Android) and run the app from your device IDE (Xcode or Android studio) while wired to your mobile:

![Image: Samsung App](appFromSamsung.jpg "Samsung App")

If the at any point the installation fails, you need to uninstall the previous app from your device.

## Leverage Capacitor APIs

Having metadata on the host's browser is good, but we want to truly feel like we are using the device. 
Let's use the APIs exposed by capacitor to know about the hardware hosting the browser.

First we install the capacitor device library and sync with the device bundle we created.

```bash
yarn add @capacitor/device
npx cap sync
```

If at any time you get errors building or running your app, check the versions installed by capacitor. 
All major versions should be the same (Vue cli could have installed older versions). At the time of writing, these versions are:

```json
"@capacitor/android": "^4.1.0",
"@capacitor/cli": "^4.1.0",
"@capacitor/core": "^4.1.0",
"@capacitor/device": "^4.0.1",
```

You will see information about your hardware, in this case this is what samsung shows:

![Image: Samsung App with Device API](appFromSamsungWithAPI.jpg "Samsung App with Device API")

# Firebase for More Power

Firebase is Google's app development framework, and provides services for when you release your apps to the world. These services include serverless functions, noSQL databases, hosting, analytics and other goodies that you would use to connect your users.

For our simple mobile detector app, we will use their noSQL database to save state and leverage analytics to help us understand who uses this app. 

## Authenticate with Google

Rule of thumb, authenticate all who will use your cloud services. In this case, using the ready made google authentation flow to identify our users.

Authentication is either native or web, though we have plugins to bridge the gap, one is @capacitor-firebase/authentication:

```bash
npm install @capacitor-firebase/authentication
npx cap sync
```

In capacitor.config.json add the plugin config:
```json
"plugins": {
  "FirebaseAuthentication": {
    "skipNativeAuth": false,
    "providers": [ "google.com"]
  }
}
```

The first time the page loads, we will ask the user to login:

```jsx
const signInWithGoogle = async () => {
  const result = await FirebaseAuthentication.signInWithGoogle();
  return result.user;
};


```

## Add the Firebase SDK

Add firebase to our webapp, there is a mobile version of the SDK but we can do with the web version:

`yarn add firebase`

We add the firebase configs generated to a serperate file:

```javascript
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

class Firebase {
  constructor(configOptions) {
    this.configOptions = configOptions || {
      apiKey: "AIzaSyDxc66sS4nLWNQl5i6CZxQtgxAPSEO8KKs",
      authDomain: "mobiledetector-f886a.firebaseapp.com",
      projectId: "mobiledetector-f886a",
      storageBucket: "mobiledetector-f886a.appspot.com",
      messagingSenderId: "1095716578462",
      appId: "1:1095716578462:web:08ffd8e1e345e9c056478f",
      measurementId: "G-GH6Z5G0RGC",
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
    this.analytics = getAnalytics(this.app);
  }
}

const firebase = new Firebase();
export default firebase;
```

and initialize it from our main:

```javascript
import firebase from "./firebase";

firebase.initialize();
```

## Fun with databases

Add the firebase database.

`yarn add firebase/database`

We will access the database witht he following apis"

```javascript
import {
  getDatabase,
  ref,
  child,
  set,
  get,
  push,
  query,
  limitToLast,
  orderByChild,
} from "firebase/database";
import moment from "moment";

class DatabaseService {
  constructor() {
    this.db = null;
  }

  /**
   * Init connection.
   */
  initialize() {
    this.db = getDatabase();
    /*if (location.hostname === 'localhost') {
      this.db.useEmulator('localhost', 9000);
    }*/
    this.dbref = ref(this.db, "mobiles");
  }

  /**
   * Save a new mobile config
   * @param {*} user
   * @returns
   */
  saveMobile(mobile) {
    return new Promise((resolve, reject) => {
      const obj = {};
      obj[mobile.deviceInfo.model] = mobile;
      set(this.dbref, obj)
        .then(() => {
          resolve(obj);
        })
        .catch((error) => {
          reject(null, error);
        });
    });
  }

  /**
   * Reads a mobile config.
   *
   * @param {*} id
   * @returns
   */
  readMobile(mobile) {
    return new Promise((resolve, reject) => {
      get(child(this.dbref, `${mobile.deviceInfo.model}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

const databaseService = new DatabaseService();
export default databaseService;

```

We call *saveMobile* to store the metadata of the device indexed by model.

# Conclusion


## References

- https://www.npmjs.com/package/ua-parser-js
- https://capacitorjs.com/
- https://capacitorjs.com/docs/android/troubleshooting
- https://github.com/capacitor-community/vue-cli-plugin-capacitor


## Github

Article here is also available on [Github](https://github.com/adamd1985/microfrontend-quickstart)

#

<div align="right">Made with :heartpulse: by <b>Adam</b></div>
