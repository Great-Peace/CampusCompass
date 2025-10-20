import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/occupancy',
})
export class OccupancyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToLocation')
  handleSubscribeToLocation(client: Socket, locationId: string) {
    client.join(`location:${locationId}`);
    return { event: 'subscribed', locationId };
  }

  @SubscribeMessage('unsubscribeFromLocation')
  handleUnsubscribeFromLocation(client: Socket, locationId: string) {
    client.leave(`location:${locationId}`);
    return { event: 'unsubscribed', locationId };
  }

  emitOccupancyUpdate(data: any) {
    this.server.to(`location:${data.locationId}`).emit('occupancyUpdate', data);
    this.server.emit('globalOccupancyUpdate', data);
  }
}