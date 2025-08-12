export default class BaseEvaluationError extends Error {
    public statusCode: number;

    constructor(name: string, statusCode: number, message: string){
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype)
    }
}