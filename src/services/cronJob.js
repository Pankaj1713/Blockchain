import cron from "node-cron";
import { generateBlock } from "./walletService.js";

const startCronJob = () => {
    cron.schedule("* * * * * *", () => {
        generateBlock()
    });
};

export default startCronJob;
