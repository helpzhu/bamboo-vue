export default {
    getLocal: function (name) {
        if (!name) return;
        window.localStorage.getItem(name)
    },
    setLocal: function (name, content) {
        if (!name) return;
        window.localStorage.setItem(name, content)
    },
    removeLocal: function (name) {
        if (!name) return;
        window.localStorage.removeItem(name)
    }
}