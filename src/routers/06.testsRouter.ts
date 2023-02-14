import { Router } from 'express';
import { TestController } from '../features/test/testController';
import { container } from './00.compositionRoot';

export const testsRouter = Router({});

const testController = container.resolve(TestController);

testsRouter.delete('/', testController.deleteAllData.bind(testController));