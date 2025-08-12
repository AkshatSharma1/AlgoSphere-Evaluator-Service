import BaseEvaluationError from "./BaseEvaluationError";

export default class UnsupportedLanguageError extends BaseEvaluationError {
    constructor(language: string) {
        super("UnsupportedLanguageError", 400, `Language ${language} is not supported.`);
    }
}