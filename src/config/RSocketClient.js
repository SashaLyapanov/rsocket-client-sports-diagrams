import {JsonSerializers, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client/build";

const socketClient = new RSocketClient({
    transport: new RSocketWebSocketClient({url: 'localhost:7001'}),
    serializers: JsonSerializers,
});

export default socketClient;