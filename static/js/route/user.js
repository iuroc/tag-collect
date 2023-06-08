"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
var user = function (route) {
    if (route.status == 0) {
        route.status = 1;
        var clickLogout = route.dom.querySelector('.click-logout');
        clickLogout.addEventListener('click', function () {
            localStorage.removeItem('expires');
            location.href = '/logout';
        });
    }
};
exports.user = user;
