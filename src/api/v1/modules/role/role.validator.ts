import { isRequired } from '../../helpers/validator';
import { validateRequest } from '../../middlewares';

export const addRoleValidator = [
  isRequired('name', 'Role Name'),
  validateRequest,
];
