import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomBytes } from 'crypto';
import { unlinkSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/gif', 'image/png'];
const ALLOWED_TEXT_MIMES = ['text/plain'];
const MAX_TXT_SIZE = 100 * 1024;

@Controller('files')
export class FilesController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const hash = randomBytes(16).toString('hex');
          cb(null, `${hash}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const mime: string = file.mimetype;
        if (
          ALLOWED_IMAGE_MIMES.includes(mime) ||
          ALLOWED_TEXT_MIMES.includes(mime)
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only jpeg, gif, png, txt are allowed'),
            false,
          );
        }
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    const mime: string = file.mimetype;

    if (ALLOWED_TEXT_MIMES.includes(mime) && file.size > MAX_TXT_SIZE) {
      unlinkSync(file.path);
      throw new BadRequestException('Text file must be less than 100KB');
    }

    return { url: `/uploads/${file.filename}` };
  }
}
