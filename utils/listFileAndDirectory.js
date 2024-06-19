export const ListFilesAndDirectory =  () => {
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