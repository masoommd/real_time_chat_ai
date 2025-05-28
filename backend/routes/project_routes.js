import {Router} from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/project_controller.js';
import * as authMiddleware from '../middleware/auth_middleware.js';

const router = Router();

router.post(
    '/create',
    authMiddleware.authUser,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
);

router.get(
    '/all',
    authMiddleware.authUser,
    projectController.getAllProject
);

router.put(
    '/add-user',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project Id is required'),
    body('users').isArray({min:1}).withMessage('Users must be an array of strings').bail()
    .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each User must be an array of strings'),    
    projectController.addUserToProject
);

router.get('/get-project/:projectId',
    authMiddleware.authUser,
    projectController.getProjectById
)

router.put('/update-file-tree',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project Id is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree
)

export default router;