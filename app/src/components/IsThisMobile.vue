<template>
  <div id="IsThisMobile">
    <p>
      We will identify if it's a mobile by parsing the user agent string defined as a standards in HTTP <a href="https://datatracker.ietf.org/doc/html/rfc7231#section-5.5.3">here</a> in RFC7231.
    </p>
    <p><b>User Agent string:</b> <i>{{userAgent}}</i></p>
    <p>Browser metadata: 
      <ul>
        <li>vendor: {{vendor}}</li>
        <li>opera: {{opera}}</li>
        <div v-if="uaParsed !== null">
          <li>Browser: {{uaParsed.getBrowser()}}</li>
          <li>Device: {{uaParsed.getDevice()}}</li>
          <li>Engine: {{uaParsed.getEngine()}}</li>
          <li>OS: {{uaParsed.getOS()}}</li>
          <li>CPU: {{uaParsed.getCPU()}}</li>
        </div>
      </ul>
    </p>
    <div v-if="!isMobile">desktop</div>
    <div v-else>
      <p>mobile data:
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

/**
 * This app provides information of the browser's host.
 */
export default {
  name: "IsThisMobile",
  data() {
    return {
      userAgent: "",
      vendor: "",
      opera: "",
      uaParsed: null,
      deviceInfo: "",
      batteryInfo: "",
    };
  },

  computed: {
    isMobile(){
      // { model: '', type: '', vendor: '' }
      let device = this.uaParsed?.getDevice();
      // possible devices: console, mobile, tablet, smarttv, wearable, embedded
      return device != null ? (device?.type === "mobile") : (window.innerWidth < 600);
    }
  },
  
  mounted() {
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
      this.userAgent= navigator?.userAgent || "NA";
      this.vendor= navigator?.vendor || "NA";
      this.opera = navigator?.opera || "NA";
      if (navigator?.userAgent != null) {
        this.uaParsed = new UAParser(navigator.userAgent);
        if (this.isMobile) {
          this.loadDeviceData()
        }
      }

      const analytics = getAnalytics();
      logEvent(analytics, 'initial_load', this.userAgent);
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

        // safe to Db.
        database.saveMobile(this.deviceInfo);
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