"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const search_controller_1 = require("./search.controller");
const router = (0, express_1.Router)();
// GET /search?q=<query>
router.get('/', auth_middleware_1.protect, search_controller_1.search);
exports.default = router;
//# sourceMappingURL=search.routes.js.map