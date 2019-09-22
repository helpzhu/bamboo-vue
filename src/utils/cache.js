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
    },
	setSession(name, content) {
		if (!name) return;
		window.sessionStorage.setItem(name, content);
	},
	getSession(name) {
		if (!name) return
		window.sessionStorage.getItem(name);
	},
	removeSession(name) {
		if (!name) return;
		window.sessionStorage.removeItem(name);
	}
}