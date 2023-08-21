export interface IDocChat {
    id_user: number
    id_user_to: number;
    message: string;
    bMarked: boolean;
    createdAt: number;
    msg_from_current_user: boolean;
    marked_icon: string;
}


export interface IUserChat {
    id_user: number
    name: string;
    connected: boolean;
    avatar_name?: string;
    ItIsAvatar?: string;
    connected_icon: string;
    ItIsUnread: boolean;
}