<template>
  <div id="IsThisMobile">
    <p>
      We will identify if it's a mobile by parsing the user agent string defined as a standards in HTTP <a href="https://datatracker.ietf.org/doc/html/rfc7231#section-5.5.3">here</a> in RFC7231.
    </p>
    <div v-if="userToken !== null"><p><b>This is your firebase token:</b> <i>{{JSON.stringify(userToken)}}</i></p></div>
    <p><b>User Agent string:</b> <i>{{userAgent}}</i></p>
    <p>Browser metadata: 
      <ul>
        <li>vendor: {{vendor}}</li>
        <div v-if="uaParsed !== null">
          <li>Browser: {{uaParsed.getBrowser()}}</li>
          <li>Device: {{uaParsed.getDevice()}}</li>
          <li>Engine: {{uaParsed.getEngine()}}</li>
          <li>OS: {{uaParsed.getOS()}}</li>
          <li>CPU: {{uaParsed.getCPU()}}</li>
        </div>
      </ul>
    </p>
    <div v-if="!isMobile">Running on a desktop</div>
    <div v-else>
      <p>Running on a mobile device with data:
        <ul>
          <li>DeviceInfo: {{deviceInfo}}</li>
          <li>BatteryInfo: {{batteryInfo}}</li>
        </ul>
      </p>
    </div>
  </div>
</template>

<script>
import UAParser from 'ua-parser-js';
import { Device } from '@capacitor/device';
import { getAnalytics, logEvent } from "firebase/analytics";

import database from "../database";
import firebaseAuth from "../firebaseAuth";

/**
 * This app provides information of the browser's host.
 */
export default {
  name: "IsThisMobile",
  data() {
    return {
      userAgent: "",
      vendor: "",
      uaParsed: null,
      deviceInfo: "",
      batteryInfo: "",
      userToken: null,
      isMobile: false,
    };
  },
  
  mounted() {
    if (this.userToken === null) {
      firebaseAuth.signInWithGoogle().then((result) => {
        console.log(`Result with Signin: ${result}`);
        firebaseAuth.getCurrentUser().then(user => {
          console.log(`User loaded: ${user}`);
          this.userToken = user;
          this.saveData();
        });
      });
    }

    this.loadBrowserHostData();
  },

  methods: {

    /**
     * Loads all data with the browser and it's host.
     * @see https://www.npmjs.com/package/ua-parser-js
     */
    loadBrowserHostData() {
      // 1. Simplest way to ID a mobile device.
      // window.innerWidth < 600;
      // 2. The more sophisticated way is through the user agent (UA) string
      // This string is in the form: User-Agent = product *( RWS ( product / comment ) )
      // 3. https://www.npmjs.com/package/ua-parser-js will structure this info.
      // 4. Be forward-compatible, userAgentData is preferred over the UA string.
      if (navigator?.userAgentData) {
        this.userAgent = JSON.stringify(navigator.userAgentData);
        this.vendor = navigator.userAgentData.brands[0];
        this.isMobile = navigator.userAgentData.mobile;
      }
      else {
        this.userAgent = navigator?.userAgent ?? "NA";
        this.vendor = navigator?.vendor ?? "NA";
        if (this.userAgent) {
          this.uaParsed = new UAParser(navigator.userAgent);
          // { model: '', type: '', vendor: '' }
          let device = this.uaParsed?.getDevice();
          // possible devices: console, mobile, tablet, smarttv, wearable, embedded
          this.isMobile = device != null ? (device?.type === "mobile") : (window.innerWidth < 600);
          
        }
      }
      if (this.isMobile) {
        this.loadDeviceData()
      }
      // const analytics = getAnalytics();
      // logEvent(analytics, 'initial_load', this.userAgent);
    },

    saveData() {
      // safe to Db.
      if (this.userAgent){
        database.saveBrowser(this.userToken.uid, this.userAgent);
      }
      if (this.deviceInfo){
      database.saveMobile(this.userToken.uid, this.deviceInfo);}
    },

    /**
     * If this is a mobile, access device info.
     * @see https://capacitorjs.com/docs/apis/device#deviceinfo
     * 
     */
    loadDeviceData() {
      console.log("loadDeviceData")
      const analytics = getAnalytics();

      const getInfo = async () => {
        const info = await Device.getInfo();
        this.deviceInfo = info;
      
        logEvent(analytics, 'device_load', this.deviceInfo);

        
      };

      const getBatteryInfo = async () => {
        const info = await Device.getBatteryInfo();
        this.batteryInfo = info;

        logEvent(analytics, 'devicebattery_load',this.batteryInfo);
      };
      getInfo();
      getBatteryInfo();
    }
  },
};

</script>

<style>
#IsThisMobile {
  text-align: left;
  color: #14181c;
  margin: 15px;
}
</style>