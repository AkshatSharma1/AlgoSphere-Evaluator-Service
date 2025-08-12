import { Job } from 'bullmq';
import { IJob } from '../types/bullMqJobDefn';
import { SubmissionPayload } from '../types/submissionPayload';
import { codeEvaluatorStrategyFactory } from '../strategies/codeEvaluatorStrategyFactory';
import SubmissionRepository from '../repositories/submission.repository'; // 1. Import repository
import BaseEvaluationError from '../errors/BaseEvaluationError';
import CompilationError from '../errors/CompilationError';

const submissionRepository = new SubmissionRepository(); // 2. Create an instance

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;

  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    if (!job) return;

    const key = Object.keys(this.payload)[0];
    const submissionPayload = this.payload[key];
    const { language, code, testCases, submissionId } = submissionPayload; // Destructure submissionId

    const strategy = codeEvaluatorStrategyFactory.createStrategy(language);
    if (!strategy) {
      await submissionRepository.updateStatus(
        submissionId,
        'Unsupported Language',
      );
      throw new Error(`Language ${language} not supported.`);
    }

    //Multiple Test cases loop
    for (const testCase of testCases) {
      try {
        const result = await strategy.execute(code, testCase.input, testCase.output);

        if (result.stderr && !result.stdout) {
          throw new CompilationError(result.stderr);
        }

        if (result.output.trim() !== testCase.output.trim()) {
          //iF ANY FAILED with wrong answer THEN RETURN THAT TESTCASE: UPDATE SUBMISSIONREPO FOR UPDATION IN DB
          console.log(`Job ${job.id} failed on a test case: ${testCase}`);
          await submissionRepository.updateStatus(submissionId, "Wrong Answer", `Failed on test case: ${testCase.input}`);
          return {status: "Wrong Answer", output: `Failed on test case: ${testCase.input}` }

        }
      } catch (error: any) {
        console.error(
          `Execution failed for job ${job.id}:`,
          error.name,
          error.message,
        );
        let status = 'Runtime Error';
        let output = error.message;

        if (error instanceof BaseEvaluationError) {
          status = error.name; // e.g., "TimeLimitExceededError"
        }

        // 4. Update DB on failure
        await submissionRepository.updateStatus(submissionId, status, output);
        throw error;
      }
    }
      //If ALL RAN SUCCESSFULLY THEN OUTPUT SUCCESS
      console.log(`Job ${job.id} passed all test cases successfully.`);
      await submissionRepository.updateStatus(submissionId, "Success", "All test cases passed");

      return { status: "Success", output:"All ran successful" };
  };

  failed = (job?: Job, error?: Error): void => {
    console.error(
      `Job ${job?.id} has failed. Error: ${error?.name} - ${error?.message}`,
    );
  };
}
