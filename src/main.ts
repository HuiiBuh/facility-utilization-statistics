import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {INestApplication} from '@nestjs/common';

async function bootstrap(port: number): Promise<void> {
    const app: INestApplication = await NestFactory.create(AppModule);
    await app.listen(port);
}

bootstrap(3000).then(() => {
    console.log(`\x1b[32m Visit\x1b[30m http://localhost:3000 \n\n`);
});
