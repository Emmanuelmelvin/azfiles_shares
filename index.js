const { ShareServiceClient } = require("@azure/storage-file-share");
require('dotenv').config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const serviceClient = ShareServiceClient.fromConnectionString(connectionString);
const directoryName = `user1`;
const shareName = `assets`;
const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(directoryName)

//make share and directory
async function MakeShareAndDirectory() {
    try {
        const shareClient = serviceClient.getShareClient(shareName);
        await shareClient.create();
        console.log(`Create share ${shareName} successfully`);

        const directoryClient = shareClient.getDirectoryClient(directoryName);
        await directoryClient.create();
        console.log(`Create directory ${directoryName} successfully`);
    }
    catch (err) {
        console.log(err);
    }
}

//create a file and upload to directory
async function UploadFileToDirectory() {
    try {
        //create a file
        const content = "Hello World!";
        const fileName = "bios"
        const fileClient = directoryClient.getFileClient(fileName);
        await fileClient.create(content.length);
        console.log(`Create file ${fileName} successfully`);

        // Upload file range
        await fileClient.uploadRange(content, 0, content.length);
        console.log(`Upload file range "${content}" to ${fileName} successfully`);
    }
    catch (err) {
        console.log(err);
    }
}

async function MakeShareAndDirectory() {
    try {
        const shareName = `assets`;
        const shareClient = serviceClient.getShareClient(shareName);

        // Check if the share exists
        const shareExists = await shareClient.exists();
        if (!shareExists) {
            await shareClient.create();
            console.log(`Create share ${shareName} successfully`);
        }

        const directoryName = `user1`;
        const directoryClient = shareClient.getDirectoryClient(directoryName);

        // Check if the directory exists
        const directoryExists = await directoryClient.exists();
        if (!directoryExists) {
            await directoryClient.create();
            console.log(`Create directory ${directoryName} successfully`);
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function ListFilesAndDirectory(){
    let dirIter = directoryClient.listFilesAndDirectories();
  let i = 1;
  for await (const item of dirIter) {
    if (item.kind === "directory") {
      console.log(`${i} - directory\t: ${item.name}`);
    } else {
      console.log(`${i} - file\t: ${item.name}`);
    }
    i++;
  }
}


//list shares in the storage account
async function ListShares() {
    try {
        let shareIter = serviceClient.listShares();
        let i = 1;
        for await (const share of shareIter) {
            console.log(`Share${i}: ${share.name}`);
            i++;
        }
    } catch (error) {
        console.log(error)
    }
}

//performm action
ListFilesAndDirectory()