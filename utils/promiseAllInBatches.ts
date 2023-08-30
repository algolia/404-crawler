/**
 * From https://stackoverflow.com/questions/37213316/execute-batch-of-promises-in-series-once-promise-all-is-done-go-to-the-next-bat
 * Same as Promise.all(items.map(item => task(item))), but it waits for
 * the first {batchSize} promises to finish before starting the next batch.
 */
const promiseAllInBatches = async <A, B>(
  task: (arg: A) => Promise<B>,
  items: A[],
  batchSize: number,
  callbackAfterBatch?: (results: B[]) => void
): Promise<[Error | null, B[]]> => {
  let position = 0;
  let results: B[] = [];
  while (position < items.length) {
    const itemsForBatch = items.slice(position, position + batchSize);
    // In case an error is thrown during the batch, we want to save the ones that were successful
    const currentResults: B[] = [];
    try {
      const newResults = await Promise.all(
        itemsForBatch.map(async (item) => {
          const returnTask = await task(item);

          currentResults.push(returnTask);
          return returnTask;
        })
      );
      if (callbackAfterBatch) {
        callbackAfterBatch(results);
      }

      results = [...results, ...newResults];
      position += batchSize;
    } catch (error) {
      return [error as Error, [...results, ...currentResults]];
    }
  }

  return [null, results];
};

export default promiseAllInBatches;
