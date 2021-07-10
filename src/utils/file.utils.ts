export function extname(filename: string):string{
    return '.'+filename.split('.').pop();
}
