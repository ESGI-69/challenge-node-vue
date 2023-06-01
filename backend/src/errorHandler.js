/**
 * The error handler middleware
 * @type {import('express').ErrorRequestHandler}
 */
export default (err, req, res, _next) => {
  /**
   * The response payload. It will be populated with the errors
   * @type {{ missingFields?: string[], invalidFields?: string[] }}
   */
  const response = {};

  if (err.name === 'SequelizeValidationError') {
    /**
     * The errors from sequelize
     * @type {import('sequelize').ValidationErrorItem[]}
     */
    const errors = err.errors;

    /**
     * The missing fields. It will be populated with the fields that are missing
     * @type { string[] }
     */
    const missingFields = errors.filter((e) => e.type === 'notNull Violation');
    missingFields.map((e) => e.path);

    if (missingFields.length > 0) {
      response.missingFields = missingFields.map((e) => e.path);
    }

    /**
     * The invalid fields. It will be populated with the fields that are invalidate by the sequelize model
     */
    const invalidFields = errors.filter((e) => e.type === 'Validation error');
    invalidFields.map((e) => e.path);

    if (invalidFields.length > 0) {
      response.invalidFields = invalidFields.map((e) => e.path);
    }
  }

  if (err.name === 'JsonWebTokenError') {
    response.invalidToken = true;
  }
  
  if (err.name === 'Error') {
    response.reason = err.message;
  }

  if (Object.keys(response).length > 0) {
    return res.status(400).json(response);
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).send(err);
  }

  return res.sendStatus(500);
};
