import bcrypt from 'bcryptjs';


export const hash = (password: string): string => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const compare = (password: string, hash: string): boolean => { 
    return bcrypt.compareSync(password, hash);
}