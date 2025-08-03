// import Docker from "dockerode"
import createContainer from "./containerFactory";
// import { TestCases } from "../types/testCases";
import { PYTHON_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import DockerStreamOutput from "../types/dockerStreamOutput";

export default async function runPython(code:string){

    const rawLogBuffer: Buffer[] = [];
    
    console.log("Initializing the container");
    
    //Creating a python container
    const pythonContainer = await createContainer(PYTHON_IMAGE, ['python3','-c',code,'stty -echo']);
    await pythonContainer.start();
    console.log("Python container started");

    //Create logger streams
    const loggerStream = await pythonContainer.logs({
        stdout: true,
        stderr: true,
        follow: true //returs logs as stream if true else as a complete string
    })

    //Start reading from this stream object(here loggerStream)
    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk); //this is raw buffer, decode it to human readable
    })

    loggerStream.on('end',()=>{
        console.log(rawLogBuffer);
        const logs: DockerStreamOutput = decodeDockerStream(rawLogBuffer);
        console.log(logs);
        
    })

    return pythonContainer;
}
