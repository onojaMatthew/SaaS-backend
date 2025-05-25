import Joi from 'joi';

export const userInputSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email',
    'string.empty': 'Email is required',
  }),

  businessName: Joi.string().required().messages({
    'string.empty': 'Business name is required',
  }),

  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 3 characters long',
  }),

  textContent: Joi.string().min(10).required().messages({
    'string.empty': 'Text content is required',
    'string.min': 'Text content must be at least 10 characters long',
  }),
});