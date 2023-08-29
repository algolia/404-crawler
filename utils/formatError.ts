const formatError = (error: unknown) => {
  if (error instanceof Error) {
    throw new Error(`❌ error: ${error.message}`);
  }
  throw new Error(`❌ error: ${String(error)}`);
};

export default formatError;
