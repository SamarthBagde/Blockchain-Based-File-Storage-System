from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.fernet import Fernet
import os
import base64
import json
from io import BytesIO

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ENCRYPTED_FOLDER = 'encrypted'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)

# Generate a Fernet key from password and salt
def generate_key(password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))

@app.route('/encrypt', methods=['POST'])
def encrypt_file():
    file = request.files.get('file')
    password = request.form.get('password')

    if not file or not password:
        return jsonify({'error': 'File and password are required'}), 400

    filename = file.filename
    data = file.read()

    salt = os.urandom(16)
    key = generate_key(password, salt)
    fernet = Fernet(key)
    encrypted_data = fernet.encrypt(data)

    result_json = {
        "filename": filename,
        "salt": base64.b64encode(salt).decode(),
        "encrypted_data": base64.b64encode(encrypted_data).decode()
    }

    json_bytes = json.dumps(result_json).encode()
    json_stream = BytesIO(json_bytes)
    json_stream.seek(0)

    return send_file(
        json_stream,
        mimetype='application/json',
        as_attachment=True,
        download_name=f'encrypted_{filename}.json'
    )

@app.route('/decrypt', methods=['POST'])
def decrypt_file():
    file = request.files.get('file')
    password = request.form.get('password')
    salt_b64 = request.form.get('salt')  # Salt as base64 string

    if not file or not password or not salt_b64:
        return jsonify({'error': 'File, password, and salt are required'}), 400

    try:
        salt = base64.b64decode(salt_b64)
        encrypted_data = file.read()

        key = generate_key(password, salt)
        fernet = Fernet(key)
        decrypted_data = fernet.decrypt(encrypted_data)

        filename = file.filename.replace("encrypted_", "")
        decrypted_path = os.path.join(UPLOAD_FOLDER, f'decrypted_{filename}')
        with open(decrypted_path, 'wb') as f:
            f.write(decrypted_data)

        return send_file(decrypted_path, as_attachment=True)

    except Exception as e:
        return jsonify({'error': 'Decryption failed. Check your password or file format.', 'details': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)