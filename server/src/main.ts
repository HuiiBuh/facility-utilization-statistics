import {INestApplication} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {readFileSync} from "fs";
import {AppModule} from "./app.module";

async function bootstrap(port: number, httpsOptions?: any): Promise<void> {
    const app: INestApplication = await NestFactory.create(AppModule, {
        httpsOptions,
    });
    await app.listen(port);
}

const environment: string = process.env.ENVIRONMENT;
if (environment === "production") {

    const httpsOptions = {
        key: readFileSync("/keys/nestjs.key"),
        cert: readFileSync("/keys/nestjs.cert"),
    };

    bootstrap(80, httpsOptions).then(() => {
        console.log(`\x1b[32m Visit\x1b[30m http://localhost:80 \n\n`);
    }).catch(e => console.log(e));
} else {
    bootstrap(3500).then(() => {
        console.log(`\x1b[32m Visit\x1b[30m http://localhost:3500 \n\n`);
    });
}

