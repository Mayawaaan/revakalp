import random
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Dense, Bidirectional, LSTM
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.utils import to_categorical
from tensorflow.keras import mixed_precision
import json

# -----------------------------
# Base phrases
# -----------------------------
positive_base = [
    "great product","excellent quality","amazing experience","loved it","very happy",
    "perfect purchase","highly recommended","best product","good quality","worth the money",
    "fantastic","awesome","so good","really nice","superb","impressive","outstanding",
    "top quality","brilliant","excellent value",

    "very satisfied","exceeded expectations","five stars","premium quality",
    "works perfectly","beautiful design","feels premium","solid build","great value",
    "extremely satisfied","delighted","happy customer","pleasant surprise","flawless",
    "no complaints","great experience","top notch","high quality","excellent finish",
    "super smooth","perfect quality","reliable","trustworthy","stylish","comfortable",
    "absolutely loved it","very well made","best purchase","money well spent",
    "exceptional quality","remarkable product","premium feel","well worth it",

    "great craftsmanship","excellent performance","strongly recommended",
    "very good product","beautifully made","impressed","loved the design",
    "highly satisfied","works great","better than expected","great choice",
    "happy purchase","nice quality","very impressive","super quality",

    "great buy","excellent build","long lasting","durable","feels solid",
    "perfect fit","great finish","premium look","excellent material",
    "comfortable to use","easy to use","great comfort","smooth experience",
    "value for price","worth every penny","happy with quality",

    "outstanding product","wonderful","top class","best quality","fantastic quality",
    "great look","stylish product","very classy","premium product",
    "excellent design","great usability","feels luxurious","nice texture",

    "excellent craftsmanship","impressive quality","very reliable",
    "high performance","works flawlessly","no issues","zero complaints",
    "great overall","fantastic buy","excellent overall","perfectly made",

    "great satisfaction","awesome quality","very comfortable","nice finish",
    "elegant","beautiful product","top grade","excellent choice",
    "loved everything","very happy purchase","super experience","perfect product",

    "amazing quality","great detailing","very polished","refined product",
    "classy design","premium build","great material","very smooth",
    "high standard","exceptionally good","great reliability","excellent durability"
]
neutral_base = [
    "okay product","average quality","fine","not bad","decent product",
    "acceptable","works as expected","nothing special","standard quality",
    "its okay","so so","neutral experience","reasonable","satisfactory",
    "fair enough","moderate quality","just fine","acceptable quality",

    "does the job","meets expectations","average product","nothing impressive",
    "okay experience","basic quality","neither good nor bad","regular product",
    "typical quality","usable","functional","no major issues","ordinary",
    "expected quality","fine for the price","pretty standard","okay for daily use",

    "neutral feeling","fair quality","just average","serviceable",
    "acceptable performance","no strong opinion","moderately good","works fine",
    "reasonable product","not impressive","passable","okayish quality",

    "average experience","satisfactory purchase","nothing extraordinary",
    "fine overall","simple product","basic performance","normal quality",
    "does what it should","adequate","plain","average finish","okay build",

    "moderate performance","expected results","usable quality","okay design",
    "average build","standard product","fine enough","not remarkable",
    "nothing fancy","functional item","ordinary quality","middle range",

    "neutral response","balanced experience","okay value","reasonable quality",
    "no complaints","nothing to praise","nothing to criticize","fair product",

    "average usability","okay comfort","normal experience","expected outcome",
    "basic product","regular experience","okay texture","simple quality",

    "moderately acceptable","okay overall","average standard","fine performance",
    "neutral review","nothing outstanding","satisfactory quality","fair experience",

    "okay material","standard finish","normal build","plain design",
    "average look","acceptable standard","okay workmanship","neutral opinion",

    "moderate satisfaction","basic usability","fine result","okay functionality",
    "expected performance","normal product","adequate quality","middle quality"
]
negative_base = [
    "bad product","terrible quality","worst experience","hate it",
    "very disappointed","waste of money","not worth it","poor quality",
    "awful","horrible","really bad","dont buy","garbage","useless",
    "cheap quality","extremely bad","regret buying",

    "very poor quality","disappointed purchase","low quality",
    "does not work","defective","cheaply made","not recommended",
    "poor experience","below average","bad experience","money wasted",
    "total waste","very frustrating","not satisfied","fails expectations",

    "poor performance","unreliable","damaged product","worst purchase",
    "very low quality","breaks easily","poorly made","unacceptable quality",
    "not usable","terrible experience","highly disappointing",

    "extremely disappointing","bad value","low standard",
    "poor craftsmanship","worst quality","cheap material","feels cheap",
    "bad build","very unhappy","disaster","complete waste",

    "poor finish","bad design","low durability","not durable",
    "bad choice","unpleasant experience","cheap product","poor usability",

    "low performance","not as described","overpriced","very bad quality",
    "waste purchase","faulty item","damaged on arrival","not reliable",

    "fails completely","very poor experience","not functional",
    "extremely poor","bad workmanship","poor material","substandard",

    "low grade","unhappy purchase","regret this","bad investment",
    "poor comfort","bad fitting","cheap finish","bad overall",

    "terrible build","disappointing quality","not acceptable",
    "low value","poor standard","bad durability","doesnt last",

    "highly dissatisfied","poor design","frustrating experience",
    "waste of effort","very low standard","cheap feel","awful quality",

    "failed product","defect ridden","unusable product",
    "worst quality ever","very disappointing purchase"
]
# -----------------------------
# Templates
# -----------------------------
positive_templates = [
    "this is a {}", "really {}", "absolutely {}", "i am very happy with this {}",
    "this product is {}", "overall a {}", "definitely {}", "extremely {}",
    "honestly {}", "very {}",

    "i absolutely love this {}", "super {}", "truly {}", "clearly {}",
    "this feels {}", "such a {}", "totally {}", "quite {}",
    "this turned out {}", "ended up being {}",

    "i am satisfied with this {}", "this is really {}", "this is extremely {}",
    "this looks {}", "this works {}", "this seems {}", "this feels very {}",
    "i am impressed with this {}", "i am glad this is {}",

    "hands down {}", "no doubt {}", "without question {}",
    "this exceeded expectations as {}", "this is honestly {}",
    "i would say this is {}", "this is just {}",

    "this came out {}", "this performs {}", "this quality is {}",
    "this build is {}", "this design is {}", "this experience is {}",

    "so {}", "really very {}", "amazingly {}", "surprisingly {}",
    "consistently {}", "clearly very {}", "truly impressive {}",

    "this purchase was {}", "this turned out to be {}",
    "this has been {}", "this remains {}", "this feels like {}",

    "i am fully satisfied with this {}", "i am genuinely happy with this {}",
    "this makes me feel {}", "this gives a {} experience",

    "this is exactly {}", "this is perfectly {}",
    "this is nicely {}", "this is wonderfully {}",

    "this product feels {}", "this product looks {}",
    "this product performs {}", "this product delivers {}",

    "i can say this is {}", "i must say this is {}",
    "i honestly find this {}", "i clearly find this {}",

    "overall this is {}", "overall very {}", "overall extremely {}",

    "this has been consistently {}", "this remains very {}",
    "this turned out surprisingly {}",

    "highly {}", "strongly {}", "definitely very {}",

    "this stands out as {}", "this qualifies as {}",
    "this easily feels {}", "this easily becomes {}",

    "i would describe this as {}",
    "one of the most {}",

    "this is truly a {}",
    "this is easily {}",
    "this is clearly {}",
    "this is reliably {}",

    "this feels premium and {}",
    "this feels solid and {}",
    "this looks stylish and {}",

    "i am confident this is {}",
    "i am convinced this is {}",

    "this consistently feels {}",
    "this consistently performs {}",

    "this checks all boxes as {}",
    "this delivers a {} experience",

    "this is a genuinely {}",
    "this is a really {}",
    "this is an absolutely {}",

    "this is worth being called {}",
    "this deserves to be called {}",

    "this product is truly {}",
    "this product is absolutely {}",
    "this product is very {}",

    "this has proven to be {}",
    "this has turned out {}",
    "this has remained {}",

    "overall it feels {}",
    "overall it looks {}",
    "overall it performs {}",

    "this is nothing but {}",
    "this is simply {}"
]
neutral_templates = [
    "this is {}", "overall {}", "it feels {}", "just {}",
    "experience was {}", "quality is {}", "seems {}", "kind of {}",

    "this feels somewhat {}", "this is fairly {}",
    "this is mostly {}", "this appears {}",

    "i would say this is {}", "this can be considered {}",
    "this turned out {}", "this ended up {}",

    "this feels okay and {}",
    "this feels reasonably {}",

    "this is neither good nor bad, just {}",
    "this is more or less {}",

    "overall it is {}", "overall it feels {}",
    "overall it seems {}",

    "this performs {}", "this works {}",
    "this functions {}",

    "this quality feels {}", "this build feels {}",
    "this design feels {}",

    "this gives a {} feeling",
    "this gives a {} experience",

    "this is somewhat {}", "this is slightly {}",
    "this is moderately {}",

    "this remains {}", "this stays {}",
    "this feels consistently {}",

    "this meets {}",
    "this matches {}",

    "this aligns with {}",
    "this falls under {}",

    "this can be described as {}",
    "this can be labeled as {}",

    "i feel this is {}",
    "i think this is {}",

    "i would describe this as {}",
    "i find this {}",

    "nothing more than {}",
    "nothing less than {}",

    "this feels average and {}",
    "this feels standard and {}",

    "this works fine as {}",
    "this works reasonably {}",

    "this does the job as {}",
    "this does what is {}",

    "this gives fairly {} results",
    "this gives expected {}",

    "this experience felt {}",
    "this usage felt {}",

    "this purchase feels {}",
    "this purchase was {}",

    "this sits at {}",

    "this lands somewhere around {}",
    "this falls somewhere between {}",

    "this is okay and {}",
    "this is fairly okay and {}",

    "this is acceptable and {}",
    "this is passable and {}",

    "this quality seems {}",
    "this quality remains {}",

    "this design looks {}",
    "this design feels {}",

    "this feels normal and {}",
    "this feels usual and {}",

    "this experience stays {}",
    "this experience remains {}",

    "overall nothing more than {}",
    "overall nothing less than {}",

    "overall it comes across as {}",
    "overall it can be seen as {}",

    "this is simply {}",
    "this is generally {}"
]
negative_templates = [
    "this is a {}", "really {}", "absolutely {}", "very {}",
    "i regret buying this {}", "this product is {}", "overall {}",
    "extremely {}",

    "this turned out {}", "this ended up {}",
    "this experience was {}",

    "this feels very {}", "this feels extremely {}",
    "this feels disappointingly {}",

    "this is honestly {}", "this is clearly {}",
    "this is seriously {}",

    "this turned out to be {}",
    "this proved to be {}",

    "this has been {}", "this remains {}",

    "this purchase was {}", "this purchase turned out {}",

    "i am unhappy with this {}",
    "i am disappointed with this {}",

    "i strongly regret this {}",
    "i completely regret this {}",

    "this failed to be {}",
    "this failed as {}",

    "this does not feel {}",
    "this does not work as {}",

    "this quality is {}", "this build is {}",
    "this design is {}",

    "this feels cheap and {}",
    "this looks bad and {}",

    "this performs {}", "this works {}",

    "this experience felt {}",
    "this experience turned {}",

    "this is nothing but {}",
    "this is simply {}",

    "this is far from {}",
    "this is nowhere near {}",

    "this is poorly {}",
    "this is badly {}",

    "this has become {}",
    "this has turned {}",

    "this purchase feels {}",
    "this purchase seems {}",

    "this product feels {}",
    "this product looks {}",

    "this product performs {}",
    "this product delivers {}",

    "i would describe this as {}",
    "i would label this as {}",

    "i can say this is {}",
    "i must say this is {}",

    "overall this feels {}",
    "overall this seems {}",

    "overall this turned out {}",
    "overall this ended up {}",

    "this was a very {}",
    "this was an extremely {}",

    "this became {}",
    "this stayed {}",

    "this has consistently been {}",
    "this continues to be {}",

    "this experience remains {}",
    "this situation is {}",

    "this is honestly very {}",
    "this is extremely very {}",

    "this deserves to be called {}",
    "this qualifies as {}",

    "this resulted in {}",
    "this led to {}",

    "this is frustratingly {}",
    "this is disappointingly {}",

    "this is clearly not {}",
    "this is definitely {}",

    "this is simply not {}",
    "this is just {}",

    "this ended up being {}",
    "this turned out as {}",

    "this is an outright {}",
    "this is a complete {}",

    "this product is truly {}",
    "this product is absolutely {}"
]
# -----------------------------
# Dataset Size (20 LAKH)
# -----------------------------
POS_RATIO = 0.4
NEU_RATIO = 0.3
NEG_RATIO = 0.3
BATCH_SIZE = 128
MAX_LEN = 30
VOCAB_SIZE = 10000
EPOCHS = 5
STEPS_PER_EPOCH = 50_000   # optimized (no need full 20L)

# -----------------------------
# Tokenizer (IMPORTANT FIX)
# -----------------------------
tokenizer = Tokenizer(num_words=VOCAB_SIZE, oov_token="<OOV>")

sample_texts = []
for _ in range(50_000):
    phrase = random.choice(
        positive_base + neutral_base + negative_base
    )
    template = random.choice(
        positive_templates + neutral_templates + negative_templates
    )
    sample_texts.append(template.format(phrase))

tokenizer.fit_on_texts(sample_texts)

# -----------------------------
# Data Generator
# -----------------------------
def data_generator():
    while True:
        texts, labels = [], []

        for _ in range(BATCH_SIZE):
            r = random.random()

            if r < POS_RATIO:
                phrase = random.choice(positive_base)
                template = random.choice(positive_templates)
                label = 2
            elif r < POS_RATIO + NEU_RATIO:
                phrase = random.choice(neutral_base)
                template = random.choice(neutral_templates)
                label = 1
            else:
                phrase = random.choice(negative_base)
                template = random.choice(negative_templates)
                label = 0

            # noise for realism
            if random.random() < 0.1:
                phrase += " !"

            texts.append(template.format(phrase))
            labels.append(label)

        seq = tokenizer.texts_to_sequences(texts)
        pad = pad_sequences(seq, maxlen=MAX_LEN, padding="post")
        yield pad, to_categorical(labels, num_classes=3)

# -----------------------------
# tf.data Pipeline
# -----------------------------
dataset = tf.data.Dataset.from_generator(
    data_generator,
    output_signature=(
        tf.TensorSpec(shape=(None, MAX_LEN), dtype=tf.int32),
        tf.TensorSpec(shape=(None, 3), dtype=tf.float32),
    )
).prefetch(tf.data.AUTOTUNE)

# -----------------------------
# Model (Stronger than Avg Pool)
# -----------------------------
model = Sequential([
    Embedding(VOCAB_SIZE, 128),
    Bidirectional(LSTM(64)),
    Dense(64, activation="relu"),
    Dense(3, activation="softmax", dtype="float32")
])

model.compile(
    optimizer="adam",
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.05),
    metrics=["accuracy"]
)

# -----------------------------
# Train
# -----------------------------
model.fit(
    dataset,
    epochs=EPOCHS,
    steps_per_epoch=STEPS_PER_EPOCH
)

# -----------------------------
# Save
# -----------------------------
model.save("sentiment_model_20_lakh.h5")

with open("tokenizer_20_lakh.json", "w", encoding="utf-8") as f:
    f.write(tokenizer.to_json())

print("✅ Sentiment model trained successfully")