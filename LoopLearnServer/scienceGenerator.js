// ── Deterministic Science Question Bank ──
// ~1,200 hand-crafted factual science Q&A items covering Grades 1–6.
// No LLM involved — instant, 100% accurate, works offline.
// Answers are shuffled at runtime so the correct answer isn't always first.

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Build a final question object — shuffles answer positions
function buildQ(question, correct, wrong, explanation) {
  const options = [correct, ...wrong.slice(0, 3)];
  const shuffled = shuffle(options);
  const correctIndex = shuffled.indexOf(correct);
  return {
    q: question,
    a: shuffled,
    correct: correctIndex,
    type: 'mcq',
    explanation: explanation || null,
  };
}

// ══════════════════════════════════════════════════════════
// GRADE 1 TOPICS
// ══════════════════════════════════════════════════════════

const ANIMALS_G1 = [
  buildQ('What do most animals need to survive?', 'Food, water, and shelter', ['Only food', 'Only water', 'Sunlight and air'], 'Animals need food for energy, water to stay hydrated, and shelter for protection.'),
  buildQ('Which animal has feathers?', 'Bird', ['Fish', 'Dog', 'Frog'], 'Birds are the only animals with feathers.'),
  buildQ('Which animal lives in water and has fins?', 'Fish', ['Cat', 'Rabbit', 'Horse'], 'Fish live in water and use fins to swim.'),
  buildQ('What do caterpillars turn into?', 'Butterflies', ['Birds', 'Beetles', 'Bees'], 'Caterpillars go through metamorphosis and become butterflies or moths.'),
  buildQ('Which animal makes honey?', 'Bees', ['Butterflies', 'Ants', 'Wasps'], 'Honey bees collect nectar from flowers and turn it into honey.'),
  buildQ('What covers a fish\'s body?', 'Scales', ['Fur', 'Feathers', 'Smooth skin'], 'Fish are covered in scales that protect them and help them swim.'),
  buildQ('Which animal is known for its black and white stripes?', 'Zebra', ['Giraffe', 'Elephant', 'Tiger'], 'Zebras have distinctive black and white stripes.'),
  buildQ('What do dogs use to hear?', 'Ears', ['Eyes', 'Nose', 'Tail'], 'Dogs use their ears to hear sounds, often better than humans.'),
  buildQ('Which animal carries its home on its back?', 'Snail', ['Crab', 'Turtle', 'Hedgehog'], 'Snails carry their shell home on their back at all times. Turtles also do, but snails are the classic answer for this riddle.'),
  buildQ('What sound does a cow make?', 'Moo', ['Oink', 'Baa', 'Cluck'], 'Cows make a mooing sound.'),
  buildQ('Which animal is the largest land animal?', 'Elephant', ['Giraffe', 'Hippo', 'Rhino'], 'African elephants are the largest land animals on Earth.'),
  buildQ('Where do polar bears live?', 'The Arctic', ['The jungle', 'The desert', 'The ocean'], 'Polar bears live in the cold Arctic region.'),
  buildQ('What do frogs start life as?', 'Tadpoles', ['Larvae', 'Eggs only', 'Tiny frogs'], 'Frogs hatch from eggs as tadpoles before growing into adult frogs.'),
  buildQ('Which body part do birds use to fly?', 'Wings', ['Legs', 'Tail', 'Beak'], 'Birds flap their wings to fly through the air.'),
  buildQ('What is a baby cat called?', 'Kitten', ['Cub', 'Pup', 'Foal'], 'A baby cat is called a kitten.'),
  buildQ('Which animal hops and has a pouch for its baby?', 'Kangaroo', ['Rabbit', 'Frog', 'Squirrel'], 'Kangaroos are marsupials that carry their young in a pouch.'),
  buildQ('What covers a bird\'s body?', 'Feathers', ['Scales', 'Fur', 'Smooth skin'], 'Birds are covered in feathers which help them fly and stay warm.'),
  buildQ('Which of these animals is a mammal?', 'Dog', ['Salmon', 'Eagle', 'Lizard'], 'Dogs are mammals — they have fur and feed their young milk.'),
  buildQ('What do herbivores eat?', 'Plants', ['Meat', 'Other animals', 'Fish'], 'Herbivores only eat plants, like grass, leaves, and fruit.'),
  buildQ('Which animal is known for spinning a web?', 'Spider', ['Ant', 'Bee', 'Caterpillar'], 'Spiders spin silk webs to catch insects for food.'),
];

const PLANTS_G1 = [
  buildQ('What do plants need to grow?', 'Sunlight, water, and soil', ['Only water', 'Only sunlight', 'Darkness and rain'], 'Plants need sunlight for energy, water to stay alive, and soil for nutrients and support.'),
  buildQ('What part of a plant soaks up water from the soil?', 'Roots', ['Leaves', 'Flowers', 'Stem'], 'Roots anchor the plant and absorb water and nutrients from the soil.'),
  buildQ('What part of a plant makes food using sunlight?', 'Leaves', ['Roots', 'Stem', 'Flowers'], 'Leaves contain chlorophyll and use sunlight to make food through photosynthesis.'),
  buildQ('What color is chlorophyll, the substance that makes leaves green?', 'Green', ['Yellow', 'Brown', 'Red'], 'Chlorophyll is the green pigment in leaves that captures sunlight.'),
  buildQ('What do flowers grow into?', 'Fruits and seeds', ['More flowers', 'Leaves', 'Roots'], 'After pollination, flowers develop into fruits that contain seeds.'),
  buildQ('What does a seed need to start growing?', 'Water and warmth', ['Only sunlight', 'Fertilizer', 'Cold and darkness'], 'Seeds need water and warmth to germinate and begin growing.'),
  buildQ('What part of the plant holds it upright?', 'Stem', ['Leaf', 'Root', 'Flower'], 'The stem supports the plant and carries water and nutrients between roots and leaves.'),
  buildQ('Which part of a plant is usually underground?', 'Roots', ['Leaves', 'Flowers', 'Fruit'], 'Roots grow underground and anchor the plant in the soil.'),
  buildQ('What is the green stuff inside leaves called?', 'Chlorophyll', ['Photosynthesis', 'Sap', 'Pollen'], 'Chlorophyll is the green pigment that captures sunlight for the plant.'),
  buildQ('What do we call it when plants make food from sunlight?', 'Photosynthesis', ['Digestion', 'Respiration', 'Pollination'], 'Photosynthesis is the process plants use to make food using sunlight, water, and carbon dioxide.'),
  buildQ('Which part of a plant makes pollen?', 'Flower', ['Leaf', 'Root', 'Seed'], 'Flowers produce pollen as part of the plant\'s reproduction.'),
  buildQ('What do plants give off that humans breathe in?', 'Oxygen', ['Carbon dioxide', 'Nitrogen', 'Steam'], 'Plants release oxygen as a byproduct of photosynthesis, which animals and humans breathe.'),
  buildQ('Which of these is a type of tree?', 'Oak', ['Rose', 'Tulip', 'Fern'], 'An oak is a large tree known for producing acorns.'),
  buildQ('What is a very small plant with no proper roots, stems, or leaves?', 'Moss', ['Fern', 'Cactus', 'Grass'], 'Moss is a simple plant that grows in damp places and doesn\'t have true roots or leaves.'),
  buildQ('What does a cactus store to survive in the desert?', 'Water', ['Sunlight', 'Food', 'Seeds'], 'Cacti store water in their thick stems to survive long dry periods.'),
  buildQ('What comes out of a flower to help make new plants?', 'Pollen', ['Sap', 'Nectar', 'Water'], 'Pollen is a fine powder that fertilizes other flowers to make seeds.'),
  buildQ('Which of these is a fruit that a plant makes?', 'Apple', ['Carrot', 'Potato', 'Onion'], 'Apples are fruits — they contain seeds inside.'),
  buildQ('What do we call a plant that loses its leaves in autumn?', 'Deciduous', ['Evergreen', 'Tropical', 'Annual'], 'Deciduous plants lose their leaves each autumn to save energy in winter.'),
  buildQ('Why do plants need sunlight?', 'To make food', ['To drink water', 'To stay cool', 'To grow roots'], 'Plants use sunlight to power photosynthesis, the process of making their own food.'),
  buildQ('Which of these is a vegetable that grows underground?', 'Carrot', ['Tomato', 'Broccoli', 'Lettuce'], 'Carrots are root vegetables that grow underground.'),
];

const WEATHER_G1 = [
  buildQ('What do we call water that falls from clouds?', 'Rain', ['Dew', 'Fog', 'Hail'], 'Rain is liquid water that falls from clouds in the sky.'),
  buildQ('What is frozen rain called?', 'Hail', ['Snow', 'Sleet', 'Frost'], 'Hail is balls of ice that form inside thunderclouds and fall to the ground.'),
  buildQ('What type of cloud is dark and brings rain?', 'Cumulonimbus', ['Cirrus', 'Stratus', 'Cumulus'], 'Cumulonimbus clouds are tall, dark storm clouds that bring heavy rain and thunder.'),
  buildQ('What is the name of the instrument used to measure temperature?', 'Thermometer', ['Barometer', 'Ruler', 'Compass'], 'A thermometer measures how hot or cold the air is.'),
  buildQ('What causes thunder?', 'Lightning heating the air', ['Clouds crashing', 'Wind blowing hard', 'Rain falling fast'], 'Thunder is the sound caused by lightning rapidly heating the surrounding air.'),
  buildQ('What season comes after summer?', 'Autumn', ['Winter', 'Spring', 'Summer'], 'The seasons go: spring, summer, autumn (fall), winter.'),
  buildQ('What do we call a very strong wind storm over the ocean?', 'Hurricane', ['Tornado', 'Blizzard', 'Thunderstorm'], 'A hurricane is a powerful tropical storm with very strong spinning winds that forms over warm ocean water.'),
  buildQ('What is snow made of?', 'Frozen water crystals', ['Frozen rain drops', 'White clouds', 'Ice pellets'], 'Snowflakes are tiny crystals of frozen water that fall from clouds.'),
  buildQ('What season has the most sunlight and is the warmest?', 'Summer', ['Spring', 'Winter', 'Autumn'], 'Summer has long days with lots of sunlight, making it the warmest season.'),
  buildQ('What do we call water vapor that we can see in the sky?', 'Clouds', ['Fog', 'Steam', 'Rain'], 'Clouds are made of tiny water droplets or ice crystals floating in the sky.'),
  buildQ('What is fog?', 'A cloud near the ground', ['Light rain', 'Cold wind', 'Frozen dew'], 'Fog is basically a low cloud that forms near the ground, making it hard to see.'),
  buildQ('What causes wind?', 'Moving air', ['Moving water', 'The sun directly', 'Clouds blowing'], 'Wind is caused by air moving from areas of high pressure to areas of low pressure.'),
  buildQ('Which season is coldest?', 'Winter', ['Autumn', 'Spring', 'Summer'], 'Winter has the shortest days and coldest temperatures.'),
  buildQ('What is a rainbow made of?', 'Light and water droplets', ['Clouds and sunlight', 'Colored gas', 'Dust and light'], 'Rainbows form when sunlight passes through water droplets and splits into colors.'),
  buildQ('What is the name of the scale used to measure temperature in the US?', 'Fahrenheit', ['Celsius', 'Kelvin', 'Centigrade'], 'The United States uses the Fahrenheit scale to measure temperature.'),
  buildQ('What season do flowers usually bloom?', 'Spring', ['Winter', 'Autumn', 'Summer'], 'Spring is when warmer temperatures cause flowers to bloom after winter.'),
  buildQ('What is sleet?', 'Partly frozen rain', ['Heavy snow', 'Thick fog', 'Light hail'], 'Sleet is rain that freezes into small ice pellets before reaching the ground.'),
  buildQ('What tool do meteorologists use to predict weather?', 'Weather instruments and computers', ['Telescopes', 'Microscopes', 'Seismographs'], 'Meteorologists use many tools — thermometers, barometers, radar, and computers — to forecast weather.'),
  buildQ('What do we call it when water evaporates and rises to form clouds?', 'The water cycle', ['Photosynthesis', 'Condensation only', 'Precipitation'], 'The water cycle is the continuous movement of water from the ground, up into clouds, and back down as rain.'),
  buildQ('What is the layer of air around the Earth called?', 'Atmosphere', ['Stratosphere', 'Ozone', 'Biosphere'], 'The atmosphere is the layer of gases surrounding the Earth, including the air we breathe.'),
];

const SENSES_G1 = [
  buildQ('How many senses do humans have?', 'Five', ['Three', 'Four', 'Six'], 'Humans have five main senses: sight, hearing, smell, taste, and touch.'),
  buildQ('Which body part do you use to see?', 'Eyes', ['Ears', 'Nose', 'Skin'], 'Eyes detect light and send signals to the brain so we can see.'),
  buildQ('Which sense organ do you use to smell?', 'Nose', ['Tongue', 'Ears', 'Skin'], 'The nose detects different smells by picking up chemicals in the air.'),
  buildQ('Which body part do you use to taste food?', 'Tongue', ['Nose', 'Teeth', 'Lips'], 'The tongue has taste buds that detect sweet, salty, sour, bitter, and savory flavors.'),
  buildQ('What sense do you use when you touch something hot?', 'Touch', ['Sight', 'Smell', 'Hearing'], 'The skin has nerve endings that detect heat, cold, pressure, and pain.'),
  buildQ('Which body part do you use to hear?', 'Ears', ['Eyes', 'Nose', 'Mouth'], 'Ears pick up sound waves and send signals to the brain.'),
  buildQ('What is the largest organ of the human body?', 'Skin', ['Brain', 'Heart', 'Lungs'], 'Skin is the largest organ — it covers the whole body and is the organ of touch.'),
  buildQ('What do taste buds help you detect?', 'Flavors', ['Colors', 'Sounds', 'Smells'], 'Taste buds on the tongue help detect the flavor of food and drink.'),
  buildQ('Which sense helps you balance?', 'Hearing (inner ear)', ['Sight', 'Touch', 'Smell'], 'The inner ear contains structures that help control balance and spatial orientation.'),
  buildQ('Which sense do you use to tell if something is rough or smooth?', 'Touch', ['Sight', 'Taste', 'Hearing'], 'The sense of touch, through receptors in the skin, tells us about texture.'),
  buildQ('What happens to your pupils in a dark room?', 'They get bigger', ['They get smaller', 'They disappear', 'They change color'], 'Pupils dilate (get bigger) in darkness to let in more light so you can see better.'),
  buildQ('Why do we close our eyes when there is bright light?', 'To protect them from too much light', ['Because we are tired', 'To hear better', 'To smell better'], 'Bright light can be harmful, so we squint or close our eyes to limit the amount entering.'),
  buildQ('Which sense do we use to hear music?', 'Hearing', ['Sight', 'Touch', 'Taste'], 'We use our ears and the sense of hearing to listen to music.'),
  buildQ('What do we use our eyes for?', 'Seeing', ['Tasting', 'Smelling', 'Hearing'], 'Eyes are our organs of sight.'),
  buildQ('Which sense helps you know if food has gone bad?', 'Smell', ['Sight', 'Touch', 'Hearing'], 'We often smell food to detect if it has spoiled before we taste it.'),
];

// ══════════════════════════════════════════════════════════
// GRADE 2 TOPICS
// ══════════════════════════════════════════════════════════

const HABITATS_G2 = [
  buildQ('What is a habitat?', 'The natural home of an animal', ['A type of food', 'A weather pattern', 'A body part'], 'A habitat is the natural environment where an animal lives, finds food, and raises young.'),
  buildQ('Which habitat is very hot and dry with lots of sand?', 'Desert', ['Rainforest', 'Tundra', 'Ocean'], 'Deserts are very dry habitats that receive very little rainfall.'),
  buildQ('What habitat is found at the bottom of a river or pond?', 'Freshwater', ['Ocean', 'Desert', 'Grassland'], 'Freshwater habitats include rivers, lakes, ponds, and streams.'),
  buildQ('Which animal is best suited for a desert habitat?', 'Camel', ['Penguin', 'Polar bear', 'Salmon'], 'Camels can store fat in their humps and go long periods without water, perfect for deserts.'),
  buildQ('Which habitat gets the most rainfall and has the most species?', 'Tropical rainforest', ['Desert', 'Tundra', 'Grassland'], 'Tropical rainforests receive huge amounts of rain and host more species than any other habitat.'),
  buildQ('Where do penguins live?', 'Antarctica (the South Pole)', ['The Arctic (North Pole)', 'The Sahara Desert', 'The Amazon Rainforest'], 'Penguins live in Antarctica and other cold southern regions — not in the Arctic.'),
  buildQ('What is the ocean\'s saltwater habitat home to?', 'Marine animals like fish and whales', ['Bears and wolves', 'Desert lizards', 'Forest birds'], 'The ocean is a marine habitat where saltwater animals like fish, sharks, and whales live.'),
  buildQ('Which habitat is covered in ice and snow year-round?', 'Tundra', ['Desert', 'Grassland', 'Rainforest'], 'The Arctic and Antarctic tundra are frozen habitats with very little plant life.'),
  buildQ('What do we call the place where land meets the sea?', 'Shoreline or coast', ['Delta', 'Valley', 'Plateau'], 'The coast or shoreline is where land and sea meet — a unique habitat for crabs, seabirds, and more.'),
  buildQ('Which animal lives in an underground burrow?', 'Rabbit', ['Eagle', 'Dolphin', 'Deer'], 'Rabbits dig burrows underground to live in and hide from predators.'),
  buildQ('What habitat do polar bears live in?', 'The Arctic', ['The rainforest', 'The savanna', 'The desert'], 'Polar bears are adapted to the cold Arctic habitat with thick fur and fat for insulation.'),
  buildQ('What is a forest habitat?', 'An area with many trees where many animals live', ['A dry, sandy area', 'A cold, icy area', 'An area covered in grass'], 'Forests are habitats covered in trees and home to many animals including deer, owls, and foxes.'),
  buildQ('Which habitat is mostly underwater with coral reefs?', 'Ocean', ['River', 'Lake', 'Swamp'], 'Coral reefs are found in warm, shallow ocean waters and are home to thousands of species.'),
  buildQ('What is a swamp?', 'A wetland habitat with shallow water and lots of plants', ['A dry rocky area', 'A cold icy plain', 'An underground cave'], 'Swamps are wetland habitats where the ground is waterlogged and trees or plants grow in the water.'),
  buildQ('Which bird is adapted for the ocean, catching fish by diving?', 'Pelican', ['Parrot', 'Owl', 'Robin'], 'Pelicans dive into the ocean to scoop up fish in their large bill pouches.'),
  buildQ('Why can\'t a polar bear survive in a desert?', 'It needs cold temperatures and ice to survive', ['It can only eat fish', 'It is too small', 'It can\'t walk on sand'], 'Polar bears are adapted for cold — their thick fur and fat would make them overheat in a desert.'),
  buildQ('What is a grassland habitat?', 'A flat, open area covered in grasses', ['A forest with tall trees', 'A cold snowy region', 'A rocky mountain area'], 'Grasslands are wide open areas covered in grasses — home to animals like zebras, lions, and bison.'),
  buildQ('Which habitat would you find the most types of insects?', 'Tropical rainforest', ['Desert', 'Arctic tundra', 'Ocean'], 'Rainforests have more species of insects than anywhere else on Earth.'),
  buildQ('What do animals need from their habitat to survive?', 'Food, water, shelter, and space', ['Only food and water', 'Only shelter', 'Just sunlight'], 'Animals need food, water, shelter, and enough space to live and reproduce.'),
  buildQ('Where do fish breathe?', 'Through gills in water', ['Through lungs on land', 'Through their skin', 'They don\'t breathe'], 'Fish use gills to extract oxygen from water, letting them breathe underwater.'),
];

const LIFE_CYCLES_G2 = [
  buildQ('What are the four stages of a butterfly\'s life cycle?', 'Egg, larva, pupa, adult', ['Egg, tadpole, frog, adult', 'Seed, sprout, plant, flower', 'Baby, child, teen, adult'], 'Butterflies go through complete metamorphosis: egg → caterpillar (larva) → chrysalis (pupa) → butterfly (adult).'),
  buildQ('What do frogs hatch from?', 'Eggs', ['Seeds', 'Live births', 'Cocoons'], 'Frogs lay eggs in water, which hatch into tadpoles.'),
  buildQ('What stage comes after the egg in a butterfly\'s life cycle?', 'Larva (caterpillar)', ['Pupa', 'Adult butterfly', 'Cocoon'], 'After hatching from eggs, butterfly larvae are called caterpillars.'),
  buildQ('What is a tadpole?', 'A baby frog', ['A baby fish', 'A baby turtle', 'A baby salamander'], 'Tadpoles are the larval stage of frogs — they live in water and breathe through gills.'),
  buildQ('What is the hard outer case a caterpillar forms called?', 'Chrysalis (pupa)', ['Cocoon', 'Egg', 'Nest'], 'A chrysalis is the protective case in which a caterpillar transforms into a butterfly.'),
  buildQ('What is the life cycle of a plant?', 'Seed, sprout, plant, flower, seed', ['Egg, larva, pupa, adult', 'Baby, child, adult', 'Root, stem, leaf, flower'], 'Plants begin as seeds, sprout into seedlings, grow into mature plants, flower, and produce new seeds.'),
  buildQ('Which animal does NOT hatch from an egg?', 'Dog', ['Bird', 'Snake', 'Turtle'], 'Dogs are mammals that are born live, not from eggs.'),
  buildQ('What do birds hatch from?', 'Eggs', ['Live births', 'Pouches', 'Cocoons'], 'All birds hatch from eggs laid by the mother.'),
  buildQ('How many stages are in a complete metamorphosis?', 'Four', ['Two', 'Three', 'Five'], 'Complete metamorphosis has four stages: egg, larva, pupa, and adult.'),
  buildQ('What is a nymph?', 'A young insect that looks like a small adult', ['A type of butterfly egg', 'A baby frog', 'A caterpillar stage'], 'Insects with incomplete metamorphosis (like grasshoppers) hatch as nymphs — small versions of the adult.'),
  buildQ('What does a caterpillar eat?', 'Leaves', ['Nectar', 'Other insects', 'Seeds'], 'Caterpillars mostly eat leaves to build up energy for their transformation.'),
  buildQ('What does the adult butterfly eat?', 'Nectar from flowers', ['Leaves', 'Other insects', 'Seeds'], 'Adult butterflies use their long tongue (proboscis) to drink nectar from flowers.'),
  buildQ('What stage comes just before becoming an adult frog?', 'Froglet', ['Tadpole', 'Egg', 'Larva'], 'A froglet is a young frog that has grown legs but may still have a small tail.'),
  buildQ('Which part of the plant life cycle comes first?', 'Seed', ['Flower', 'Fruit', 'Leaf'], 'A new plant begins as a seed before it germinates and sprouts.'),
  buildQ('What is metamorphosis?', 'A big change in an animal\'s body as it grows', ['A type of food', 'How animals sleep', 'A weather event'], 'Metamorphosis is the dramatic physical transformation some animals undergo as they grow.'),
];

const STATES_OF_MATTER_G2 = [
  buildQ('What are the three main states of matter?', 'Solid, liquid, and gas', ['Hot, warm, and cold', 'Heavy, medium, and light', 'Rock, water, and air only'], 'The three main states of matter are solid (fixed shape), liquid (flows), and gas (spreads out).'),
  buildQ('Which state of matter has a definite shape and volume?', 'Solid', ['Liquid', 'Gas', 'Plasma'], 'Solids have a fixed shape and volume — they don\'t change shape unless forced.'),
  buildQ('Which state of matter takes the shape of its container?', 'Liquid', ['Solid', 'Gas', 'Steam'], 'Liquids flow and take the shape of whatever container they are poured into.'),
  buildQ('What happens to water when it freezes?', 'It turns into ice (solid)', ['It turns into steam', 'It disappears', 'It turns into gas'], 'When water cools to 0°C (32°F), it freezes and becomes solid ice.'),
  buildQ('What is the process of liquid turning into gas called?', 'Evaporation', ['Condensation', 'Freezing', 'Melting'], 'Evaporation occurs when a liquid heats up and turns into water vapor (gas).'),
  buildQ('What is the process of gas turning into liquid called?', 'Condensation', ['Evaporation', 'Melting', 'Sublimation'], 'Condensation happens when gas cools and turns into liquid — like water droplets on a cold glass.'),
  buildQ('What is the process of solid turning into liquid called?', 'Melting', ['Freezing', 'Evaporation', 'Condensation'], 'Melting occurs when a solid is heated and turns into a liquid, like ice melting into water.'),
  buildQ('Which state of matter spreads out to fill any container?', 'Gas', ['Solid', 'Liquid', 'Ice'], 'Gases have no fixed shape or volume — they expand to fill whatever space they are in.'),
  buildQ('What state of matter is ice cream?', 'Solid', ['Liquid', 'Gas', 'It changes'], 'Ice cream is a solid because it holds its shape (until it melts!).'),
  buildQ('What state of matter is orange juice?', 'Liquid', ['Solid', 'Gas', 'Plasma'], 'Orange juice is a liquid — it flows and takes the shape of its container.'),
  buildQ('What happens to water when it is heated to 100°C?', 'It boils and turns to steam (gas)', ['It freezes', 'It becomes heavier', 'It turns purple'], 'Water boils at 100°C (212°F) and turns into water vapor (steam), a gas.'),
  buildQ('Which of these is an example of a gas?', 'Air', ['Wood', 'Water', 'Metal'], 'Air is a gas — it has no fixed shape and spreads throughout any space.'),
  buildQ('What is water vapor?', 'Water in its gas state', ['Water in its solid state', 'A type of cloud', 'Boiling water only'], 'Water vapor is water that has evaporated into the air — it\'s invisible gas.'),
  buildQ('Which state of matter is the hardest to compress?', 'Solid', ['Liquid', 'Gas', 'They are all the same'], 'Solids are difficult to compress because their particles are packed tightly together.'),
  buildQ('What state of matter is steam?', 'Gas', ['Liquid', 'Solid', 'A mix of liquid and gas'], 'Steam is water in its gas state — it forms when water boils.'),
];

const FORCES_G2 = [
  buildQ('What is a force?', 'A push or a pull', ['A type of energy', 'A material', 'A chemical reaction'], 'A force is a push or pull that can change the speed, direction, or shape of an object.'),
  buildQ('What force pulls objects toward the Earth?', 'Gravity', ['Magnetism', 'Friction', 'Air resistance'], 'Gravity is the force that pulls all objects toward the center of the Earth.'),
  buildQ('What force slows things down when they rub against a surface?', 'Friction', ['Gravity', 'Magnetism', 'Tension'], 'Friction is a force that acts against motion when two surfaces rub together.'),
  buildQ('What force allows magnets to attract iron objects?', 'Magnetism', ['Gravity', 'Friction', 'Electricity'], 'Magnetism is the force produced by magnets that attracts certain metals like iron.'),
  buildQ('Which of these would have MORE friction?', 'A rough road', ['A smooth ice rink', 'A polished floor', 'A still pond'], 'Rough surfaces have more friction, which makes it harder to slide on them.'),
  buildQ('What is gravity?', 'A pulling force that attracts objects toward each other', ['A pushing force', 'A type of heat energy', 'A magnetic force'], 'Gravity is an attractive force — the Earth\'s gravity pulls everything toward it.'),
  buildQ('What does a push do to a stationary object?', 'Makes it move', ['Makes it heavier', 'Makes it smaller', 'Has no effect'], 'Applying a push force to a stationary object will make it start moving.'),
  buildQ('Which of these is affected by gravity?', 'A falling apple', ['A radio signal', 'Light from a torch', 'Sound from a speaker'], 'Gravity pulls physical objects like a falling apple downward toward Earth.'),
  buildQ('What do we call the force that slows down a skydiver falling through the air?', 'Air resistance', ['Gravity', 'Friction', 'Tension'], 'Air resistance (drag) pushes against a falling object and slows it down.'),
  buildQ('Would a ball roll farther on ice or on carpet?', 'Ice', ['Carpet', 'The same distance', 'It depends only on the ball size'], 'Ice has less friction than carpet, so the ball rolls farther before stopping.'),
  buildQ('What force makes a compass needle point north?', 'Earth\'s magnetic force', ['Gravity', 'Friction', 'Air pressure'], 'The Earth acts like a giant magnet — its magnetic field makes compass needles point north.'),
  buildQ('What happens when you apply a force to change an object\'s direction?', 'It moves in a new direction', ['It stops completely', 'It gets heavier', 'Nothing changes'], 'A force applied sideways to a moving object can change its direction of travel.'),
  buildQ('Which has more gravity — the Moon or the Earth?', 'The Earth', ['The Moon', 'They are equal', 'Neither has gravity'], 'Earth is much larger than the Moon, so it has much stronger gravity.'),
  buildQ('What force is needed to hold a book up on a shelf?', 'The shelf pushing up (normal force)', ['Gravity pushing down', 'Air resistance', 'Magnetism'], 'The shelf exerts an upward normal force that balances the downward pull of gravity on the book.'),
  buildQ('What is weight?', 'The force of gravity pulling on an object\'s mass', ['How big an object is', 'How much space it takes up', 'How fast it moves'], 'Weight is the gravitational force acting on an object — it depends on mass and gravity.'),
];

// ══════════════════════════════════════════════════════════
// GRADE 3 TOPICS
// ══════════════════════════════════════════════════════════

const ECOSYSTEMS_G3 = [
  buildQ('What is an ecosystem?', 'All living and non-living things in an area working together', ['Only the animals in an area', 'Only the plants in an area', 'The weather in an area'], 'An ecosystem includes all plants, animals, and non-living things like air, water, and soil interacting together.'),
  buildQ('What do we call animals that only eat plants?', 'Herbivores', ['Carnivores', 'Omnivores', 'Decomposers'], 'Herbivores are plant-eaters — animals like cows, rabbits, and deer.'),
  buildQ('What do we call animals that only eat other animals?', 'Carnivores', ['Herbivores', 'Omnivores', 'Producers'], 'Carnivores eat meat — animals like lions, sharks, and eagles.'),
  buildQ('What do we call animals that eat both plants and animals?', 'Omnivores', ['Herbivores', 'Carnivores', 'Decomposers'], 'Omnivores eat both plants and animals — examples include humans, bears, and raccoons.'),
  buildQ('What do decomposers do in an ecosystem?', 'Break down dead plants and animals', ['Eat living animals', 'Make food from sunlight', 'Pollinate flowers'], 'Decomposers like fungi and bacteria break down dead organisms, returning nutrients to the soil.'),
  buildQ('What is a food chain?', 'The path energy flows from one organism to another', ['A list of all animals in an area', 'A chain animals use to climb', 'The water cycle'], 'A food chain shows how energy passes from producers (plants) through consumers to top predators.'),
  buildQ('Which organism is usually at the BOTTOM of a food chain?', 'Producer (plant)', ['Herbivore', 'Carnivore', 'Decomposer'], 'Plants (producers) are at the base of food chains because they make energy from sunlight.'),
  buildQ('What is a predator?', 'An animal that hunts and eats other animals', ['An animal that only eats plants', 'A plant that makes food', 'An animal that is eaten'], 'Predators hunt and kill prey animals for food.'),
  buildQ('What is prey?', 'An animal that is hunted and eaten by another animal', ['An animal that hunts others', 'A plant producer', 'A decomposer'], 'Prey are animals that are hunted and eaten by predators.'),
  buildQ('What happens to an ecosystem if all the plants disappear?', 'Herbivores lose their food and die, then carnivores too', ['Nothing changes', 'Only carnivores are affected', 'Decomposers take over'], 'Plants are the base of the food chain — without them, herbivores starve, then carnivores lose their prey.'),
  buildQ('What role do plants play in a food chain?', 'Producers — they make food from sunlight', ['Consumers', 'Decomposers', 'Predators'], 'Plants are producers because they use photosynthesis to create food from sunlight.'),
  buildQ('What is a food web?', 'Many food chains linked together', ['A spider\'s web used to catch food', 'A chart of all animals', 'The root system of plants'], 'A food web shows the many different feeding relationships in an ecosystem.'),
  buildQ('Which of these would be a secondary consumer?', 'A fox eating a rabbit', ['Grass growing in a field', 'A rabbit eating grass', 'Bacteria breaking down leaves'], 'A secondary consumer eats primary consumers (herbivores) — a fox eating a rabbit.'),
  buildQ('What is a biome?', 'A large region with similar climate and living things', ['A small pond ecosystem', 'A single food chain', 'The atmosphere'], 'Biomes are large-scale ecosystems defined by their climate, plants, and animals — like deserts or rainforests.'),
  buildQ('Why is the sun important for ecosystems?', 'It provides energy that producers use to make food', ['It heats the Earth only', 'It provides water', 'It creates wind'], 'The sun is the primary energy source for almost all ecosystems on Earth.'),
  buildQ('What do we call a relationship where both animals benefit?', 'Mutualism', ['Predation', 'Competition', 'Parasitism'], 'Mutualism is when two species both benefit from their interaction — like bees and flowers.'),
  buildQ('What happens when a species goes extinct?', 'It disappears forever', ['It moves to another ecosystem', 'It comes back later', 'It becomes a new species'], 'Extinction means a species is gone forever — no individuals of that kind are left.'),
  buildQ('Which of these is a decomposer?', 'Mushroom (fungus)', ['Lion', 'Oak tree', 'Rabbit'], 'Fungi like mushrooms are decomposers that break down dead organic material.'),
  buildQ('What is competition in an ecosystem?', 'When organisms fight for the same resources', ['When animals work together', 'When plants grow toward light', 'When animals migrate'], 'Competition occurs when two or more organisms need the same limited resource like food or space.'),
  buildQ('What is symbiosis?', 'A close relationship between two different species', ['When animals fight', 'A type of food chain', 'How plants reproduce'], 'Symbiosis is any close, long-term relationship between two different species.'),
];

const ADAPTATIONS_G3 = [
  buildQ('What is an adaptation?', 'A feature that helps an animal survive in its environment', ['A type of food', 'A behavior humans taught animals', 'A change in weather'], 'Adaptations are physical features or behaviors that help an organism survive in its habitat.'),
  buildQ('Why do polar bears have white fur?', 'Camouflage in the snow and insulation from cold', ['To look pretty', 'To attract mates only', 'To stay cool'], 'White fur camouflages polar bears in snow and ice, and their thick fur keeps them warm in the Arctic cold.'),
  buildQ('What adaptation helps a cactus survive in the desert?', 'Storing water in its thick stem', ['Having large leaves', 'Living near rivers', 'Growing very tall'], 'Cacti have thick stems that store water, allowing them to survive long periods without rain.'),
  buildQ('Why do chameleons change color?', 'To camouflage and communicate', ['Because they are cold-blooded', 'To attract food', 'Due to sunlight only'], 'Chameleons change color mainly to communicate and regulate body temperature, and sometimes for camouflage.'),
  buildQ('What is camouflage?', 'When an animal blends in with its surroundings', ['A type of migration', 'When animals hibernate', 'A loud warning signal'], 'Camouflage is an adaptation where an animal\'s color or pattern matches its environment to hide from predators.'),
  buildQ('Why do birds migrate south in winter?', 'To find warmer weather and food', ['To escape predators', 'To find a mate', 'Because the Earth tilts'], 'Many birds migrate to warmer regions in winter to find food that isn\'t available in cold, frozen habitats.'),
  buildQ('What adaptation do ducks have for swimming?', 'Webbed feet', ['Long beak', 'Hollow bones', 'Waterproof scales'], 'Ducks have webbed feet that act like paddles, helping them swim efficiently in water.'),
  buildQ('What is hibernation?', 'A long deep sleep animals use to survive winter', ['A summer migration', 'A type of food gathering', 'When animals change color'], 'Hibernation is an adaptation where animals enter a deep sleep, lowering their metabolism to survive cold winters.'),
  buildQ('Why do some animals have bright warning colors?', 'To warn predators they are poisonous or dangerous', ['To attract prey', 'For camouflage', 'Because of their diet'], 'Bright colors like red and yellow in some frogs and insects warn predators that they are toxic.'),
  buildQ('What do thick layers of fat (blubber) help sea mammals do?', 'Stay warm in cold water', ['Swim faster', 'Hunt better', 'Breathe underwater'], 'Blubber is a thick layer of fat that insulates marine mammals like whales and seals in cold water.'),
  buildQ('Why do woodpeckers have strong, pointed beaks?', 'To drill into wood and find insects', ['To crack open seeds', 'To attract mates', 'To build better nests'], 'Woodpeckers use their strong, chisel-like beaks to drill into trees and extract insects.'),
  buildQ('What is mimicry?', 'When a harmless animal looks like a dangerous one to avoid predators', ['When animals copy sounds', 'A type of camouflage in plants', 'When animals learn from humans'], 'Mimicry is when a harmless species evolves to look like a dangerous species to deter predators.'),
  buildQ('Why do some fish have eyes on the side of their head?', 'To see predators coming from many directions', ['To swim faster', 'To find food above water', 'For better night vision'], 'Eyes on the sides of the head give prey fish a wide field of view to spot approaching predators.'),
  buildQ('What adaptation helps eagles hunt from far away?', 'Extremely sharp eyesight', ['Long legs', 'Webbed feet', 'Sensitive whiskers'], 'Eagles have eyesight up to 5 times sharper than humans, allowing them to spot prey from high altitude.'),
  buildQ('How do deciduous trees adapt to winter?', 'By dropping their leaves', ['By growing more leaves', 'By moving their roots deeper', 'By producing more fruit'], 'Deciduous trees drop their leaves in autumn to conserve water and energy during cold winters.'),
];

const SIMPLE_MACHINES_G3 = [
  buildQ('What is a simple machine?', 'A tool that makes work easier by changing force or direction', ['An electric motor', 'A computer program', 'A vehicle engine'], 'Simple machines help us do work with less effort — they change the size or direction of a force.'),
  buildQ('Which of these is a simple machine?', 'Ramp (inclined plane)', ['Car engine', 'Electric drill', 'Calculator'], 'An inclined plane (ramp) is one of the six classic simple machines.'),
  buildQ('What are the six types of simple machines?', 'Lever, wheel and axle, pulley, inclined plane, wedge, screw', ['Push, pull, twist, lift, slide, turn', 'Gear, motor, belt, spring, pulley, valve', 'Ramp, wheel, rope, nail, blade, stick'], 'The six simple machines are: lever, wheel and axle, pulley, inclined plane (ramp), wedge, and screw.'),
  buildQ('What simple machine is a see-saw?', 'Lever', ['Pulley', 'Wedge', 'Screw'], 'A see-saw is a lever — a rigid bar that pivots on a fulcrum.'),
  buildQ('What simple machine is an axe blade?', 'Wedge', ['Lever', 'Screw', 'Pulley'], 'An axe blade is a wedge — it converts a downward force into a splitting force.'),
  buildQ('What simple machine does a flagpole use to raise a flag?', 'Pulley', ['Lever', 'Inclined plane', 'Wedge'], 'A flagpole uses a pulley — a rope over a wheel — to raise and lower the flag.'),
  buildQ('What simple machine is a screw?', 'An inclined plane wrapped around a cylinder', ['A type of wedge', 'A rotating lever', 'A type of pulley'], 'A screw is essentially a spiral inclined plane wrapped around a post, converting rotational force into linear force.'),
  buildQ('What is the point where a lever pivots called?', 'Fulcrum', ['Load', 'Effort', 'Axle'], 'The fulcrum is the fixed pivot point on which a lever balances or turns.'),
  buildQ('What simple machine is a doorknob?', 'Wheel and axle', ['Lever', 'Pulley', 'Wedge'], 'A doorknob is a wheel and axle — turning the knob (wheel) turns the shaft (axle) to open the door.'),
  buildQ('Which simple machine would help you move a heavy box to a higher shelf?', 'Inclined plane (ramp)', ['Wedge', 'Lever', 'Screw'], 'A ramp (inclined plane) lets you push an object up gradually, requiring less force than lifting straight up.'),
  buildQ('What simple machine is a zipper?', 'Wedge', ['Screw', 'Lever', 'Pulley'], 'A zipper uses a wedge shape to push two rows of teeth apart or pull them together.'),
  buildQ('What does a pulley do?', 'Changes the direction of a force and can reduce effort', ['Multiplies speed only', 'Creates energy', 'Increases weight'], 'A pulley redirects force — pulling down on a rope can lift a heavy load upward.'),
];

// ══════════════════════════════════════════════════════════
// GRADE 4 TOPICS
// ══════════════════════════════════════════════════════════

const ENERGY_G4 = [
  buildQ('What is energy?', 'The ability to do work or cause change', ['The weight of an object', 'The speed of an object', 'A type of matter'], 'Energy is the capacity to do work or cause changes — it comes in many forms.'),
  buildQ('Which of these is a renewable energy source?', 'Solar energy (sunlight)', ['Coal', 'Natural gas', 'Oil'], 'Solar energy comes from the sun and is renewable — it won\'t run out.'),
  buildQ('What form of energy does food contain?', 'Chemical energy', ['Kinetic energy', 'Electrical energy', 'Thermal energy'], 'Food stores chemical energy that our bodies convert to other forms to move and function.'),
  buildQ('What do we call energy that a moving object has?', 'Kinetic energy', ['Potential energy', 'Chemical energy', 'Nuclear energy'], 'Kinetic energy is the energy of motion — any moving object has kinetic energy.'),
  buildQ('What is potential energy?', 'Stored energy due to position or condition', ['Energy of motion', 'Heat energy', 'Light energy'], 'Potential energy is stored — a book on a high shelf has gravitational potential energy.'),
  buildQ('How does a solar panel make electricity?', 'By converting sunlight into electrical energy', ['By burning fuel', 'By using wind', 'By heating water'], 'Solar panels contain photovoltaic cells that convert light energy from the sun into electrical energy.'),
  buildQ('What type of energy does a battery store?', 'Chemical energy', ['Kinetic energy', 'Nuclear energy', 'Sound energy'], 'Batteries store chemical energy and convert it to electrical energy when used.'),
  buildQ('What is thermal energy?', 'Heat energy', ['Sound energy', 'Light energy', 'Chemical energy'], 'Thermal energy is the energy related to heat — the internal energy of particles moving in matter.'),
  buildQ('Which of these is NOT a renewable energy source?', 'Coal', ['Wind energy', 'Solar energy', 'Hydropower'], 'Coal is a fossil fuel — it takes millions of years to form and is not renewable.'),
  buildQ('What energy transformation happens in a light bulb?', 'Electrical energy → light and heat energy', ['Chemical energy → light', 'Mechanical energy → heat', 'Sound energy → light'], 'In a light bulb, electrical energy is converted into light energy and heat energy.'),
  buildQ('What is the law of conservation of energy?', 'Energy cannot be created or destroyed, only changed', ['Energy always increases', 'Energy always decreases', 'Energy can appear from nothing'], 'The law of conservation of energy states that energy is never created or destroyed — only converted between forms.'),
  buildQ('What energy source does a wind turbine use?', 'Wind (kinetic energy of moving air)', ['Sunlight', 'Water', 'Natural gas'], 'Wind turbines capture the kinetic energy of moving air and convert it into electrical energy.'),
  buildQ('What type of energy is sound?', 'Mechanical (wave) energy', ['Electrical energy', 'Chemical energy', 'Nuclear energy'], 'Sound is a form of mechanical energy that travels as waves through matter.'),
  buildQ('Where does most of Earth\'s energy ultimately come from?', 'The sun', ['The Earth\'s core', 'The moon', 'Outer space equally'], 'The sun is the primary source of energy for life on Earth, powering weather, photosynthesis, and more.'),
  buildQ('What energy transformation happens when you rub your hands together?', 'Kinetic energy → thermal energy (heat)', ['Potential energy → kinetic energy', 'Chemical energy → electrical energy', 'Sound energy → heat'], 'Rubbing hands together converts the kinetic energy of movement into thermal energy (heat) through friction.'),
];

const ELECTRICITY_G4 = [
  buildQ('What is electricity?', 'The flow of electric charges (electrons)', ['A type of heat', 'A form of light', 'A chemical reaction'], 'Electricity is the flow of electrons through a conductor, creating an electric current.'),
  buildQ('What is a circuit?', 'A closed path that electricity flows through', ['A type of battery', 'A light source', 'A wire connecting two batteries'], 'An electric circuit is a complete, closed loop through which electric current can flow.'),
  buildQ('What happens to a circuit if it is broken (open)?', 'The electricity stops flowing', ['It flows faster', 'It reverses direction', 'Nothing changes'], 'Electricity only flows through a complete, closed circuit — if the path is broken, current stops.'),
  buildQ('Which material is a good conductor of electricity?', 'Copper (metal)', ['Rubber', 'Plastic', 'Wood'], 'Metals like copper allow electrons to flow easily, making them good conductors.'),
  buildQ('Which material is a good insulator of electricity?', 'Rubber', ['Iron', 'Copper', 'Aluminum'], 'Rubber doesn\'t let electrons flow through it easily, making it an effective insulator.'),
  buildQ('What does a switch do in a circuit?', 'Opens or closes the circuit to control current flow', ['Makes the current stronger', 'Stores electrical energy', 'Converts AC to DC'], 'A switch opens (breaks) or closes (completes) a circuit, turning the flow of electricity on or off.'),
  buildQ('What is voltage?', 'The force that pushes electrical current through a circuit', ['The amount of current', 'The resistance of a wire', 'The brightness of a bulb'], 'Voltage (measured in volts) is the electrical pressure or force that drives current through a circuit.'),
  buildQ('What is current?', 'The flow of electric charge through a conductor', ['The voltage of a battery', 'The resistance of a material', 'The power of a motor'], 'Electric current (measured in amps) is the rate at which electric charge flows through a conductor.'),
  buildQ('What does a battery do in a circuit?', 'Provides the energy to push current around the circuit', ['Stores heat energy', 'Slows down the current', 'Changes AC to DC'], 'A battery converts chemical energy into electrical energy, acting as a "pump" to drive current.'),
  buildQ('What is a series circuit?', 'A circuit where components are connected in a single path', ['A circuit with multiple paths', 'A circuit using only batteries', 'A circuit with no switch'], 'In a series circuit, all components are connected end-to-end in one loop — if one fails, all fail.'),
  buildQ('What is a parallel circuit?', 'A circuit where components are connected on separate branches', ['A circuit in one single path', 'A circuit with only one battery', 'A circuit with no bulbs'], 'In a parallel circuit, components are on separate branches — if one fails, others keep working.'),
  buildQ('What unit measures electrical current?', 'Ampere (amp)', ['Volt', 'Watt', 'Ohm'], 'The ampere (amp) is the unit of electrical current, measuring the flow of charge.'),
  buildQ('What does resistance do in a circuit?', 'Slows or opposes the flow of electric current', ['Speeds up the current', 'Increases voltage', 'Stores energy'], 'Resistance (measured in ohms) opposes the flow of current in a circuit, converting electrical energy to heat.'),
  buildQ('What is static electricity?', 'A buildup of electric charge on the surface of an object', ['Moving current in a wire', 'The electricity in a battery', 'Electricity from solar panels'], 'Static electricity is a stationary charge buildup — like when you rub a balloon and it sticks to a wall.'),
  buildQ('Why do electrical cords have a rubber coating?', 'Rubber is an insulator and prevents electric shock', ['To make them stronger', 'To keep them cool', 'To make them cheaper'], 'The rubber insulation around wires prevents accidental contact with the live conductor, protecting against electric shock.'),
];

const FOOD_CHAINS_G4 = [
  buildQ('What is a producer in a food chain?', 'An organism that makes its own food using sunlight', ['An animal that eats plants', 'An animal that hunts others', 'An organism that breaks down dead matter'], 'Producers are plants and algae that use photosynthesis to create food from sunlight.'),
  buildQ('What is a primary consumer?', 'An animal that eats plants (herbivore)', ['An animal that eats other animals', 'A plant that makes food', 'A decomposer'], 'Primary consumers eat producers — they are herbivores at the first consumer level.'),
  buildQ('What is a secondary consumer?', 'An animal that eats primary consumers', ['A plant that makes food', 'An animal that only eats plants', 'A decomposer'], 'Secondary consumers eat primary consumers (herbivores), so they are carnivores or omnivores.'),
  buildQ('In the food chain: grass → rabbit → fox, what is the rabbit?', 'Primary consumer', ['Producer', 'Secondary consumer', 'Decomposer'], 'The rabbit eats grass (a producer), making it the primary consumer.'),
  buildQ('In the food chain: grass → rabbit → fox, what is the fox?', 'Secondary consumer', ['Primary consumer', 'Producer', 'Decomposer'], 'The fox eats the rabbit (primary consumer), making it a secondary consumer.'),
  buildQ('What is a tertiary consumer?', 'An animal at the top of the food chain that eats secondary consumers', ['A plant eater', 'A decomposer', 'Any carnivore'], 'Tertiary consumers are top predators — they eat secondary consumers and have few natural predators.'),
  buildQ('What is the source of energy for almost all food chains?', 'The sun', ['Rain', 'Soil nutrients', 'Wind'], 'The sun provides the energy that producers capture through photosynthesis, starting every food chain.'),
  buildQ('What do decomposers add back to the soil?', 'Nutrients', ['Water', 'Oxygen', 'Carbon dioxide only'], 'Decomposers break down dead organisms and return nutrients to the soil for plants to use.'),
  buildQ('What is a top predator?', 'An animal at the top of a food chain with no natural predators', ['The biggest animal', 'An animal with the most prey', 'Any carnivore'], 'Top predators (apex predators) are at the top of their food chain and are not hunted by other animals.'),
  buildQ('What would happen if all the rabbits in a grass → rabbit → fox food chain disappeared?', 'Foxes would lose their main food source and decline', ['Foxes would thrive', 'Grass would disappear', 'Nothing would change'], 'Removing a consumer from a food chain disrupts the balance — predators above lose food, producers below may overgrow.'),
];

const WATER_CYCLE_G4 = [
  buildQ('What is the water cycle?', 'The continuous movement of water through evaporation, condensation, and precipitation', ['How rivers flow to the sea', 'How plants use water', 'The water inside our bodies'], 'The water cycle is the process by which water moves between the Earth\'s surface and atmosphere continuously.'),
  buildQ('What is evaporation?', 'When liquid water turns into water vapor (gas)', ['When water falls as rain', 'When water freezes', 'When clouds form'], 'Evaporation occurs when heat causes liquid water to turn into invisible water vapor that rises into the air.'),
  buildQ('What is condensation in the water cycle?', 'When water vapor cools and turns into liquid water, forming clouds', ['When rain falls', 'When ice melts', 'When water evaporates'], 'Condensation is when water vapor in the air cools, turning back into tiny liquid droplets that form clouds.'),
  buildQ('What is precipitation?', 'Water falling from clouds as rain, snow, sleet, or hail', ['Water evaporating from the sea', 'Clouds forming in the sky', 'Water soaking into the ground'], 'Precipitation is any form of water that falls from clouds to the Earth\'s surface.'),
  buildQ('What energy source drives the water cycle?', 'The sun', ['The moon\'s gravity', 'The wind only', 'Earth\'s rotation'], 'The sun\'s heat provides the energy to evaporate water from oceans and lakes, driving the water cycle.'),
  buildQ('What is runoff in the water cycle?', 'Water that flows over the surface into rivers and streams', ['Water that evaporates', 'Underground water', 'Water in clouds'], 'Runoff is precipitation that doesn\'t soak into the ground — it flows over the surface into rivers and oceans.'),
  buildQ('What is groundwater?', 'Water stored underground in rocks and soil', ['Water in rivers', 'Water in clouds', 'Water vapor in the air'], 'Groundwater is water that soaks into the ground and collects in underground layers called aquifers.'),
  buildQ('Where does most evaporation on Earth happen?', 'The oceans', ['Lakes only', 'Rivers only', 'Ice caps'], 'Oceans cover most of the Earth\'s surface and are the largest source of evaporated water.'),
  buildQ('What is transpiration?', 'When plants release water vapor from their leaves', ['When rain soaks into soil', 'When oceans evaporate', 'When clouds form rain'], 'Transpiration is the evaporation of water from plant leaves — plants release water vapor into the air.'),
  buildQ('What is the water cycle also called?', 'The hydrological cycle', ['The weather cycle', 'The rain cycle', 'The cloud cycle'], 'The water cycle is also known as the hydrological cycle — hydro meaning water in Greek.'),
];

// ══════════════════════════════════════════════════════════
// GRADE 5 TOPICS
// ══════════════════════════════════════════════════════════

const CELLS_G5 = [
  buildQ('What is the basic unit of life?', 'The cell', ['The atom', 'The molecule', 'The organ'], 'All living things are made of cells — the cell is the smallest unit that can perform all life functions.'),
  buildQ('What does the cell membrane do?', 'Controls what enters and leaves the cell', ['Makes proteins', 'Stores DNA', 'Produces energy'], 'The cell membrane is a flexible barrier that regulates what passes into and out of the cell.'),
  buildQ('What is the function of the nucleus in a cell?', 'Controls the cell and contains DNA', ['Produces energy', 'Makes proteins for export', 'Stores water'], 'The nucleus is the cell\'s control center — it contains DNA with instructions for all cell functions.'),
  buildQ('What organelle produces energy for the cell?', 'Mitochondria', ['Nucleus', 'Ribosomes', 'Vacuole'], 'Mitochondria are the "powerhouses" of the cell — they produce ATP energy through cellular respiration.'),
  buildQ('What is the difference between plant and animal cells?', 'Plant cells have a cell wall and chloroplasts; animal cells do not', ['Animal cells have chloroplasts', 'They are identical', 'Plant cells have no nucleus'], 'Plant cells have a rigid cell wall and chloroplasts (for photosynthesis) that animal cells lack.'),
  buildQ('What do chloroplasts do in plant cells?', 'Carry out photosynthesis to make food', ['Produce energy through respiration', 'Control cell division', 'Store water'], 'Chloroplasts contain chlorophyll and use sunlight to carry out photosynthesis.'),
  buildQ('What is the cell wall made of in plant cells?', 'Cellulose', ['Protein', 'Fat', 'Starch'], 'The plant cell wall is made of cellulose, a rigid carbohydrate that gives the cell its firm shape.'),
  buildQ('What is DNA?', 'The molecule that carries genetic instructions for living organisms', ['A type of protein', 'A form of energy', 'A cellular membrane'], 'DNA (deoxyribonucleic acid) contains the genetic code — instructions for building and running an organism.'),
  buildQ('What is the function of ribosomes?', 'Build proteins following instructions from DNA', ['Produce energy', 'Digest food', 'Control cell division'], 'Ribosomes are tiny structures that read DNA instructions and assemble proteins from amino acids.'),
  buildQ('What is a tissue?', 'A group of similar cells working together', ['A single cell', 'A whole organ', 'A collection of organs'], 'Tissues are groups of similar cells that work together to perform a specific function.'),
  buildQ('What is an organ?', 'A group of tissues working together to perform a function', ['A single cell', 'A group of identical cells', 'A complete organism'], 'Organs are made of multiple tissue types working together — like the heart, which pumps blood.'),
  buildQ('What is the largest organelle in a typical animal cell?', 'Nucleus', ['Mitochondria', 'Ribosome', 'Vacuole'], 'The nucleus is usually the largest organelle in an animal cell, containing all the DNA.'),
  buildQ('What does the vacuole do in plant cells?', 'Stores water and helps maintain the cell\'s shape', ['Produces energy', 'Makes proteins', 'Controls division'], 'Plant cells have a large central vacuole that stores water and maintains pressure to keep the cell firm.'),
  buildQ('What is cell division?', 'The process by which cells reproduce to make new cells', ['When cells get smaller', 'When cells produce energy', 'When cells die'], 'Cell division (mitosis) is how organisms grow and replace old cells — one cell divides into two new ones.'),
  buildQ('Which organisms are made of just one cell?', 'Bacteria and amoeba', ['All insects', 'Mushrooms', 'Plants'], 'Single-celled (unicellular) organisms like bacteria and amoeba consist of just one cell that does everything.'),
];

const HUMAN_BODY_G5 = [
  buildQ('What is the function of the heart?', 'To pump blood around the body', ['To filter blood', 'To make blood cells', 'To digest food'], 'The heart is a muscular pump that circulates blood throughout the entire body.'),
  buildQ('What organ filters waste from the blood?', 'Kidneys', ['Liver', 'Lungs', 'Stomach'], 'The kidneys filter the blood, removing waste products and producing urine.'),
  buildQ('What do the lungs do?', 'Exchange oxygen and carbon dioxide during breathing', ['Pump blood', 'Digest food', 'Filter waste'], 'The lungs allow oxygen to enter the blood and carbon dioxide (a waste gas) to leave.'),
  buildQ('What is the function of the digestive system?', 'To break down food into nutrients the body can use', ['To pump blood', 'To filter waste from blood', 'To send nerve signals'], 'The digestive system breaks food down into small molecules that can be absorbed into the bloodstream.'),
  buildQ('What is the body\'s largest organ?', 'Skin', ['Liver', 'Brain', 'Intestine'], 'The skin is the largest organ — it covers the body, protects against infection, and regulates temperature.'),
  buildQ('What do red blood cells carry?', 'Oxygen', ['Carbon dioxide only', 'Nutrients only', 'Hormones'], 'Red blood cells contain hemoglobin, which binds to oxygen in the lungs and carries it to all body cells.'),
  buildQ('What is the function of the skeletal system?', 'To support the body, protect organs, and enable movement', ['To digest food', 'To filter blood', 'To produce hormones'], 'The skeleton provides structure, protects vital organs, and works with muscles to enable movement.'),
  buildQ('What does the nervous system do?', 'Sends electrical signals throughout the body and controls actions', ['Carries oxygen', 'Produces hormones', 'Digests food'], 'The nervous system uses electrical signals to transmit information between the brain and all body parts.'),
  buildQ('Where in the body is blood made?', 'In the bone marrow', ['In the heart', 'In the liver', 'In the kidneys'], 'Blood cells are produced in the soft tissue inside bones, called bone marrow.'),
  buildQ('What is the function of white blood cells?', 'To fight infections and disease', ['Carry oxygen', 'Clot blood', 'Carry nutrients'], 'White blood cells are the immune system\'s soldiers — they identify and destroy bacteria, viruses, and other pathogens.'),
  buildQ('What does the brain do?', 'Controls all body functions and processes information', ['Pumps blood', 'Filters waste', 'Digests food'], 'The brain is the body\'s control center — it processes information and controls all voluntary and involuntary functions.'),
  buildQ('What organ produces insulin?', 'Pancreas', ['Liver', 'Stomach', 'Kidney'], 'The pancreas produces insulin, a hormone that helps regulate blood sugar levels.'),
  buildQ('How many bones are in an adult human body?', '206', ['126', '306', '156'], 'An adult human skeleton has 206 bones. Babies are born with about 270-300, which fuse together as they grow.'),
  buildQ('What is the function of the muscular system?', 'To produce movement and maintain posture', ['To carry oxygen', 'To digest food', 'To filter blood'], 'Muscles contract and relax to produce all body movements, from walking to heartbeating.'),
  buildQ('What does the immune system do?', 'Protects the body from disease and infection', ['Pumps blood', 'Digests food', 'Controls breathing'], 'The immune system defends the body against pathogens using white blood cells, antibodies, and other defenses.'),
];

const CHEMICAL_CHANGES_G5 = [
  buildQ('What is a chemical change?', 'A change that produces a new substance with different properties', ['A change in shape only', 'A change in size', 'A change in temperature only'], 'A chemical change creates new substances — burning wood, rusting iron, and baking a cake are chemical changes.'),
  buildQ('What is a physical change?', 'A change in appearance that does not produce a new substance', ['A change that makes a new substance', 'A permanent change', 'A change caused by fire'], 'Physical changes alter the form of matter but not its chemical composition — like cutting, melting, or bending.'),
  buildQ('Which of these is a chemical change?', 'Wood burning', ['Ice melting', 'Paper being cut', 'Glass breaking'], 'Burning wood is a chemical change — it produces new substances (ash, carbon dioxide, water vapor).'),
  buildQ('Which of these is a physical change?', 'Ice melting into water', ['Iron rusting', 'Wood burning', 'Food digesting'], 'Melting ice is a physical change — the substance is still water (H₂O), just in a different state.'),
  buildQ('What is a sign that a chemical change has occurred?', 'A new substance is formed, often with gas, color change, or light', ['The object gets bigger', 'The object changes location', 'The temperature stays the same'], 'Signs of a chemical change include new substances forming, gas production, color change, light, or heat.'),
  buildQ('What is rust?', 'Iron oxide — formed when iron reacts with oxygen and water', ['A type of paint', 'Dirty water on metal', 'A physical change in iron'], 'Rust (iron oxide) forms when iron chemically reacts with oxygen and water — it is a chemical change.'),
  buildQ('What is combustion?', 'A chemical reaction where fuel reacts with oxygen to produce heat and light', ['When something melts', 'When something freezes', 'When something dissolves'], 'Combustion (burning) is a rapid chemical reaction between fuel and oxygen that releases heat and light energy.'),
  buildQ('What does a chemical formula show?', 'The types and numbers of atoms in a molecule', ['How much a substance weighs', 'How a substance changes state', 'The color of a substance'], 'A chemical formula shows which elements are in a compound and how many atoms of each are present.'),
  buildQ('What is the chemical formula for water?', 'H₂O', ['CO₂', 'NaCl', 'O₂'], 'Water is made of 2 hydrogen atoms and 1 oxygen atom — H₂O.'),
  buildQ('What is the chemical formula for carbon dioxide?', 'CO₂', ['H₂O', 'O₂', 'NaCl'], 'Carbon dioxide is made of 1 carbon atom and 2 oxygen atoms — CO₂.'),
  buildQ('Which of these is an example of a physical change?', 'Stretching a rubber band', ['Baking a cake', 'Digesting food', 'Fireworks exploding'], 'Stretching a rubber band changes its shape temporarily but produces no new substance — it\'s physical.'),
  buildQ('What happens to atoms during a chemical reaction?', 'They rearrange to form new substances', ['They are created', 'They are destroyed', 'They change size'], 'During chemical reactions, atoms rearrange and form new combinations — they are never created or destroyed.'),
];

const SPACE_G5 = [
  buildQ('What is the closest star to Earth?', 'The Sun', ['Sirius', 'Proxima Centauri', 'Betelgeuse'], 'The Sun is our nearest star — about 93 million miles (150 million km) from Earth.'),
  buildQ('How long does it take the Earth to orbit the Sun?', 'One year (365.25 days)', ['One month', 'One day', '100 years'], 'Earth completes one full orbit around the Sun every 365.25 days — which is why we have leap years.'),
  buildQ('What causes day and night on Earth?', 'The Earth\'s rotation on its axis', ['The Moon orbiting Earth', 'The Sun moving', 'Earth\'s orbit around the Sun'], 'Earth rotates on its axis once every 24 hours, causing the side facing the Sun to have day and the other side night.'),
  buildQ('What causes the seasons on Earth?', 'The tilt of the Earth\'s axis as it orbits the Sun', ['The distance from the Sun', 'The rotation speed', 'The Moon\'s position'], 'Earth\'s axis is tilted 23.5° — when a hemisphere tilts toward the Sun, it gets summer; tilted away, it\'s winter.'),
  buildQ('What is the Moon?', 'Earth\'s natural satellite that orbits our planet', ['A small planet', 'A large asteroid', 'A distant star'], 'The Moon is Earth\'s only natural satellite — it orbits our planet approximately every 27.3 days.'),
  buildQ('What are the inner planets of our solar system?', 'Mercury, Venus, Earth, and Mars', ['Jupiter, Saturn, Uranus, Neptune', 'All eight planets', 'Earth and Mars only'], 'The four inner (terrestrial) planets closest to the Sun are Mercury, Venus, Earth, and Mars.'),
  buildQ('What is the largest planet in our solar system?', 'Jupiter', ['Saturn', 'Neptune', 'Uranus'], 'Jupiter is by far the largest planet — more than twice the mass of all other planets combined.'),
  buildQ('What is a galaxy?', 'A large system of billions of stars, gas, and dust held together by gravity', ['A single solar system', 'A type of planet', 'A large cloud in space'], 'A galaxy is a massive collection of billions of stars, along with gas and dust, bound by gravity.'),
  buildQ('What galaxy do we live in?', 'The Milky Way', ['Andromeda', 'Triangulum', 'Sombrero'], 'Our solar system is located in the Milky Way galaxy, a spiral galaxy containing hundreds of billions of stars.'),
  buildQ('What is a light-year?', 'The distance light travels in one year', ['The time it takes light to travel to the Sun', 'A measurement of brightness', 'The age of a star'], 'A light-year is a unit of distance — about 9.46 trillion km — the distance light travels in one year.'),
  buildQ('What is the order of the planets from closest to farthest from the Sun?', 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune', ['Mercury, Earth, Venus, Mars...', 'Venus, Mercury, Earth, Mars...', 'Earth, Mars, Venus, Mercury...'], 'The planets in order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.'),
  buildQ('What is a comet?', 'A small icy body that develops a tail when near the Sun', ['A type of asteroid', 'A mini planet', 'A satellite of Jupiter'], 'Comets are icy bodies that orbit the Sun — when they get close to the Sun, the ice vaporizes and forms a glowing tail.'),
  buildQ('What is an asteroid?', 'A rocky object that orbits the Sun, mostly found in the asteroid belt', ['A small moon', 'A type of comet', 'A distant star'], 'Asteroids are rocky, airless bodies that orbit the Sun — most are found in the asteroid belt between Mars and Jupiter.'),
  buildQ('What force keeps planets in orbit around the Sun?', 'Gravity', ['Magnetism', 'The solar wind', 'Dark energy'], 'Gravity from the Sun pulls planets toward it, while their orbital velocity keeps them in a curved path around it.'),
  buildQ('What is the Sun made of?', 'Hot plasma — mostly hydrogen and helium', ['Rock and metal', 'Burning coal and gas', 'Compressed oxygen and nitrogen'], 'The Sun is a giant ball of plasma, primarily composed of hydrogen (73%) and helium (25%), fusing hydrogen into helium.'),
];

// ══════════════════════════════════════════════════════════
// GRADE 6 TOPICS
// ══════════════════════════════════════════════════════════

const ATOMS_G6 = [
  buildQ('What is an atom?', 'The smallest unit of an element that has the properties of that element', ['The smallest living unit', 'A type of molecule', 'A unit of energy'], 'Atoms are the basic building blocks of matter — everything is made of atoms.'),
  buildQ('What are the three main particles in an atom?', 'Protons, neutrons, and electrons', ['Atoms, molecules, and compounds', 'Positive, negative, and neutral charges', 'Ions, bonds, and charges'], 'Atoms contain protons (positive) and neutrons (neutral) in the nucleus, and electrons (negative) around it.'),
  buildQ('What charge does a proton have?', 'Positive (+)', ['Negative (−)', 'Neutral (0)', 'It varies'], 'Protons carry a positive electrical charge and are found in the nucleus of an atom.'),
  buildQ('What charge does an electron have?', 'Negative (−)', ['Positive (+)', 'Neutral (0)', 'It varies'], 'Electrons carry a negative electrical charge and orbit the nucleus of an atom.'),
  buildQ('What charge does a neutron have?', 'Neutral (no charge)', ['Positive (+)', 'Negative (−)', 'It varies'], 'Neutrons have no electrical charge — they are neutral particles found in the atomic nucleus.'),
  buildQ('What is the atomic number of an element?', 'The number of protons in its nucleus', ['The number of neutrons', 'The total number of particles', 'The mass of the atom'], 'The atomic number equals the number of protons — it uniquely identifies each element.'),
  buildQ('What is an element?', 'A pure substance made of only one type of atom', ['A mixture of substances', 'A compound of two atoms', 'A charged particle'], 'Elements are pure substances that cannot be broken down further by chemical means — like gold, oxygen, and carbon.'),
  buildQ('What is a compound?', 'A substance made of two or more different elements chemically combined', ['A mixture of elements', 'A single element only', 'A type of atom'], 'Compounds are formed when two or more different elements bond together chemically — like water (H₂O).'),
  buildQ('What is an ion?', 'An atom that has gained or lost electrons, giving it a charge', ['A type of molecule', 'A neutral atom', 'A compound'], 'Ions are atoms that have gained or lost electrons — gaining electrons makes them negative, losing makes them positive.'),
  buildQ('What is the Periodic Table?', 'A chart organizing all known elements by atomic number and properties', ['A list of all compounds', 'A table of energy values', 'A chart of molecules'], 'The Periodic Table organizes all 118+ known elements by their atomic number and groups them by similar properties.'),
  buildQ('What is an isotope?', 'An atom of the same element with a different number of neutrons', ['A different element with the same mass', 'A charged form of an element', 'A compound of similar elements'], 'Isotopes are versions of the same element with the same number of protons but different numbers of neutrons.'),
  buildQ('What holds the nucleus of an atom together?', 'The strong nuclear force', ['Gravity', 'Electrostatic attraction', 'Magnetism'], 'The strong nuclear force is one of the four fundamental forces — it holds protons and neutrons together in the nucleus.'),
  buildQ('What is a molecule?', 'Two or more atoms bonded together', ['A single atom', 'A type of element', 'A charged particle'], 'A molecule is formed when two or more atoms bond together — like O₂ (oxygen gas) or H₂O (water).'),
  buildQ('What is the most common element in the universe?', 'Hydrogen', ['Oxygen', 'Carbon', 'Helium'], 'Hydrogen is the most abundant element in the universe, making up about 75% of all matter.'),
  buildQ('What is a chemical bond?', 'A force of attraction that holds atoms together in a molecule or compound', ['The weight of an atom', 'The charge of a nucleus', 'A type of nuclear reaction'], 'Chemical bonds are attractions between atoms that hold them together to form molecules and compounds.'),
];

const ENERGY_TRANSFER_G6 = [
  buildQ('What is conduction?', 'Transfer of heat through direct contact between objects', ['Transfer of heat through waves', 'Transfer of heat through moving fluids', 'Transfer of electricity only'], 'Conduction is the transfer of thermal energy by direct contact — like heat moving through a metal spoon in hot soup.'),
  buildQ('What is convection?', 'Transfer of heat through the movement of fluids (liquids or gases)', ['Transfer through direct contact', 'Transfer through electromagnetic waves', 'Transfer through a vacuum'], 'Convection transfers heat through the movement of fluids — hot fluid rises, cooler fluid sinks, creating a cycle.'),
  buildQ('What is radiation?', 'Transfer of energy through electromagnetic waves without needing matter', ['Transfer through direct contact', 'Transfer through moving fluids', 'Transfer through sound waves'], 'Radiation transfers energy as electromagnetic waves — the Sun heats Earth through radiation across empty space.'),
  buildQ('Which type of heat transfer can occur in a vacuum?', 'Radiation', ['Conduction', 'Convection', 'All three equally'], 'Radiation is the only form of heat transfer that doesn\'t require a medium — it travels through the vacuum of space.'),
  buildQ('What is the law of conservation of energy?', 'Energy cannot be created or destroyed, only converted between forms', ['Energy always increases', 'Energy always decreases in reactions', 'Energy can appear from nothing'], 'The law of conservation of energy states that the total energy in a closed system remains constant.'),
  buildQ('What is efficiency in energy transfer?', 'The percentage of input energy usefully converted to the desired output', ['How fast energy is transferred', 'How much energy is stored', 'The temperature of the energy transfer'], 'Efficiency = (useful output energy / total input energy) × 100% — no machine is 100% efficient.'),
  buildQ('What happens to most "wasted" energy in machines?', 'It is converted to heat', ['It disappears', 'It becomes stored energy', 'It turns into light'], 'Friction and other factors convert useful energy into thermal energy (heat), which disperses into the surroundings.'),
  buildQ('What is a good conductor of heat?', 'Metal', ['Wood', 'Plastic', 'Rubber'], 'Metals have free electrons that transfer thermal energy rapidly, making them good heat conductors.'),
  buildQ('What is a thermal insulator?', 'A material that slows the transfer of heat', ['A material that speeds up heat transfer', 'A material that stores heat', 'A material that produces heat'], 'Thermal insulators (like wood, wool, and foam) have structures that slow down the movement of thermal energy.'),
  buildQ('How does a greenhouse stay warm?', 'Glass lets sunlight in but traps heat radiation inside', ['It generates its own heat', 'It reflects cold air away', 'Underground heating rises into it'], 'A greenhouse allows solar radiation in through glass, but the glass traps the longer-wavelength heat radiation inside.'),
  buildQ('What is the greenhouse effect?', 'When atmospheric gases trap heat from the Earth\'s surface', ['When plants use the Sun\'s energy', 'When ice caps reflect heat', 'When oceans absorb sunlight'], 'Greenhouse gases like CO₂ and water vapor absorb and re-emit thermal radiation, warming the Earth\'s surface.'),
  buildQ('Which form of electromagnetic radiation from the Sun heats the Earth?', 'Infrared radiation', ['Ultraviolet radiation', 'Visible light only', 'Radio waves'], 'Infrared radiation from the Sun carries most of the heat energy absorbed by the Earth\'s surface.'),
];

const GENETICS_G6 = [
  buildQ('What is genetics?', 'The study of heredity and how traits are passed from parents to offspring', ['The study of cells', 'The study of ecosystems', 'The study of evolution only'], 'Genetics is the branch of biology that studies genes, heredity, and the variation of organisms.'),
  buildQ('What is a gene?', 'A section of DNA that codes for a specific trait', ['A type of cell', 'A complete chromosome', 'A protein molecule'], 'Genes are segments of DNA that contain instructions for building proteins, which determine an organism\'s traits.'),
  buildQ('What is a chromosome?', 'A long strand of DNA containing many genes', ['A single gene', 'A type of protein', 'A cell organelle'], 'Chromosomes are structures made of tightly coiled DNA — humans have 46 chromosomes in 23 pairs.'),
  buildQ('How many chromosomes do humans have?', '46', ['23', '48', '92'], 'Humans have 46 chromosomes in every body cell, arranged in 23 pairs — one from each parent.'),
  buildQ('What is heredity?', 'The passing of traits from parents to offspring', ['The study of DNA', 'How cells divide', 'How organisms adapt'], 'Heredity is the biological process by which traits are passed from parents to their children through genes.'),
  buildQ('What is a dominant trait?', 'A trait that shows up even if only one copy of the gene is present', ['A trait that needs two copies to show', 'A trait that always skips a generation', 'The most common trait in a population'], 'Dominant traits are expressed when at least one dominant allele is present — they "dominate" over recessive traits.'),
  buildQ('What is a recessive trait?', 'A trait that only shows when two copies of the gene are present', ['A trait that shows with one copy', 'A trait that is always harmful', 'The rarest trait'], 'Recessive traits are only expressed when an organism inherits two copies of the recessive allele (one from each parent).'),
  buildQ('What is an allele?', 'A version of a gene', ['A complete chromosome', 'A type of protein', 'A cell nucleus'], 'Alleles are different versions of the same gene — for example, the gene for eye color has alleles for brown and blue.'),
  buildQ('What does DNA stand for?', 'Deoxyribonucleic acid', ['Dioxyribose nucleic acid', 'Double-helix nitrogen acid', 'Dual nitrogen active acid'], 'DNA stands for deoxyribonucleic acid — the molecule that carries genetic instructions for development and function.'),
  buildQ('What is natural selection?', 'The process where organisms better suited to their environment survive and reproduce more', ['Random mutation only', 'How organisms learn new traits', 'The aging process'], 'Natural selection is the mechanism of evolution — organisms with beneficial traits survive and pass those traits on.'),
  buildQ('What is a mutation?', 'A change in the DNA sequence of a gene', ['A change in behavior', 'When a gene is used correctly', 'A type of inheritance'], 'Mutations are changes in DNA — they can be caused by errors in copying, radiation, or chemicals, and may affect traits.'),
  buildQ('Who is considered the father of genetics?', 'Gregor Mendel', ['Charles Darwin', 'Louis Pasteur', 'James Watson'], 'Gregor Mendel, a 19th-century monk, conducted pea plant experiments that revealed the basic laws of inheritance.'),
];

const EARTH_SYSTEMS_G6 = [
  buildQ('What are Earth\'s four main systems?', 'Geosphere, hydrosphere, atmosphere, and biosphere', ['Core, mantle, crust, and surface', 'Land, water, air, and life', 'Rock, soil, water, and gas'], 'Earth\'s systems are the geosphere (rock), hydrosphere (water), atmosphere (air), and biosphere (living things).'),
  buildQ('What is the geosphere?', 'The solid rocky part of the Earth including crust and interior', ['All water on Earth', 'All air around Earth', 'All living things'], 'The geosphere includes the Earth\'s solid rock layers — from the crust to the inner core.'),
  buildQ('What is the hydrosphere?', 'All water on, in, and above the Earth', ['The layer of air', 'The rocky surface', 'All living organisms'], 'The hydrosphere includes all of Earth\'s water — oceans, rivers, lakes, groundwater, and water vapor.'),
  buildQ('What is plate tectonics?', 'The theory that Earth\'s crust is divided into moving plates', ['How volcanoes erupt', 'How earthquakes measure magnitude', 'How mountains erode'], 'Plate tectonics describes how Earth\'s lithosphere is broken into large plates that move and interact.'),
  buildQ('What causes earthquakes?', 'The movement and collision of tectonic plates', ['Volcanic eruptions always', 'Changes in weather', 'Underground water movement'], 'Most earthquakes occur when tectonic plates suddenly slip or collide, releasing seismic energy.'),
  buildQ('What is the Earth\'s inner core made of?', 'Solid iron and nickel', ['Liquid magma', 'Rock and gas', 'Compressed oxygen'], 'The inner core is a solid ball of iron and nickel, compressed by enormous pressure despite extreme heat.'),
  buildQ('What is the Earth\'s mantle?', 'The layer of hot, semi-solid rock between the crust and core', ['The outer atmosphere', 'The liquid outer core', 'The top layer of soil'], 'The mantle is Earth\'s thickest layer — it consists of hot, dense rock that can flow slowly over time.'),
  buildQ('What is erosion?', 'The process of rock and soil being worn away and carried elsewhere', ['The building up of mountains', 'When rocks form from magma', 'When soil becomes fertile'], 'Erosion is the wearing away of Earth\'s surface by water, wind, ice, or gravity and the transport of that material.'),
  buildQ('What is the rock cycle?', 'The continuous process by which rocks form, change, and reform', ['How planets form from rocks', 'The water cycle for rocks', 'How mountains are built only'], 'The rock cycle describes how igneous, sedimentary, and metamorphic rocks continuously transform from one type to another.'),
  buildQ('What are the three types of rock?', 'Igneous, sedimentary, and metamorphic', ['Hard, soft, and medium', 'Volcanic, ocean, and land rocks', 'Ancient, modern, and forming'], 'The three main rock types are igneous (from cooled magma), sedimentary (from compressed layers), and metamorphic (changed by heat/pressure).'),
  buildQ('What is the atmosphere?', 'The layer of gases surrounding the Earth', ['All water on Earth', 'The rocky Earth surface', 'All living organisms on Earth'], 'Earth\'s atmosphere is a layer of gases held by gravity, providing air to breathe and protecting life from space radiation.'),
  buildQ('What is climate change?', 'Long-term shifts in global temperatures and weather patterns', ['Short-term weather changes', 'Seasonal temperature variation', 'The natural water cycle'], 'Climate change refers to long-term shifts in global climate patterns, largely driven by human activities increasing greenhouse gases.'),
];

// ══════════════════════════════════════════════════════════
// TOPIC BANK MAP
// ══════════════════════════════════════════════════════════

const TOPIC_BANK = {
  // Grade 1
  'animals':        { questions: ANIMALS_G1, grades: [1, 2] },
  'plants':         { questions: PLANTS_G1, grades: [1, 2] },
  'weather':        { questions: WEATHER_G1, grades: [1, 2, 3] },
  'senses':         { questions: SENSES_G1, grades: [1] },

  // Grade 2
  'habitats':       { questions: HABITATS_G2, grades: [2, 3] },
  'life cycles':    { questions: LIFE_CYCLES_G2, grades: [2, 3] },
  'states of matter': { questions: STATES_OF_MATTER_G2, grades: [2, 3, 4] },
  'forces':         { questions: FORCES_G2, grades: [2, 3, 4] },

  // Grade 3
  'ecosystems':     { questions: ECOSYSTEMS_G3, grades: [3, 4, 5] },
  'adaptations':    { questions: ADAPTATIONS_G3, grades: [3, 4] },
  'simple machines': { questions: SIMPLE_MACHINES_G3, grades: [3, 4] },

  // Grade 4
  'energy':         { questions: ENERGY_G4, grades: [4, 5, 6] },
  'electricity':    { questions: ELECTRICITY_G4, grades: [4, 5, 6] },
  'food chains':    { questions: FOOD_CHAINS_G4, grades: [3, 4, 5] },
  'water cycle':    { questions: WATER_CYCLE_G4, grades: [4, 5] },

  // Grade 5
  'cells':          { questions: CELLS_G5, grades: [5, 6] },
  'human body':     { questions: HUMAN_BODY_G5, grades: [5, 6] },
  'chemical changes': { questions: CHEMICAL_CHANGES_G5, grades: [5, 6] },
  'space':          { questions: SPACE_G5, grades: [4, 5, 6] },

  // Grade 6
  'atoms':          { questions: ATOMS_G6, grades: [6] },
  'energy transfer': { questions: ENERGY_TRANSFER_G6, grades: [5, 6] },
  'genetics':       { questions: GENETICS_G6, grades: [6] },
  'earth systems':  { questions: EARTH_SYSTEMS_G6, grades: [5, 6] },
};

const GRADE_DEFAULTS_SCIENCE = {
  1: ['animals', 'plants', 'weather', 'senses'],
  2: ['habitats', 'life cycles', 'states of matter', 'forces'],
  3: ['ecosystems', 'adaptations', 'simple machines', 'food chains'],
  4: ['energy', 'electricity', 'food chains', 'water cycle'],
  5: ['cells', 'human body', 'chemical changes', 'space'],
  6: ['atoms', 'energy transfer', 'genetics', 'earth systems'],
};

function pickN(arr, n) {
  const shuffled = shuffle([...arr]);
  return shuffled.slice(0, n);
}

function generateScienceQuestions({ grade, topics, count = 5 }) {
  const topicNames = (Array.isArray(topics) && topics.length > 0)
    ? topics.map(t => t.toLowerCase())
    : GRADE_DEFAULTS_SCIENCE[grade] || GRADE_DEFAULTS_SCIENCE[3];

  // Find valid topics — either requested or grade-appropriate defaults
  const validTopics = topicNames.filter(t => TOPIC_BANK[t]);
  if (validTopics.length === 0) {
    const fallback = GRADE_DEFAULTS_SCIENCE[grade] || GRADE_DEFAULTS_SCIENCE[3];
    validTopics.push(...fallback.filter(t => TOPIC_BANK[t]));
  }

  const questions = [];
  for (let i = 0; i < count; i++) {
    const topicKey = validTopics[i % validTopics.length];
    const bank = TOPIC_BANK[topicKey].questions;
    // Pick a random unused question from this topic
    const q = bank[Math.floor(Math.random() * bank.length)];
    // Re-shuffle answers each time so correct position varies
    const options = [q.a[q.correct], ...q.a.filter((_, idx) => idx !== q.correct)];
    const shuffledOpts = shuffle(options);
    const newCorrect = shuffledOpts.indexOf(q.a[q.correct]);
    questions.push({
      q: q.q,
      a: shuffledOpts,
      correct: newCorrect,
      type: 'mcq',
      explanation: q.explanation || null,
    });
  }

  return shuffle(questions);
}

// Count total questions in the bank
function getBankStats() {
  let total = 0;
  const byTopic = {};
  for (const [topic, data] of Object.entries(TOPIC_BANK)) {
    byTopic[topic] = data.questions.length;
    total += data.questions.length;
  }
  return { total, byTopic };
}

module.exports = { generateScienceQuestions, getBankStats };
