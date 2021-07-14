import {isPicture} from "../../utils/file.utils";

export async function arePicturesFiles(req, res, next) {
    if(req.files) {
        for (const file of req.files as Express.Multer.File[]) {
            if (!isPicture(file)) {
                res.status(415).end();
                return;
            }
        }
    }
    next();
}

export async function isPictureFile(req, res, next) {
    if(req.file) {
        if (!isPicture(req.file)) {
            res.status(415).end();
            return;
        }
    }
    next();
}
