//Cookie Get Set
export function getCookie(name) {
    var nameOfCookie = name + "=";
    var x = 0;
    while (x <= document.cookie.length) {
        var y = (x + nameOfCookie.length);
        if (document.cookie.substring(x, y) === nameOfCookie) {
        var endOfCookie = document.cookie.indexOf(";", y)
        if (endOfCookie === -1)
            endOfCookie = document.cookie.length;
        return unescape(document.cookie.substring(y, endOfCookie));
        }
        x = document.cookie.indexOf(" ", x) + 1;
        if (x === 0)
        break;
    }
    return "";
}
  
export function setCookie(name, value, expireDayCnt) {
    var expires = "";
    if (expireDayCnt) {
        var date = new Date();
        date.setTime(date.getTime() + (expireDayCnt * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = escape(name) + "=" + (value || "") + expires + "; path=/";
}