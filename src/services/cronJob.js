import cron from "node-cron";

const startCronJob = () => {
    cron.schedule("* * * * * *", () => {
        console.log("*");
    });
};

export default startCronJob;
