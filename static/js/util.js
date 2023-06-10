"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = void 0;
/** 校验邮箱 */
function checkEmail(email) {
    return email.match(/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
}
exports.checkEmail = checkEmail;
