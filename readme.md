# Vue and Capacitor - Porting to Mobile Apps made Easy.
 <!-- title: Vue and Capacitor - Porting to Mobile Apps made Easy. -->
![Image: Capacitors](banner.jpg "Capacitors")

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
- [Vue and Capacitor - Porting to Mobile Apps made Easy.](#vue-and-capacitor---porting-to-mobile-apps-made-easy)
  - [Build your Web App](#build-your-web-app)
- [Add some Capacitors](#add-some-capacitors)
- [Conclusion](#conclusion)
  - [References](#references)
  - [Github](#github)


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



# Conclusion



## References

- https://www.npmjs.com/package/ua-parser-js
- https://capacitorjs.com/


## Github

Article here is also available on [Github](https://github.com/adamd1985/microfrontend-quickstart)

#

<div align="right">Made with :heartpulse: by <b>Adam</b></div>
