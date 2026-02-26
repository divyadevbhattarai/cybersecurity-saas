from rest_framework import views, status
from rest_framework.response import Response
from .models import Breach
from .serializers import BreachSerializer
from rest_framework.permissions import IsAuthenticated

class BreachListView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        breaches = Breach.objects.all()
        serializer = BreachSerializer(breaches, many=True)
        return Response(serializer.data)

class BreachDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            breach = Breach.objects.get(pk=pk)
        except Breach.DoesNotExist:
            return Response({'error': 'Breach not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = BreachSerializer(breach)
        return Response(serializer.data)
