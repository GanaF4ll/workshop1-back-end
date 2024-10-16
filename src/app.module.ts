import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ColorModule } from './color/color.module';
import { ProductsModule } from './products/products.module';
import { AccessoryModule } from './accessory/accessory.module';
import { CategoryModule } from './category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ImageModule } from './image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    // ConfigModule pour utiliser le .env sur Nest.JS
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // ConfigModule est injecté dans le MongooseModule pour utiliser les variables d'env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('LOCAL_DB_URI'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ColorModule,
    ProductsModule,
    AccessoryModule,
    CategoryModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
