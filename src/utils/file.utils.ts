export function extname(filename: string):string{
    return '.'+filename.split('.').pop();
}

export function isPicture(file: Express.Multer.File){
    return file.mimetype === "image/png" || file.mimetype === "image/jpeg";
}
