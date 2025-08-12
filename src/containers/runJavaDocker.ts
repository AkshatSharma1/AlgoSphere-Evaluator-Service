// src/containers/runJavaDocker.ts

import dockerResourcesConfig from "../config/dockerResourcesConfig";
import TimeLimitExceededError from "../errors/TimeLimitExceededError";
import DockerStreamOutput from "../types/dockerStreamOutput";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

export default async function runJava(code: string, inputTestCase: string, outputTestCase:string): Promise<DockerStreamOutput> {
    const rawLogBuffer: Buffer[] = [];
    console.log(outputTestCase);
    
    
    const hostConfig = {
        Memory: dockerResourcesConfig.docker.memoryLimit,
        CpuShares: dockerResourcesConfig.docker.cpuShares,
        PidsLimit: dockerResourcesConfig.docker.pidsLimit
    };

    const processedCode = code.replace(/'/g, "'\\''");
    const processedInput = inputTestCase.replace(/'/g, "'\\''");

    const command = `echo '${processedCode}' > Main.java && javac Main.java && echo '${processedInput}' | java Main`;

    const javaContainer = await createContainer(JAVA_IMAGE, [
        '/bin/sh',
        '-c',
        command
    ], hostConfig);

    await javaContainer.start();

    const loggerStream = await javaContainer.logs({
        stdout: true,
        stderr: true,
        follow: true
    });

    const executionPromise: Promise<DockerStreamOutput> = new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
            await javaContainer.stop();
            // Throw the specific error
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
        await javaContainer.remove();
        console.log("Removed java container");
    }
}