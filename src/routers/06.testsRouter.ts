import { Router } from 'express';
import { testController } from './00.compositionRoot';

export const testsRouter = Router({});

testsRouter.delete('/', testController.deleteAllData.bind(testController));