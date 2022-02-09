export default class LocalStorageClass {
    static getLocalStorage(key) {
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
    }

    static setLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static delLocalStorage(key) {
        localStorage.getItem(key) ? localStorage.removeItem(key) : null;
    }
}