import createContainer from "./containerFactory";
import { PYTHON_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import DockerStreamOutput from "../types/dockerStreamOutput";

export default async function runPython(code: string, inputTestCase: string) {

    const rawLogBuffer: Buffer[] = [];
    
    console.log("Initializing the container");

    const processedCode = code.split('\n')      // 1. Split by newlines
                              .map(line => line.trim()) // 2. Remove whitespace
                              .join('; '); //add ;
    
    //old command
    // const pythonContainer = await createContainer(PYTHON_IMAGE, ['python3','-c',code,'stty -echo']);

    // 1. Define the complete shell command as a single string.
    const command = `echo '${processedCode.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`; 

    // 2. Pass a proper array with three separate string elements to the container.
    const pythonContainer = await createContainer(PYTHON_IMAGE, [
        '/bin/sh', 
        '-c', 
        command
    ]);

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

    //to remove container from docker from done
    await new Promise((resolve, _reject)=>{
        loggerStream.on('end', () => {
            console.log(rawLogBuffer);
            const logs: DockerStreamOutput = decodeDockerStream(rawLogBuffer);
            console.log(logs);
            resolve(decodeDockerStream)
        });
    })

    await pythonContainer.remove();
}