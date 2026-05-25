"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adSettings_controller_1 = require("../controllers/adSettings.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', adSettings_controller_1.getAdSettings);
router.put('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['Super Admin', 'Admin']), adSettings_controller_1.updateAdSettings);
exports.default = router;
