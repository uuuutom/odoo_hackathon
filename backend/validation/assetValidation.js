import Joi from "joi";

export const createAssetSchema = Joi.object({
  assetName: Joi.string().trim().required(),

  category: Joi.string()
    .valid("Laptop", "Desktop", "Furniture", "Vehicle", "Electronics", "Others")
    .required(),

  brand: Joi.string().allow("", null),

  model: Joi.string().allow("", null),

  serialNumber: Joi.string().trim().required(),

  purchaseDate: Joi.date().optional(),

  purchasePrice: Joi.number().min(0).optional(),

  department: Joi.string().optional(),

  assignedTo: Joi.string().optional(),

  status: Joi.string()
    .valid("Available", "Allocated", "Maintenance", "Lost", "Scrapped")
    .optional(),

  condition: Joi.string().valid("New", "Good", "Fair", "Poor").optional(),

  image: Joi.string().allow("", null),
});

export const updateAssetSchema = createAssetSchema.fork(
  ["assetName", "category", "serialNumber"],
  (field) => field.optional(),
);
