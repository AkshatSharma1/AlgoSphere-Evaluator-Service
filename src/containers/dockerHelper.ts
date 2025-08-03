import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

/**
 * Decodes a raw Docker log buffer into a string.
 * Docker multiplexes stdout and stderr streams. Each chunk of data is prefixed
 * with an 8-byte header:
 * - 1st byte: Stream type (0 for stdin, 1 for stdout, 2 for stderr)
 * - 2nd-4th bytes: Unused, always zero
 * - 5th-8th bytes: Big-endian unsigned 32-bit integer specifying the length of the data payload
 *
 * This function demultiplexes the stream and converts the payload to a UTF-8 string.
 *
 * @param {Buffer[]} bufferChunks - An array of Buffer objects, like the one from the container logs.
 * @returns {{stdout: string, stderr: string, combined: string}} An object containing the decoded stdout, stderr, and a combined log.
 */

/*Take buffer as input and decode it into a string
 * First chunk: "Hello from stdout!" on stdout
 * <Buffer 01 00 00 00 00 00 00 12 48 65 6c 6c 6f 20 66 72 6f 6d 20 73 74 64 6f 75 74 21>,
 * 
 * 1st byte: 01(in hex) -> 1(dec) means stdout
 * 2nd-4th bytes: 00 00 00 -> means unused
 * 5th-8th bytes: 00 00 00 12 -> size of payload = 12(in hex) is 18(in decimal) means length of value which is from byte 9th till end
 * So, initial 8 bytes is the HEADER DATA
*/

export default function decodeDockerStream(buffer: Buffer[]): DockerStreamOutput{
    //Decode the buffer into a string using the 'utf8' encoding
    //Read buffer chunk by chunk and decode it

    //Create a output returnable
    const output: DockerStreamOutput = {stdout:'', stderr:''};

    let offset = 0; //keeps track of current position in buffer
    const combinedBuffer = Buffer.concat(buffer)
    
    //traverse till reach end of buffer
    while(offset<combinedBuffer.length){
        //check which stream is this
        const streamType = combinedBuffer[offset];

        //next 4bytes contains stream payload size
        const payloadSize = combinedBuffer.readUInt32BE(offset+4);//this holds length of the value. [2nd-4th byte]

        //next bytes after HEADER SIZE represent payload
        const payloadStart = offset + DOCKER_STREAM_HEADER_SIZE;
        const payloadEnd = payloadStart + payloadSize;

        //extract payload
        const payload = combinedBuffer.subarray(payloadStart, payloadEnd).toString('utf-8');

        //Do operations according to streamType
        if(streamType===1){
            //stdout stream
            output.stdout+=payload;
        }
        else{
            //stderr stream
            output.stderr+=payload;
        }

        //move offset to next buffer start
        offset = payloadEnd;
    }

    return output;
}