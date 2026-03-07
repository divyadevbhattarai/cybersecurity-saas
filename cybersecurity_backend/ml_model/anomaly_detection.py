import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def detect_anomalies_extended(data):
    """
    Extended anomaly detection to include IP address and geolocation.

    :param data: List of user behavior records (e.g., failed login attempts, IP, geolocation)
    :return: List of anomalies detected (outliers)
    """

    if not data:
        return []

    # Convert input data to DataFrame
    df = pd.DataFrame(data)

    # Features for the model (failed login attempts, hour_of_access, geolocation, IP address)
    required_cols = ['failed_login_attempts', 'hour_of_access', 'geolocation', 'ip_address']
    if not all(col in df.columns for col in required_cols):
        return []

    # Convert string columns to numeric encoding
    X = df[required_cols].copy()
    
    # Encode geolocation (country/city string to numeric)
    if X['geolocation'].dtype == 'object':
        X['geolocation'] = pd.factorize(X['geolocation'])[0]
    
    # Encode IP address (convert to numeric representation)
    if X['ip_address'].dtype == 'object':
        def ip_to_numeric(ip):
            try:
                parts = ip.split('.')
                if len(parts) == 4:
                    return sum(int(parts[i]) * (256 ** (3 - i)) for i in range(4))
                return 0
            except:
                return 0
        X['ip_address'] = X['ip_address'].apply(ip_to_numeric)

    # Create and train the Isolation Forest model
    model = IsolationForest(n_estimators=100, contamination=0.2, random_state=42)
    model.fit(X)

    # Predict anomalies (-1 = anomaly, 1 = normal)
    df['anomaly'] = model.predict(X)

    # Filter anomalies
    anomalies = df[df['anomaly'] == -1]

    # Return anomalies as a list of dictionaries
    return anomalies.to_dict(orient='records')
