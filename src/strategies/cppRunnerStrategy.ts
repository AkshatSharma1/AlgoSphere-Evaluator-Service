import runCpp from "../containers/runCppDocker";
import DockerStreamOutput from "../types/dockerStreamOutput";
import { ICodeEvaluatorStrategy } from "../types/codeEvaluatorStrategy";

export class CppRunnerStrategy implements ICodeEvaluatorStrategy {
    async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<{output: string, status: string, stderr: string, stdout: string}> {
        try {
            const result: DockerStreamOutput = await runCpp(code, inputTestCase, outputTestCase);
            if (result.stdout){
                return {output: result.stdout, status: "completed", stderr: result.stderr, stdout: result.stdout};
            }
            else {
                return {output: result.stderr, status: "not completed", stderr: result.stderr, stdout: result.stdout};
            }
        } catch (error) {
            console.error(`Error executing Cpp code: ${error}`);
            throw error;
        }
    }
}