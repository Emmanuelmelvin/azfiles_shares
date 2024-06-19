export const deleteFile =async ( shareName ,  directoryName , fileName) => {
    try {
        const fileClient = serviceClient
          .getShareClient(shareName)
          .getDirectoryClient(directoryName)
          .getFileClient(fileName);
        await fileClient.delte()
        return({
            status : true,
            message : 'Done!'
        })
      } catch (error) {
        return({
            status : error.message,
            message : 'File was not deleted'
        })
      }
}

export const deleteDirectory = async (shareName , directoryName) => {
    try {
        const directoryClient = serviceClient
          .getShareClient(shareName)
          .getDirectoryClient(directoryName)
        await directoryClient.delte()
        console.log(`File ${fileName} deleted successfully`)
      } catch (error) {
        console.log('File does not exist')
      }
}

export const deleteShare = async (shareName ) => {
    try {
        const shareClient = serviceClient
          .getShareClient(shareName)

        await shareClient.delte()
        console.log(`File ${fileName} deleted successfully`)
      } catch (error) {
        console.log('File does not exist')
      }
}