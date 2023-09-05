import { SocketIoConfig } from "ngx-socket-io";


// http and socket config
export class GlobalRef {
  public sUrlGlobal = 'http://localhost:3000/';
  public sUrlAvatarGlobal = this.sUrlGlobal + 'images/useravatar/';
  public sUrlPhotoPostGlobal = this.sUrlGlobal + 'images/posts/';
  public sUrlObjectGlobal = this.sUrlGlobal + 'images/protected_object/';
  public config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };
}





