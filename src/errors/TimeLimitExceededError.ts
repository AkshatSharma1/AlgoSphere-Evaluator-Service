import BaseEvaluationError from "./BaseEvaluationError";

export default class TimeLimitExceededError extends BaseEvaluationError {
    constructor() {
        super("TimeLimitExceededError", 408, "Execution timed out");
    }
}