import { SocketIoConfig } from "ngx-socket-io";


// http and socket config
export class GlobalRef {
  public sUrlGlobal = 'http://localhost:3000/';
  public config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };
}





