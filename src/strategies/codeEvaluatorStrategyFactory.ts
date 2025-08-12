import { ICodeEvaluatorStrategy } from "../types/codeEvaluatorStrategy";
import { CppRunnerStrategy } from "./cppRunnerStrategy";
import { JavaRunnerStrategy } from "./javaRunnerStrategy";
import { PythonRunnerStrategy } from "./pythonRunnerStrategy";

export class codeEvaluatorStrategyFactory {
    static createStrategy(language: string): ICodeEvaluatorStrategy | null {
        switch (language.toLowerCase()) {
            case "java":
                return new JavaRunnerStrategy();
            case "cpp":
                return new CppRunnerStrategy();
            case "python":
                return new PythonRunnerStrategy();
            default:
                return null;
        }
    }
}