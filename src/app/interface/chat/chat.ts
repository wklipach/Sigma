export interface IDocChat {
    id_user: number
    id_user_to: number;
    message: string;
    bMarked: boolean;
}


export interface IUserChat {
    id_user: number
    name: string;
    connected: boolean;
}