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
      obj[mobile.model] = mobile;
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
      get(child(this.dbref, `${mobile.model}`))
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
