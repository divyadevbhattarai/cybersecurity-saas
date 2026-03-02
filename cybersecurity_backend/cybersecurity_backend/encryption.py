import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
from django.conf import settings


class DataEncryption:
    def __init__(self):
        self.fernet = self._get_fernet()

    def _get_fernet(self):
        encryption_key = getattr(settings, 'DATA_ENCRYPTION_KEY', None)
        
        if not encryption_key:
            encryption_key = os.getenv('DATA_ENCRYPTION_KEY', 'dev-key-change-in-production')
        
        if len(encryption_key) < 32:
            kdf = PBKDF2(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b'cybershield-salt',
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(encryption_key.encode()))
        else:
            key = base64.urlsafe_b64encode(encryption_key[:32].encode())
        
        return Fernet(key)

    def encrypt(self, data):
        if isinstance(data, str):
            data = data.encode('utf-8')
        return self.fernet.encrypt(data).decode('utf-8')

    def decrypt(self, encrypted_data):
        if isinstance(encrypted_data, str):
            encrypted_data = encrypted_data.encode('utf-8')
        return self.fernet.decrypt(encrypted_data).decode('utf-8')

    def encrypt_dict(self, data):
        return {k: self.encrypt(str(v)) if not isinstance(v, (int, float, bool, type(None))) else v 
                for k, v in data.items()}

    def decrypt_dict(self, encrypted_data):
        return {k: self.decrypt(v) if isinstance(v, str) and not v.isdigit() and v not in ('True', 'False', 'None') 
                else v for k, v in encrypted_data.items()}


encryption_service = DataEncryption()
