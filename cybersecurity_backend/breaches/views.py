from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Breach
from .serializers import BreachSerializer
from rest_framework.permissions import IsAuthenticated

class BreachViewSet(viewsets.ModelViewSet):
    queryset = Breach.objects.all()
    serializer_class = BreachSerializer
    permission_classes = [IsAuthenticated]
