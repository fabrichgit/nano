"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeployment = exports.getAllDeployments = exports.getDeployment = exports.createDeployment = void 0;
const zod_1 = require("zod");
const deploymentService_1 = __importDefault(require("../services/deploymentService"));
const deploymentService = new deploymentService_1.default();
const createDeploymentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1)
});
const createDeployment = async (req, res) => {
    try {
        if (!req.files || !req.files.build) {
            return res.status(400).json({ error: 'No build files uploaded' });
        }
        const validation = createDeploymentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error });
        }
        const deployment = await deploymentService.createDeployment(validation.data.name, req.files);
        res.status(201).json(deployment);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create deployment' });
    }
};
exports.createDeployment = createDeployment;
const getDeployment = (req, res) => {
    const deployment = deploymentService.getDeployment(req.params.id);
    if (!deployment) {
        return res.status(404).json({ error: 'Deployment not found' });
    }
    res.json(deployment);
};
exports.getDeployment = getDeployment;
const getAllDeployments = (_req, res) => {
    const deployments = deploymentService.getAllDeployments();
    res.json(deployments);
};
exports.getAllDeployments = getAllDeployments;
const deleteDeployment = (req, res) => {
    const success = deploymentService.deleteDeployment(req.params.id);
    if (!success) {
        return res.status(404).json({ error: 'Deployment not found' });
    }
    res.status(204).send();
};
exports.deleteDeployment = deleteDeployment;
