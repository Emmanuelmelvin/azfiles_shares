export const MakeShareAndDirectory = async (serviceClient , shareName , directoryName) => {
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
  