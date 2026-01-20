import lionImage from '../assets/lion.jpg';
import eagleImage from '../assets/BaldEagle.jpg';
import turtleImage from '../assets/SeaTurtle.jpg';
import elephantImage from '../assets/AsianElephant.jpg';
import giraffeImage from '../assets/Giraffe.jpg';
import komodoImage from '../assets/KomodoDragon.jpg';
import peacockImage from '../assets/Peacock.jpg';
import polarBearImage from '../assets/Polarbear.webp';
import cobraImage from '../assets/Cobra.jpg';
import flamingoImage from '../assets/Flamingo.jpg';
import vaquitaImage from '../assets/Vaquita.jpg';
import dugongImage from '../assets/Dugong.avif';
//import salmonImage from '../assets/Salmon.jpg'; // Example for fish
//import frogImage from '../assets/Frog.jpg'; // Example for amphibian
//import spiderImage from '../assets/Spider.jpg'; // Example for invertebrate
//import goldfishImage from '../assets/Goldfish.jpg'; // Example for fish

export const animals = [
  {
    id: 1,
    name: "African Lion",
    category: "mammals",
    image: lionImage,
    facts: "King of the savanna",
    habitat: "African grasslands",
    diet: "Carnivore",
    description: "African lions are social cats that live in structured groups called prides, typically consisting of 15–20 members. They are apex predators of the savanna, with males protecting the territory while females do most of the hunting. Lions communicate through roars, scent marking, and body language. Their cooperative hunting strategies and strong social bonds make them unique among big cats. They are also known for their majestic manes and iconic presence on the African plains."
  },
  {
    id: 2,
    name: "Bald Eagle",
    category: "birds",
    image: eagleImage,
    facts: "National symbol",
    habitat: "North America",
    diet: "Carnivore",
    description: "Bald eagles are powerful birds of prey, easily recognized by their white heads and striking yellow beaks. They have a wingspan of up to 7 feet, allowing them to soar effortlessly over rivers and forests in search of fish, their primary diet. Bald eagles build massive nests called eyries in tall trees or cliffs, which can be used for multiple years. They are symbols of freedom and strength in North America and demonstrate remarkable hunting skill, vision, and aerial agility."
  },
  {
    id: 3,
    name: "Green Sea Turtle",
    category: "reptiles",
    image: turtleImage,
    facts: "Ancient mariners",
    habitat: "Oceans worldwide",
    diet: "Herbivore",
    description: "Green sea turtles are gentle marine reptiles that have existed for millions of years, often called ancient mariners of the oceans. They feed mainly on seagrasses and algae, helping maintain healthy marine ecosystems. Green sea turtles are capable of long migrations between feeding and nesting sites, sometimes traveling thousands of miles. They can live over 100 years, and females return to the same beaches where they were born to lay eggs. Their slow movements on land and graceful swimming underwater make them fascinating creatures to study."
  },
  {
    id: 4,
    name: "Asian Elephant",
    category: "mammals",
    image: elephantImage,
    facts: "Largest land animal in Asia",
    habitat: "Forests and grasslands",
    diet: "Herbivore",
    description: "Asian elephants are highly intelligent and socially complex animals that live in herds led by matriarchs. They exhibit remarkable memory, problem-solving abilities, and empathy. These elephants feed on a variety of vegetation, including grasses, leaves, and bark, and play an essential role in shaping their habitats. Communication is achieved through vocalizations, body language, and seismic signals. Asian elephants form strong bonds within family groups and demonstrate behaviors such as caring for young and mourning deceased herd members."
  },
  {
    id: 5,
    name: "Giraffe",
    category: "mammals",
    image: giraffeImage,
    facts: "Tallest land animal",
    habitat: "African savannas",
    diet: "Herbivore",
    description: "Giraffes are the tallest land animals, with long necks that allow them to browse leaves high in acacia trees. Their height gives them excellent vision to spot predators from a distance. Giraffes live in loose social groups called towers and communicate using subtle gestures, infrasonic sounds, and even snorts. Their unique coat patterns provide camouflage in the dappled sunlight of the savanna. Despite their size, they can run up to 35 miles per hour over short distances, and calves are known to take their first steps shortly after birth."
  },
  {
    id: 6,
    name: "Komodo Dragon",
    category: "reptiles",
    image: komodoImage,
    facts: "Largest living lizard",
    habitat: "Indonesian islands",
    diet: "Carnivore",
    description: "Komodo dragons are the largest lizards in the world, reaching lengths of up to 10 feet. These formidable predators rely on their keen sense of smell to detect prey from miles away and possess a venomous bite that weakens their victims. They hunt deer, pigs, and even water buffalo, sometimes ambushing their prey with patience and precision. Komodo dragons are solitary by nature but will come together during feeding or mating periods. They are also excellent swimmers, able to move between islands in search of food or mates."
  },
  {
    id: 7,
    name: "Peacock",
    category: "birds",
    image: peacockImage,
    facts: "Famous for colorful feathers",
    habitat: "South Asia",
    diet: "Omnivore",
    description: "Peacocks are renowned for the male's extravagant tail feathers, which they fan out during courtship displays to attract females. These birds are omnivores, feeding on insects, plants, and small creatures. Peacocks are also skilled at detecting predators thanks to their sharp eyesight and loud alarm calls. Their iridescent feathers are the result of microscopic structures that reflect light, producing brilliant colors. They are often found in forests and near human settlements, where they have adapted well to living close to people."
  },
  {
    id: 8,
    name: "Polar Bear",
    category: "mammals",
    image: polarBearImage,
    facts: "Largest carnivorous bear",
    habitat: "Arctic regions",
    diet: "Carnivore",
    description: "Polar bears are the largest land carnivores, perfectly adapted to life in the extreme cold of the Arctic. Their thick fur and fat layers provide insulation, while their large paws enable swimming across icy waters in search of seals. Polar bears are solitary hunters but may congregate at abundant food sources. They rely heavily on sea ice for hunting, making them vulnerable to climate change. These intelligent predators exhibit remarkable endurance, stamina, and problem-solving skills to survive in one of the harshest environments on Earth."
  },
  {
    id: 9,
    name: "Cobra",
    category: "reptiles",
    image: cobraImage,
    facts: "Iconic hooded snake",
    habitat: "Forests and plains",
    diet: "Carnivore",
    description: "Cobras are highly venomous snakes known for their iconic hood, which they flare when threatened to appear larger and ward off predators. They feed on small mammals, birds, and other reptiles, using venom to immobilize prey quickly. Cobras are skilled hunters with acute senses and exhibit remarkable defensive behaviors, including hood displays and hissing. Some species can spit venom at threats to protect themselves, making them one of the most fascinating and feared reptiles in their habitats."
  },
  {
    id: 10,
    name: "Flamingo",
    category: "birds",
    image: flamingoImage,
    facts: "Pink from diet",
    habitat: "Lakes and lagoons",
    diet: "Omnivore",
    description: "Flamingos are elegant wading birds known for their vibrant pink coloration, which comes from carotenoid pigments in the algae and shrimp they eat. They live in large colonies, often numbering in the thousands, and build mud nests for raising chicks. Flamingos feed by stirring up shallow water with their feet and filtering food with their specialized beaks. Their long legs and necks allow them to forage in deep waters, and their synchronized group behaviors make for a spectacular natural display. They are social, vocal, and fascinating creatures with complex mating and feeding rituals."
  },
  {
    id: 11,
    name: "Vaquita",
    category: "mammals",
    image: vaquitaImage,
    facts: "Most endangered marine mammal",
    habitat: "Sea of Cortez, Mexico",
    diet: "Carnivore",
    description: "The vaquita is a small, critically endangered species of porpoise found only in the northern part of the Gulf of California, Mexico. With fewer than 10 individuals remaining in the wild, it is considered the most endangered marine mammal on Earth. Vaquitas are elusive creatures, rarely seen, and they primarily feed on small fish, crustaceans, and squid. The biggest threat to their survival is entanglement in"
  },
{
  
id: 12,
name: "Dugong",
category: "mammals",
image: dugongImage,
facts: "Seagrass-eating sea cow",
habitat: "Indo-Pacific coastal waters",
diet: "Herbivore",
description: "The dugong is a marine mammal closely related to the manatee, often called the 'sea cow.' Dugongs primarily inhabit shallow coastal waters of the Indo-Pacific region, where they feed on seagrasses. They play an important role in maintaining healthy seagrass ecosystems. Dugongs are vulnerable due to habitat loss, boat strikes, and entanglement in fishing nets. Conservation efforts focus on protecting seagrass habitats and reducing human impact to help increase their population."
}
// Additional examples for Amphibians, Fish, and Invertebrates
/*{
id: 13,
name: "Poison Dart Frog",
category: "amphibians",
image: frogImage,
facts: "Brightly colored",
habitat: "Central and South American rainforests",
diet: "Insectivore",
description: "Poison dart frogs are small, brightly colored amphibians found in tropical rainforests. Their vivid colors serve as a warning to predators of their toxic skin. They feed mainly on insects and other small invertebrates. These frogs lay eggs in moist environments, and their tadpoles develop in water before transforming into adults."
},
{
id: 14,
name: "Tree Frog",
category: "amphibians",
image: frogImage,
facts: "Arboreal jumper",
habitat: "Tropical forests",
diet: "Insectivore",
description: "Tree frogs are small amphibians adapted for life in trees, with sticky pads on their feet for climbing. They feed on insects and other small arthropods. Tree frogs reproduce in water or on leaves above water, where their eggs hatch into tadpoles before maturing into adults."
},
{
id: 15,
name: "Salmon",
category: "fish",
image: salmonImage,
facts: "Migratory fish",
habitat: "Freshwater rivers and oceans",
diet: "Omnivore",
description: "Salmon are migratory fish that hatch in freshwater rivers and later migrate to the ocean. They return to their birth rivers to spawn. Salmon are key species in aquatic ecosystems, providing food for many predators and humans alike."
},
{
id: 16,
name: "Goldfish",
category: "fish",
image: goldfishImage,
facts: "Domesticated fish",
habitat: "Freshwater ponds and aquariums",
diet: "Omnivore",
description: "Goldfish are freshwater fish commonly kept as pets in aquariums and ponds. They are social animals that feed on plants, insects, and prepared fish foods. Goldfish can live for several years with proper care."
},
{
id: 17,
name: "Garden Spider",
category: "invertebrates",
image: spiderImage,
facts: "Web builder",
habitat: "Gardens and forests",
diet: "Carnivore",
description: "Garden spiders are invertebrates known for spinning intricate webs to catch insects. They play an important role in controlling pest populations. These spiders have eight legs and multiple eyes, characteristic of arachnids."
},
{
id: 18,
name: "Octopus",
category: "invertebrates",
image: spiderImage, // Use octopus image if available
facts: "Highly intelligent",
habitat: "Oceans worldwide",
diet: "Carnivore",
description: "Octopuses are intelligent invertebrates with soft bodies, eight arms, and the ability to change color and texture for camouflage. They feed on crustaceans and mollusks and are known for problem-solving and escaping predators."
}*/
];