import pandas as pd

def preprocess_data(log_data):
    """
    Preprocess raw user log data into a format suitable for anomaly detection.
    This can include handling missing values, encoding categorical features, etc.

    :param log_data: Raw log data (e.g., failed login attempts, access locations)
    :return: Processed DataFrame suitable for modeling
    """

    # Example: Convert categorical features (e.g., location) to numeric using label encoding
    log_data['access_location'] = log_data['access_location'].astype('category').cat.codes

    # Return the preprocessed data
    return log_data
