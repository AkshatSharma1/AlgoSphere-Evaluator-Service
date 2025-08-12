import runJava from "../containers/runJavaDocker";
import DockerStreamOutput from "../types/dockerStreamOutput";
import { ICodeEvaluatorStrategy } from "../types/codeEvaluatorStrategy";

export class JavaRunnerStrategy implements ICodeEvaluatorStrategy {
    async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<{output: string, status: string, stderr: string, stdout: string}> {
        try {
            const result: DockerStreamOutput = await runJava(code, inputTestCase, outputTestCase);
            if (result.stdout){
                return {output: result.stdout, status: "completed", stderr: result.stderr, stdout: result.stdout};
            }
            else {
                return {output: result.stderr, status: "not completed", stderr: result.stderr, stdout: result.stdout};
            }
        } catch (error) {
            console.error(`Error executing Java code: ${error}`);
            throw error;
        }
    }
}