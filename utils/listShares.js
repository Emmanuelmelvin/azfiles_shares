//list shares in the storage account
export const listShares = async (serviceClient) => {
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
  