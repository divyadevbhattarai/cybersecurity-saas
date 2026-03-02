import magic
import os
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/json',
    'application/zip',
    'application/x-zip-compressed',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

ALLOWED_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.pdf', '.txt', '.json', '.csv',
    '.doc', '.docx', '.xls', '.xlsx', '.zip'
]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

DANGEROUS_EXTENSIONS = [
    '.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.application',
    '.gadget', '.msi', '.msp', '.mst', '.vbs', '.vbe', '.js', '.jse',
    '.wsf', '.wsh', '.ps1', '.ps1xml', '.ps2', '.ps2xml', '.psc1', '.psc2',
    '.msh', '.msh1', '.msh2', '.mshxml', '.msh1xml', '.msh2xml',
    '.jar', '.class', '.jsp', '.asp', '.aspx', '.php', '.cgi', '.pl',
    '.sh', '.bash', '.elf', '.dmg', '.pkg', '.deb', '.rpm'
]

DANGEROUS_CONTENT_SIGNATURES = [
    b'MZ',  # Windows executables
    b'\xfe\xed\xce\xbb',  # Mach-O
    b'\x7fELF',  # Linux ELF
    b'PK\x03\x04',  # ZIP with polyglot potential
]


class FileValidator:
    def __init__(self, max_size=MAX_FILE_SIZE):
        self.max_size = max_size
        self.mime = magic.Magic(mime=True)

    def validate_file(self, uploaded_file):
        if uploaded_file is None:
            return True, None

        file_name = uploaded_file.name
        file_size = uploaded_file.size
        file_content = uploaded_file.read(8192)
        uploaded_file.seek(0)

        if file_size > self.max_size:
            return False, f"File size exceeds maximum allowed size of {self.max_size / (1024*1024)}MB"

        ext = os.path.splitext(file_name)[1].lower()
        if ext in DANGEROUS_EXTENSIONS:
            return False, f"File extension '{ext}' is not allowed"

        if ext and ext not in ALLOWED_EXTENSIONS:
            return False, f"File extension '{ext}' is not in the allowed list"

        try:
            detected_mime = self.mime.from_buffer(file_content)
            if detected_mime not in ALLOWED_MIME_TYPES:
                return False, f"File type '{detected_mime}' is not allowed"
        except Exception:
            pass

        for signature in DANGEROUS_CONTENT_SIGNATURES:
            if file_content.startswith(signature):
                return False, "File contains potentially dangerous content"

        return True, None

    def validate_upload(self, uploaded_file):
        is_valid, error_message = self.validate_file(uploaded_file)
        if not is_valid:
            raise ValidationError({
                'file': error_message
            })
        return True


def validate_file_upload(view_func):
    def wrapper(request, *args, **kwargs):
        validator = FileValidator()
        
        if request.method == 'POST' and request.FILES:
            for file_key, uploaded_file in request.FILES.items():
                validator.validate_upload(uploaded_file)
        
        return view_func(request, *args, **kwargs)
    return wrapper
