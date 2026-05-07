"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetController = void 0;
const pets_service_1 = require("./pets.service");
class PetController {
    static createPet = async (req, res, next) => {
        try {
            const pet = await pets_service_1.PetService.createPet(req.user.userId, req.body);
            res.status(201).json({
                success: true,
                message: "Pet created successfully",
                data: pet,
            });
        }
        catch (err) {
            next(err);
        }
    };
    static getMyPets = async (req, res, next) => {
        try {
            const pets = await pets_service_1.PetService.getMyPets(req.user.userId, req.query);
            res.json({
                success: true,
                data: pets,
            });
        }
        catch (err) {
            next(err);
        }
    };
    static getPet = async (req, res, next) => {
        try {
            const pet = await pets_service_1.PetService.getPetById(req.user.userId, req.params.id);
            res.json({ success: true, data: pet });
        }
        catch (err) {
            next(err);
        }
    };
    static updatePet = async (req, res, next) => {
        try {
            const pet = await pets_service_1.PetService.updatePet(req.user.userId, req.params.id, req.body);
            res.json({ success: true, data: pet });
        }
        catch (err) {
            next(err);
        }
    };
    static deletePet = async (req, res, next) => {
        try {
            await pets_service_1.PetService.deletePet(req.user.userId, req.params.id);
            res.json({
                success: true,
                message: "Pet deleted",
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.PetController = PetController;
//# sourceMappingURL=pets.controller.js.map