import { isRequired } from '../../helpers/validator';
import { validateRequest } from '../../middlewares';
import { query } from 'express-validator';
import { Request } from 'express';

export const listApiRequestValidator = [
  query('from').optional().isDate().withMessage('val-date-format'),
  query('to')
    .optional()
    .isDate()
    .withMessage('val-date-format')
    .custom((value, { req }) => {
      const request = req as Request;
      const fromDate = request.query.from as string | undefined;
      if (value && fromDate && new Date(value) < new Date(fromDate)) {
        throw new Error('val-date-range-invalid');
      }
      return true;
    }),
];

export const addApiRequestValidator = [
  isRequired('companyId'),
  isRequired('domainId'),
  validateRequest,
];
