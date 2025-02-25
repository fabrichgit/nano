import { Request, Response } from 'express';
import { z } from 'zod';
import DeploymentService from '../services/deploymentService';

const deploymentService = new DeploymentService();

const createDeploymentSchema = z.object({
  name: z.string().min(1)
});

export const createDeployment = async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.build) {
      return res.status(400).json({ error: 'No build files uploaded' });
    }

    const validation = createDeploymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const deployment = await deploymentService.createDeployment(
      validation.data.name,
      req.files
    );

    res.status(201).json(deployment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deployment' });
  }
};

export const getDeployment = (req: Request, res: Response) => {
  const deployment = deploymentService.getDeployment(req.params.id);
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found' });
  }
  res.json(deployment);
};

export const getAllDeployments = (_req: Request, res: Response) => {
  const deployments = deploymentService.getAllDeployments();
  res.json(deployments);
};

export const deleteDeployment = (req: Request, res: Response) => {
  const success = deploymentService.deleteDeployment(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Deployment not found' });
  }
  res.status(204).send();
};