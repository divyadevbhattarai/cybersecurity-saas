"""
Standardized API response helpers.
Provides consistent response formatting across all endpoints.
"""
from rest_framework import status
from rest_framework.response import Response


def success_response(data=None, message=None, status_code=status.HTTP_200_OK):
    """
    Standard success response format.
    
    Args:
        data: Response payload
        message: Optional success message
        status_code: HTTP status code
    
    Returns:
        Response object with standardized format
    """
    response_data = {
        'success': True,
    }
    
    if message:
        response_data['message'] = message
    
    if data is not None:
        response_data['data'] = data
    
    return Response(response_data, status=status_code)


def error_response(message, code='ERROR', status_code=status.HTTP_400_BAD_REQUEST, details=None):
    """
    Standard error response format.
    
    Args:
        message: Error message
        code: Error code string
        status_code: HTTP status code
        details: Optional additional error details
    
    Returns:
        Response object with standardized error format
    """
    response_data = {
        'success': False,
        'error': {
            'code': code,
            'message': message,
        }
    }
    
    if details:
        response_data['error']['details'] = details
    
    return Response(response_data, status=status_code)


def paginated_response(queryset, serializer_class, request, status_code=status.HTTP_200_OK):
    """
    Standard paginated response format.
    
    Args:
        queryset: Django queryset
        serializer_class: DRF serializer class
        request: HTTP request object
        status_code: HTTP status code
    
    Returns:
        Response with pagination metadata
    """
    from rest_framework.pagination import PageNumberPagination
    from rest_framework.generics import ListAPIView
    
    paginator = PageNumberPagination()
    page = paginator.paginate_queryset(queryset, request)
    
    if page is not None:
        serializer = serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    serializer = serializer_class(queryset, many=True)
    return Response({
        'success': True,
        'data': serializer.data,
    }, status=status_code)


class APIResponseMixin:
    """
    Mixin class to add standardized response methods to views.
    """
    
    def success(self, data=None, message=None):
        return success_response(data, message, status.HTTP_200_OK)
    
    def created(self, data=None, message='Resource created successfully'):
        return success_response(data, message, status.HTTP_201_CREATED)
    
    def updated(self, data=None, message='Resource updated successfully'):
        return success_response(data, message, status.HTTP_200_OK)
    
    def deleted(self, message='Resource deleted successfully'):
        return success_response(message=message, status_code=status.HTTP_204_NO_CONTENT)
    
    def error(self, message, code='ERROR', status_code=status.HTTP_400_BAD_REQUEST):
        return error_response(message, code, status_code)
    
    def not_found(self, message='Resource not found'):
        return error_response(message, 'NOT_FOUND', status.HTTP_404_NOT_FOUND)
    
    def unauthorized(self, message='Authentication required'):
        return error_response(message, 'UNAUTHORIZED', status.HTTP_401_UNAUTHORIZED)
    
    def forbidden(self, message='Permission denied'):
        return error_response(message, 'FORBIDDEN', status.HTTP_403_FORBIDDEN)
    
    def validation_error(self, message, details=None):
        return error_response(message, 'VALIDATION_ERROR', status.HTTP_400_BAD_REQUEST, details)
