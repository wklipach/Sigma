export interface IUser {
    id: number;
    name: string;
    password: string;
    email: string;
    fio: string;
    bitdelete: boolean;
    organization: string;
}



export interface IOhrArchive {
    curUserMariaID: number
    curOhrLogin: string;
    curOhrConnected: boolean;
}