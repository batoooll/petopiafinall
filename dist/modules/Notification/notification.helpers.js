"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireNotification = fireNotification;
/** Run a notification without failing the parent business operation. */
function fireNotification(task) {
    void task.catch(() => { });
}
//# sourceMappingURL=notification.helpers.js.map