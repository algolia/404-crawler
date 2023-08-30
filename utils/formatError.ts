import { program } from "commander";

const formatError = (error: unknown) => {
  if (error instanceof Error) {
    program.error(`❌ error: ${error.message}`);
  }
  program.error(`❌ error: ${String(error)}`);
};

export default formatError;
