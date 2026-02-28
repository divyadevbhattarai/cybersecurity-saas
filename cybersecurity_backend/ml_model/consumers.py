from channels.generic.websocket import AsyncWebsocketConsumer
import json

class AnomalyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'anomaly_alerts'

        # Join the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': text_data
        }))

    async def send_anomaly_alert(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'alert': message
        }))
