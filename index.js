
const { ShareServiceClient } = require("@azure/storage-file-share");
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
require('dotenv').config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const serviceClient = ShareServiceClient.fromConnectionString(connectionString);
const shareName = `assets`;
const directoryName = `user1`;
const accountName = 'emmachid2'
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

async function ListFilesAndDirectory() {
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

// [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

async function downloadFileAndConvertToString() {
  try {
    const fileName = 'example'
    const fileClient = serviceClient
      .getShareClient(shareName)
      .getDirectoryClient(directoryName)
      .getFileClient(fileName);

    const downloadFileResponse = await fileClient.download();
    console.log(
      `Downloaded file content: ${(
        await streamToBuffer(downloadFileResponse.readableStreamBody)
      ).toString()}`
    );
  } catch (error) {
    console.log(error)
  }
}

async function deleteFile() {
  try {
    const fileName = 'example' //enter fiileName here
    const fileClient = serviceClient
      .getShareClient(shareName)
      .getDirectoryClient(directoryName)
      .getFileClient(fileName);
    await fileClient.delte()
    console.log(`File ${fileName} deleted successfully`)
  } catch (error) {
    console.log('File does not exist')
  }
}

//read text content from a pdf file
const pdfFilePath = './resources/mystory.pdf'
async function readPDFContent(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (err) {
    console.error('Error reading PDF:', err);
    throw err;
  }
}

async function UploadFileToDirectory(directoryClient, filePath) {
  try {
    // Read the content of the PDF file
    const content = await readPDFContent(filePath);
    const fileName = path.basename(filePath, path.extname(filePath)); // Use the PDF file name without extension

    const fileClient = directoryClient.getFileClient(fileName);
    const fileExists = await fileClient.exists();
    if (!fileExists) {
      await fileClient.create(content.length);
      console.log(`Create file ${fileName} successfully`);
    }

    // Convert content to buffer and get the byte length
    const contentBuffer = Buffer.from(content, 'utf-8');
    const contentLength = contentBuffer.byteLength;

    // Upload file range with correct content length
    await fileClient.uploadRange(contentBuffer, 0, contentLength);
    console.log(`Upload file range to ${fileName} successfully`);
  } catch (err) {
    console.log(err);
  }
}

async function UploadImageFile() {
  const fileName = 'profile'
  const filePath = './resources/image.png'
  const fileClient = directoryClient.getFileClient(fileName);
  const fileExists = await fileClient.exists()

  if (!fileExists) {
    // Read the file content into a buffer
    const fileContent = fs.readFileSync(filePath);
    // Create the file in Azure File Share
    const fileSize = fileContent.length;

    // Create the file in Azure File Share
    await fileClient.create(fileSize);

    // Upload the file content
    await fileClient.uploadRange(fileContent, 0, fileSize);
  } else {
    console.log('File already exists, do you want to change it?')
  }

}

async function streamToFile(readableStream, filePath) {
  return new Promise((resolve, reject) => {
    const writeableStream = fs.createWriteStream(filePath)
    readableStream.pipe(writeableStream)

    writeableStream.on('data', resolve)
    readableStream.on('data', resolve)
    readableStream.on("error", reject);
  });

}

async function GetImageFile() {
  const fileName = 'profile'
  const filePath = './resources/profileimage.png'
  const fileClient = directoryClient.getFileClient(fileName)

  const downloadFileResponse = await fileClient.download();
  await streamToFile(downloadFileResponse.readableStreamBody , filePath);

  console.log('File downloaded successfully')


}



//performm action
GetImageFile()