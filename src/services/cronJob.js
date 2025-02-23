import cron from "node-cron";
import { generateBlock } from "./walletService";

const startCronJob = () => {
    // cron.schedule("* * * * * *", () => {
    //     generateBlock()
    // });

    cron.schedule("* * * * *", () => {
        generateBlock()
    });

};

export default startCronJob;
