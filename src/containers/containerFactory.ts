// This will take some config and create objects, thats why Factory name given

import Docker from "dockerode";

/**
 * Creates a Docker container, pulling the image if it's not available locally.
 * @param imageName The name of the Docker image (e.g., "python:3.14-rc-slim").
 * @param cmdExecutable The command to execute inside the container.
 * @returns A promise that resolves to the created Docker container object.
 */

export default async function createContainer(imageName: string, cmdExecutable: string[], hostConfig?: Docker.ContainerCreateOptions['HostConfig']): Promise<Docker.Container> {
    const docker = new Docker();

    // This function attempts to pull the specified image from the Docker registry.
    // If the image already exists locally, Docker handles this efficiently without re-downloading.
    const pullImage = async (name: string) => {
        console.log(`Ensuring image '${name}' is available...`);
        try {
            // docker.pull() returns a stream of progress events.
            const stream = await docker.pull(name);
            
            // We need to wait for the pull operation to complete.
            // The 'docker.modem.followProgress' utility is the standard way to do this with dockerode.
            // It processes the stream and calls a callback when it's finished.
            await new Promise((resolve, reject) => {
                docker.modem.followProgress(stream, (err, output) => {
                    if (err) {
                        console.error(`Error pulling image '${name}'.`, err);
                        reject(err);
                    } else {
                        // The output parameter contains an array of progress event objects.
                        console.log(`Image '${name}' is ready.`);
                        resolve(output);
                    }
                });
            });
        } catch (error) {
            console.error(`Failed to pull image '${imageName}'.`);
            // Re-throw the error to be handled by the caller.
            throw error;
        }
    };

    // Before creating the container, ensure the image is available.
    await pullImage(imageName);

    console.log("Image is available. Creating container...");
    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true,  // Enable input stream
        AttachStdout: true, // Enable output stream
        AttachStderr: true, // Enable error stream
        OpenStdin: true,    // Keep the input stream open
        Tty: false,         // Set to false to get separate stdout/stderr streams
        HostConfig: hostConfig
    });
    console.log("Container created successfully.");

    return container;
}
