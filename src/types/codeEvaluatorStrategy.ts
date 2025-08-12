export interface ICodeEvaluatorStrategy {
    execute(code: string, inputTestCase: string, outputTestCase: string): Promise<{
      stdout: any;output: string, status: string, stderr: string
}>
}