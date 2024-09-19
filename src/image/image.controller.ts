import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { join } from 'path';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':imageName')
  getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = this.imageService.getImagePath(imageName);
    return res.sendFile(imagePath);
  }
}