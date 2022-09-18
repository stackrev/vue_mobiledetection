import { getDatabase, ref, child, set, get } from "firebase/database";

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
    this.dbrefMobiles = ref(this.db, "mobiles");
    this.dbrefBrowsers = ref(this.db, "browsers");
  }

  /**
   * Save a new mobile config
   * @param {*} user
   * @returns
   */
  saveMobile(uid, mobile) {
    return new Promise((resolve, reject) => {
      const obj = {};
      obj[`${uid}`] = mobile;
      set(this.dbrefMobiles, obj)
        .then(() => {
          resolve(obj);
        })
        .catch((error) => {
          console.log(`saveMobile fail: ${error}`);
          reject(null, error);
        });
    });
  }

  /**
   * Save a new browser config
   * @param {*} user
   * @returns
   */
  saveBrowser(uid, userAgent) {
    return new Promise((resolve, reject) => {
      const obj = {};
      obj[`${uid}`] = userAgent;
      set(this.dbrefBrowsers, obj)
        .then(() => {
          resolve(obj);
        })
        .catch((error) => {
          console.log(`saveBrowser fail: ${error}`);
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
  readMobile(uid) {
    return new Promise((resolve, reject) => {
      get(child(this.dbrefMobiles, `${uid}`))
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

  /**
   * Reads a browser config.
   *
   * @param {*} id
   * @returns
   */
  readBrowser(uid) {
    return new Promise((resolve, reject) => {
      get(child(this.dbrefBrowsers, `${uid}`))
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
