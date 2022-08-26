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
    <div v-else>mobile</div>
  </div>
</template>

<script>
import UAParser from 'ua-parser-js';

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
    };
  },

  computed: {
    isMobile(){
      // { model: '', type: '', vendor: '' }
      let device = this.uaParsed?.getDevice();
      // possible devices: console, mobile, tablet, smarttv, wearable, embedded
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
      }
    },
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