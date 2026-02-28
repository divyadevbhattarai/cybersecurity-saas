from sklearn.ensemble import IsolationForest
import joblib
import pandas as pd

def train_isolation_forest(data):
    """
    This function trains the Isolation Forest model and saves it to a file.
    :param data: The data on which the model will be trained
    :return: None
    """
    df = pd.DataFrame(data)
    X = df[['failed_login_attempts', 'hour_of_access']]

    # Train the Isolation Forest model
    model = IsolationForest(n_estimators=100, contamination=0.2)
    model.fit(X)

    # Save the model to disk
    joblib.dump(model, 'anomaly_detection_model.pkl')
    print("Model trained and saved as 'anomaly_detection_model.pkl'")
