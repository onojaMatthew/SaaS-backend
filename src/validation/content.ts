import Joi from "joi"


export const contentInputSchema = Joi.object({
  title: Joi.string().min(5).required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Time is required',
    'string.min': 'Title must be at least 5 characters long',
  }),
  url: Joi.link().required().messages({
    "link.uri": "url must be a valid link",
    "any.required": "Cover image link is required"
  }),
  description: Joi.string().min(20).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 20 characters long"
  }),
  author: Joi.string().required().min(5).messages({
    "string.base": "Author must be a string",
    "string.empty": "Author is required",
    "any.min": "Author name mush be at least 5 characters long"
  }),
  textContent: Joi.string().min(200).required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content is required",
    "any.min": "Content mush be at least 200 characters long"
  }),
  category: Joi.string().min(200).required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Category is required",
    "any.min": "Category mush be at least 200 characters long"
  }),
})
