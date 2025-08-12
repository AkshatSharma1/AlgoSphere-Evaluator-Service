// src/containers/runCppDocker.ts

import dockerResourcesConfig from "../config/dockerResourcesConfig";
import TimeLimitExceededError from "../errors/TimeLimitExceededError";
import DockerStreamOutput from "../types/dockerStreamOutput";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

export default async function runCpp(code: string, inputTestCase: string, outputTestCase: string): Promise<DockerStreamOutput> {
    const rawLogBuffer: Buffer[] = [];
    console.log(outputTestCase);
    

    const hostConfig = {
        Memory: dockerResourcesConfig.docker.memoryLimit,
        CpuShares: dockerResourcesConfig.docker.cpuShares,
        PidsLimit: dockerResourcesConfig.docker.pidsLimit
    };

    const processedCode = code.replace(/'/g, "'\\''");
    const processedInput = inputTestCase.replace(/'/g, "'\\''");

    const command = `echo '${processedCode}' > main.cpp && g++ main.cpp -o main && echo '${processedInput}' | ./main`;

    const cppContainer = await createContainer(CPP_IMAGE, [
        '/bin/sh',
        '-c',
        command
    ], hostConfig);

    await cppContainer.start();
    console.log("CPP container started");

    const loggerStream = await cppContainer.logs({
        stdout: true,
        stderr: true,
        follow: true
    });

    loggerStream.on('data', (chunk) => {
        rawLogBuffer.push(chunk);
    });

    const executionPromise: Promise<DockerStreamOutput> = new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
            console.log("Execution timed out. Stopping container.");
            await cppContainer.stop();
            reject(new TimeLimitExceededError());
        }, 10000);

        loggerStream.on('end', () => {
            clearTimeout(timeout);
            const logs: DockerStreamOutput = decodeDockerStream(rawLogBuffer);
            resolve(logs);
        });
    });

    try {
        const result: DockerStreamOutput = await executionPromise;
        return result;
    } finally {
        await cppContainer.remove();
        console.log("Removed cpp container");
    }
}