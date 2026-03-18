from tensorflow.keras.models import load_model

model = load_model("saved_models/LSTM_model.h5", compile=False)

model.save("saved_models/fixed_model.h5")

print("Model fixed successfully")