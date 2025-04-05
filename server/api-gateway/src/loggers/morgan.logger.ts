import morgan from "morgan";
import winstonLogger from "./winston.logger";

const morganLogger = morgan("combined", {
	stream: {
		write: (message) => winstonLogger.info(message.trim()),
	},
});

export default morganLogger;
