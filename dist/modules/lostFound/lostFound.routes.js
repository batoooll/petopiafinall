"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const validate_middleware_1 = require("../../common/middlewares/validate.middleware");
const upload_middleware_1 = require("../../common/middlewares/upload.middleware");
const lostFound_controller_1 = require("./lostFound.controller");
const lostFound_dto_1 = require("./lostFound.dto");
const router = (0, express_1.Router)();
router.post("/lost", auth_middleware_1.protect, upload_middleware_1.uploadLostFound.array("images", 5), (0, validate_middleware_1.validate)(lostFound_dto_1.ReportLostPetSchema), lostFound_controller_1.LostFoundController.reportLostPet);
router.get("/lost", auth_middleware_1.protect, lostFound_controller_1.LostFoundController.getLostReports);
router.post("/found", auth_middleware_1.protect, upload_middleware_1.uploadLostFound.array("images", 5), (0, validate_middleware_1.validate)(lostFound_dto_1.ReportFoundPetSchema), lostFound_controller_1.LostFoundController.reportFoundPet);
router.get("/found", auth_middleware_1.protect, lostFound_controller_1.LostFoundController.getFoundReports);
router.delete("/found/:id", auth_middleware_1.protect, lostFound_controller_1.LostFoundController.deleteFoundReport);
exports.default = router;
//# sourceMappingURL=lostFound.routes.js.map