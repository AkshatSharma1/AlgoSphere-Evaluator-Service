// src/containers/runPythonDocker.ts

import createContainer from "./containerFactory";
import { PYTHON_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import DockerStreamOutput from "../types/dockerStreamOutput";
import dockerResourcesConfig from "../config/dockerResourcesConfig";
import TimeLimitExceededError from "../errors/TimeLimitExceededError";

export default async function runPython(code: string, inputTestCase: string, outputTestCase: string): Promise<DockerStreamOutput> {
    const rawLogBuffer: Buffer[] = [];
    console.log("Initializing the python container");
    console.log(outputTestCase);
    

    // Host config file for preventing fork bomb
    const hostConfig = {
        Memory: dockerResourcesConfig.docker.memoryLimit,
        CpuShares: dockerResourcesConfig.docker.cpuShares,
        PidsLimit: dockerResourcesConfig.docker.pidsLimit
    };

    // Escape single quotes in the code and input to prevent shell injection
    const processedCode = code.replace(/'/g, "'\\''");
    const processedInput = inputTestCase.replace(/'/g, "'\\''");

    // Command to write code to a file and then execute it with input piped from echo
    const command = `echo '${processedCode}' > test.py && echo '${processedInput}' | python3 test.py`;

    const pythonContainer = await createContainer(PYTHON_IMAGE, [
        '/bin/sh',
        '-c',
        command
    ], hostConfig);

    await pythonContainer.start();
    console.log("Python container started");

    const loggerStream = await pythonContainer.logs({
        stdout: true,
        stderr: true,
        follow: true
    });

    loggerStream.on('data', (chunk) => {
        rawLogBuffer.push(chunk);
    });

    // Timeout execution to prevent infinite loop
    const executionPromise: Promise<DockerStreamOutput> = new Promise((res, rej) => {
        const timeout = setTimeout(async () => {
            console.log("Execution timed out. Stopping container.");
            await pythonContainer.stop();
            rej(new TimeLimitExceededError());
        }, 10000);

        loggerStream.on('end', () => {
            clearTimeout(timeout);
            const logs: DockerStreamOutput = decodeDockerStream(rawLogBuffer);
            console.log(logs);
            res(logs);
        });
    });

    try {
        const result: DockerStreamOutput = await executionPromise;
        return result;
    } finally {
        await pythonContainer.remove();
        console.log("Container removed");
    }
}