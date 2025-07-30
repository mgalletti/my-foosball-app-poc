import { FoosballServiceError } from './exceptions.js';
import { logger } from './logger.js';

type ExceptionMapping = [
  new (...args: any[]) => Error,
  new (...args: any[]) => FoosballServiceError,
  displayMessage: string,
];

export function exceptionMapping(mappings: ExceptionMapping[]) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    const logError = (originalError: string, errorClassName: string, displayMessage: string, args: any[]) => {
      const innerErrorMessage = originalError.replace(new RegExp('\\n', 'g'), '');
      logger.error(
        {
          methodName: propertyName,
          className: target.constructor.name,
          errorClassName: errorClassName,
          innerErrorMessage: innerErrorMessage,
          displayMessage: displayMessage,
          args: args,
        },
        `An error occurred while running operation "${propertyName}" of "${target.constructor.name}" class.\nInner exception: "${innerErrorMessage}".\nDisplay message: "${displayMessage}". Args: "${args}".`,
      );
    };

    const handleError = (error: any, args: any[]) => {
      logger.error(`${error}. Code: ${error.code}.}`);
      for (const [InnerException, CustomException, displayMessage] of mappings) {
        if (error instanceof InnerException) {
          logError(error.message, error.name, displayMessage, args);
          throw new CustomException(`${displayMessage} '${args}'`, error);
        }
      }
      logger.error("Couldn't map exception");
      logError(`${error.message}`, error.name, 'Unknown error', args);
      throw error;
    };

    logger.info(`Decorator applied to method: ${method}`);
    descriptor.value = function (...args: any[]) {
      try {
        const result = method.apply(this, args);
        if (result instanceof Promise) {
          return result.catch((error: any) => handleError(error, args));
        }
        return result;
      } catch (error) {
        handleError(error, args);
      }
    };

    return descriptor;
  };
}
