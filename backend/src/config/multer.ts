import multer from 'multer'

export default {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10mb
  },
  fileFilter: (
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    // 1. Incluído o webp na lista
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // 2. Agora o erro é disparado com a mensagem exata que você planejou!
      cb(new Error("A imagem deve ter até 10MB e estar nos formatos jpg, jpeg, webp ou png."));
    }
  }
}
