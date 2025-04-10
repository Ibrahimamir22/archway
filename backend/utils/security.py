import base64
import hmac
import hashlib
import time
from typing import Dict, Optional, Tuple
from django.conf import settings


def generate_signed_url(path: str, expiry: int = 3600) -> str:
    """
    Generate a signed URL that expires after the specified time.
    
    Args:
        path: The path to the resource
        expiry: Number of seconds until the URL expires (default: 1 hour)
        
    Returns:
        A signed URL with expiration
    """
    timestamp = int(time.time()) + expiry
    message = f"{path}:{timestamp}".encode('utf-8')
    secret = settings.SECRET_KEY.encode('utf-8')
    signature = hmac.new(secret, message, hashlib.sha256).hexdigest()
    
    # Format: /path/to/resource?expires=1234567890&signature=abc123
    return f"{path}?expires={timestamp}&signature={signature}"


def validate_signed_url(url: str) -> Tuple[bool, Optional[str]]:
    """
    Validate a signed URL.
    
    Args:
        url: The signed URL to validate
        
    Returns:
        A tuple of (is_valid, error_message)
    """
    try:
        # Parse URL to extract path, expiry and signature
        base_url, query = url.split('?', 1)
        params = dict(param.split('=') for param in query.split('&'))
        
        if 'expires' not in params or 'signature' not in params:
            return False, "Missing expires or signature parameters"
            
        expires = int(params['expires'])
        signature = params['signature']
        
        # Check if URL has expired
        if time.time() > expires:
            return False, "URL has expired"
            
        # Verify signature
        message = f"{base_url}:{expires}".encode('utf-8')
        secret = settings.SECRET_KEY.encode('utf-8')
        expected_signature = hmac.new(secret, message, hashlib.sha256).hexdigest()
        
        if signature != expected_signature:
            return False, "Invalid signature"
            
        return True, None
    except Exception as e:
        return False, f"Error validating URL: {str(e)}"


def encrypt_sensitive_data(data: str) -> str:
    """
    Placeholder for encrypting sensitive data.
    In production, use a proper encryption library like cryptography.
    
    Args:
        data: The data to encrypt
        
    Returns:
        Encrypted data
    """
    # This is just a placeholder - in production use proper encryption
    return f"ENCRYPTED:{base64.b64encode(data.encode('utf-8')).decode('utf-8')}"


def decrypt_sensitive_data(encrypted_data: str) -> str:
    """
    Placeholder for decrypting sensitive data.
    In production, use a proper encryption library like cryptography.
    
    Args:
        encrypted_data: The encrypted data
        
    Returns:
        Decrypted data
    """
    # This is just a placeholder - in production use proper decryption
    if encrypted_data.startswith("ENCRYPTED:"):
        base64_data = encrypted_data[10:]  # Remove "ENCRYPTED:" prefix
        return base64.b64decode(base64_data).decode('utf-8')
    return encrypted_data
