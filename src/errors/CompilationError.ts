import BaseEvaluationError from "./BaseEvaluationError";

export default class CompilationError extends BaseEvaluationError{
    constructor(message: string) {
        super("Compilation Error", 400, message)
    }
}