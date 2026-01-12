import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
    namespace: '/analytics',
})
export class AnalyticsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger('AnalyticsGateway');
    private connectedClients = new Map<string, Set<string>>();

    constructor(private readonly analyticsService: AnalyticsService) { }

    afterInit() {
        this.logger.log('Analytics WebSocket Gateway initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        client.emit('connected', { message: 'Connected to analytics stream' });
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        // Remove from all subscriptions
        this.connectedClients.forEach((clients, channel) => {
            clients.delete(client.id);
        });
    }

    @SubscribeMessage('subscribe')
    handleSubscribe(
        @MessageBody() data: { channels: string[] },
        @ConnectedSocket() client: Socket,
    ) {
        const { channels } = data;
        channels.forEach((channel) => {
            if (!this.connectedClients.has(channel)) {
                this.connectedClients.set(channel, new Set());
            }
            this.connectedClients.get(channel)?.add(client.id);
            client.join(channel);
        });
        return { subscribed: channels };
    }

    @SubscribeMessage('unsubscribe')
    handleUnsubscribe(
        @MessageBody() data: { channels: string[] },
        @ConnectedSocket() client: Socket,
    ) {
        const { channels } = data;
        channels.forEach((channel) => {
            this.connectedClients.get(channel)?.delete(client.id);
            client.leave(channel);
        });
        return { unsubscribed: channels };
    }

    @SubscribeMessage('getDashboard')
    async handleGetDashboard(@ConnectedSocket() client: Socket) {
        const metrics = await this.analyticsService.getDashboardMetrics();
        return { event: 'dashboard', data: metrics };
    }

    // Methods to broadcast updates (called by services)
    broadcastSaleUpdate(sale: any) {
        this.server.to('sales').emit('sale:new', sale);
        this.logger.debug(`Broadcasted new sale: ${sale.id}`);
    }

    broadcastInventoryUpdate(update: any) {
        this.server.to('inventory').emit('inventory:updated', update);
    }

    broadcastLowStockAlert(alert: any) {
        this.server.to('inventory').emit('inventory:low-stock', alert);
        this.server.to('alerts').emit('alert:low-stock', alert);
    }

    broadcastMetricsUpdate(metrics: any) {
        this.server.to('dashboard').emit('metrics:updated', metrics);
    }

    getConnectedClientsCount(): number {
        return this.server?.sockets?.sockets?.size || 0;
    }
}
