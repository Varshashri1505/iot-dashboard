from tensorflow.keras.models import load_model, Sequential

# load old model
old_model = load_model("saved_models/LSTM_model.h5", compile=False)

# create new clean model
new_model = Sequential()

for layer in old_model.layers:
    new_model.add(layer)

# save new model cleanly
new_model.save("saved_models/fixed_model.h5", save_format="h5")

print("Model fixed successfully")