import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {INestApplication} from '@nestjs/common';
import {main} from './Storage';

async function bootstrap(port: number): Promise<void> {
    const app: INestApplication = await NestFactory.create(AppModule);
    await app.listen(port);
}

// bootstrap(3000).then(() => {
//     console.log(`Visit http://localhost:3000`);
// });
main();