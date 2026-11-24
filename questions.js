/* ==========================================================================
   QuizCraft - Question bank
   100 questions, each with exactly 4 options and 1 correct answer.
   `answer` is the 0-based index of the correct option in `options`.
   ========================================================================== */

const QUIZ_QUESTIONS = [
  /* ---------------- Science & Nature (1 - 25) ---------------- */
  {
    id: 1,
    category: "Science",
    question: "The driver of a vehicle shall not take U-turn...",
    options: ["In a road where there is no traffic restrictions", "In a busy road", "When there are vehicles passing through the left", ""],
    answer: 1
  },
  {
    id: 2,
    category: "Science",
    question: "This sign represents",
    options: ["Give way", "Hospital ahead", "Trafficisland ahead", "Mercury"],
    answer: 1
    
  },
  {
    id: 3,
    category: "Science",
    question: "This sign represents",
    options: ["No entry sign", "One way sign", "No Entry for cars and motor cycles sign", "Hydrogen"],
    answer: 2
  },
  {
    id: 4,
    category: "Science",
    question: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Golgi body", "Mitochondria"],
    answer: 3
  },
  {
    id: 5,
    category: "Science",
    question: "What is the hardest naturally occurring substance on Earth?",
    options: ["Diamond", "Quartz", "Steel", "Granite"],
    answer: 0
  },
  {
    id: 6,
    category: "Science",
    question: "How many bones are there in an adult human body?",
    options: ["186", "206", "226", "246"],
    answer: 1
  },
  {
    id: 7,
    category: "Science",
    question: "At sea level, at what temperature does water boil in Celsius?",
    options: ["90 degrees", "95 degrees", "100 degrees", "110 degrees"],
    answer: 2
  },
  {
    id: 8,
    category: "Science",
    question: "What is the largest organ of the human body?",
    options: ["Liver", "Brain", "Lungs", "Skin"],
    answer: 3
  },
  {
    id: 9,
    category: "Science",
    question: "Which element has the atomic number 1?",
    options: ["Hydrogen", "Helium", "Oxygen", "Carbon"],
    answer: 0
  },
  {
    id: 10,
    category: "Science",
    question: "Which vitamin is produced by human skin when exposed to sunlight?",
    options: ["Vitamin A", "Vitamin D", "Vitamin C", "Vitamin B12"],
    answer: 1
  },
  {
    id: 11,
    category: "Science",
    question: "What is the chemical formula of common table salt?",
    options: ["KCl", "CaCO3", "NaCl", "NaOH"],
    answer: 2
  },
  {
    id: 12,
    category: "Science",
    question: "Which is the largest planet in our solar system?",
    options: ["Saturn", "Neptune", "Earth", "Jupiter"],
    answer: 3
  },
  {
    id: 13,
    category: "Science",
    question: "Which organ in the human body produces insulin?",
    options: ["Pancreas", "Kidney", "Stomach", "Spleen"],
    answer: 0
  },
  {
    id: 14,
    category: "Science",
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"],
    answer: 1
  },
  {
    id: 15,
    category: "Science",
    question: "Who proposed the theory of general relativity?",
    options: ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Galileo Galilei"],
    answer: 2
  },
  {
    id: 16,
    category: "Science",
    question: "What is the pH value of pure water?",
    options: ["0", "5", "9", "7"],
    answer: 3
  },
  {
    id: 17,
    category: "Science",
    question: "Which metal is liquid at room temperature?",
    options: ["Mercury", "Lead", "Aluminium", "Tin"],
    answer: 0
  },
  {
    id: 18,
    category: "Science",
    question: "How many chambers does the human heart have?",
    options: ["Two", "Four", "Three", "Six"],
    answer: 1
  },
  {
    id: 19,
    category: "Science",
    question: "Which force keeps the planets in orbit around the Sun?",
    options: ["Magnetism", "Friction", "Gravity", "Tension"],
    answer: 2
  },
  {
    id: 20,
    category: "Science",
    question: "Which structure gives a plant cell its green colour?",
    options: ["Vacuole", "Cell wall", "Nucleus", "Chloroplast"],
    answer: 3
  },
  {
    id: 21,
    category: "Science",
    question: "A dolphin is which type of animal?",
    options: ["Mammal", "Fish", "Reptile", "Amphibian"],
    answer: 0
  },
  {
    id: 22,
    category: "Science",
    question: "What is the smallest unit of a chemical element?",
    options: ["Molecule", "Atom", "Cell", "Electron"],
    answer: 1
  },
  {
    id: 23,
    category: "Science",
    question: "Which blood type is known as the universal donor for red cells?",
    options: ["AB positive", "A negative", "O negative", "B positive"],
    answer: 2
  },
  {
    id: 24,
    category: "Science",
    question: "Roughly how fast does light travel in a vacuum?",
    options: ["300 km per second", "3,000 km per second", "30,000 km per second", "300,000 km per second"],
    answer: 3
  },
  {
    id: 25,
    category: "Science",
    question: "What is the study of fossils called?",
    options: ["Palaeontology", "Archaeology", "Geology", "Botany"],
    answer: 0
  },

  /* ---------------- History (26 - 45) ---------------- */
  {
    id: 26,
    category: "History",
    question: "In which year did the Second World War end?",
    options: ["1943", "1945", "1947", "1950"],
    answer: 1
  },
  {
    id: 27,
    category: "History",
    question: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
    answer: 2
  },
  {
    id: 28,
    category: "History",
    question: "The Great Wall is located in which country?",
    options: ["Japan", "India", "Mongolia", "China"],
    answer: 3
  },
  {
    id: 29,
    category: "History",
    question: "Which ancient civilisation built the pyramids at Giza?",
    options: ["Ancient Egypt", "Ancient Greece", "Ancient Rome", "Babylon"],
    answer: 0
  },
  {
    id: 30,
    category: "History",
    question: "Who wrote The Communist Manifesto together with Friedrich Engels?",
    options: ["Vladimir Lenin", "Karl Marx", "Joseph Stalin", "Leon Trotsky"],
    answer: 1
  },
  {
    id: 31,
    category: "History",
    question: "In which year did the Berlin Wall fall?",
    options: ["1985", "1987", "1989", "1991"],
    answer: 2
  },
  {
    id: 32,
    category: "History",
    question: "Which ship sank in 1912 during its maiden voyage?",
    options: ["Lusitania", "Britannic", "Mayflower", "Titanic"],
    answer: 3
  },
  {
    id: 33,
    category: "History",
    question: "Who was the first person to walk on the Moon?",
    options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"],
    answer: 0
  },
  {
    id: 34,
    category: "History",
    question: "The Renaissance began in which country?",
    options: ["France", "Italy", "England", "Spain"],
    answer: 1
  },
  {
    id: 35,
    category: "History",
    question: "Julius Caesar was a leader of which empire?",
    options: ["Ottoman", "Persian", "Roman", "Byzantine"],
    answer: 2
  },
  {
    id: 36,
    category: "History",
    question: "In which year did India gain independence from British rule?",
    options: ["1930", "1942", "1945", "1947"],
    answer: 3
  },
  {
    id: 37,
    category: "History",
    question: "Who led the 1492 expedition that reached the Americas for Spain?",
    options: ["Christopher Columbus", "Ferdinand Magellan", "Vasco da Gama", "Amerigo Vespucci"],
    answer: 0
  },
  {
    id: 38,
    category: "History",
    question: "In which year did the French Revolution begin?",
    options: ["1776", "1789", "1804", "1815"],
    answer: 1
  },
  {
    id: 39,
    category: "History",
    question: "Which British queen reigned for 63 years in the 19th century?",
    options: ["Elizabeth I", "Anne", "Victoria", "Mary II"],
    answer: 2
  },
  {
    id: 40,
    category: "History",
    question: "Who led India's non-violent independence movement?",
    options: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Bhagat Singh", "Mahatma Gandhi"],
    answer: 3
  },
  {
    id: 41,
    category: "History",
    question: "In which year did the First World War begin?",
    options: ["1914", "1916", "1918", "1920"],
    answer: 0
  },
  {
    id: 42,
    category: "History",
    question: "Which city was divided by a wall from 1961 to 1989?",
    options: ["Vienna", "Berlin", "Prague", "Warsaw"],
    answer: 1
  },
  {
    id: 43,
    category: "History",
    question: "Who was the first emperor of a unified China?",
    options: ["Kublai Khan", "Sun Yat-sen", "Qin Shi Huang", "Emperor Wu"],
    answer: 2
  },
  {
    id: 44,
    category: "History",
    question: "In which year was the Magna Carta sealed?",
    options: ["1066", "1189", "1305", "1215"],
    answer: 3
  },
  {
    id: 45,
    category: "History",
    question: "Which country was the first to grant women the right to vote nationally, in 1893?",
    options: ["New Zealand", "Australia", "Finland", "Norway"],
    answer: 0
  },

  /* ---------------- Geography (46 - 65) ---------------- */
  {
    id: 46,
    category: "Geography",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Pacific", "Indian", "Arctic"],
    answer: 1
  },
  {
    id: 47,
    category: "Geography",
    question: "What is the capital city of Japan?",
    options: ["Osaka", "Kyoto", "Tokyo", "Nagoya"],
    answer: 2
  },
  {
    id: 48,
    category: "Geography",
    question: "Which is the longest river in the world?",
    options: ["Amazon", "Yangtze", "Mississippi", "Nile"],
    answer: 3
  },
  {
    id: 49,
    category: "Geography",
    question: "Which is the largest hot desert in the world?",
    options: ["Sahara", "Gobi", "Kalahari", "Arabian"],
    answer: 0
  },
  {
    id: 50,
    category: "Geography",
    question: "Mount Everest lies in which mountain range?",
    options: ["Andes", "Himalayas", "Alps", "Rockies"],
    answer: 1
  },
  {
    id: 51,
    category: "Geography",
    question: "The Amazon rainforest lies mostly in which country?",
    options: ["Peru", "Colombia", "Brazil", "Venezuela"],
    answer: 2
  },
  {
    id: 52,
    category: "Geography",
    question: "Which is the smallest country in the world by area?",
    options: ["Monaco", "Nauru", "San Marino", "Vatican City"],
    answer: 3
  },
  {
    id: 53,
    category: "Geography",
    question: "What is the capital city of Australia?",
    options: ["Canberra", "Sydney", "Melbourne", "Perth"],
    answer: 0
  },
  {
    id: 54,
    category: "Geography",
    question: "Which country is called the Land of the Rising Sun?",
    options: ["China", "Japan", "Thailand", "South Korea"],
    answer: 1
  },
  {
    id: 55,
    category: "Geography",
    question: "Which is the longest continental mountain range in the world?",
    options: ["Himalayas", "Rockies", "Andes", "Alps"],
    answer: 2
  },
  {
    id: 56,
    category: "Geography",
    question: "Which sea lies between Europe and Africa?",
    options: ["Red Sea", "Black Sea", "Caspian Sea", "Mediterranean Sea"],
    answer: 3
  },
  {
    id: 57,
    category: "Geography",
    question: "Which country has the largest land area in the world?",
    options: ["Russia", "Canada", "China", "United States"],
    answer: 0
  },
  {
    id: 58,
    category: "Geography",
    question: "What is the capital city of Canada?",
    options: ["Toronto", "Ottawa", "Vancouver", "Montreal"],
    answer: 1
  },
  {
    id: 59,
    category: "Geography",
    question: "Which river flows through Paris?",
    options: ["Thames", "Rhine", "Seine", "Loire"],
    answer: 2
  },
  {
    id: 60,
    category: "Geography",
    question: "Which strait separates Asia from North America?",
    options: ["Strait of Gibraltar", "Strait of Malacca", "Strait of Hormuz", "Bering Strait"],
    answer: 3
  },
  {
    id: 61,
    category: "Geography",
    question: "Which lake is the largest freshwater lake in the world by surface area?",
    options: ["Lake Superior", "Lake Victoria", "Lake Baikal", "Lake Michigan"],
    answer: 0
  },
  {
    id: 62,
    category: "Geography",
    question: "What is the capital city of Brazil?",
    options: ["Rio de Janeiro", "Brasilia", "Sao Paulo", "Salvador"],
    answer: 1
  },
  {
    id: 63,
    category: "Geography",
    question: "The Great Barrier Reef lies off the coast of which country?",
    options: ["Indonesia", "Philippines", "Australia", "Fiji"],
    answer: 2
  },
  {
    id: 64,
    category: "Geography",
    question: "Which is the highest uninterrupted waterfall in the world?",
    options: ["Niagara Falls", "Victoria Falls", "Iguazu Falls", "Angel Falls"],
    answer: 3
  },
  {
    id: 65,
    category: "Geography",
    question: "Which European country is shaped like a boot?",
    options: ["Italy", "Greece", "Portugal", "Croatia"],
    answer: 0
  },

  /* ---------------- Technology (66 - 80) ---------------- */
  {
    id: 66,
    category: "Technology",
    question: "What does CPU stand for?",
    options: ["Central Print Unit", "Central Processing Unit", "Computer Power Unit", "Core Program Utility"],
    answer: 1
  },
  {
    id: 67,
    category: "Technology",
    question: "What does HTML stand for?",
    options: ["Hyperlink Text Machine Language", "Home Tool Markup Language", "HyperText Markup Language", "High Text Meta Language"],
    answer: 2
  },
  {
    id: 68,
    category: "Technology",
    question: "Which company developed the Windows operating system?",
    options: ["Apple", "IBM", "Google", "Microsoft"],
    answer: 3
  },
  {
    id: 69,
    category: "Technology",
    question: "What does WWW stand for?",
    options: ["World Wide Web", "Wide Web World", "Web Wide World", "World Web Wire"],
    answer: 0
  },
  {
    id: 70,
    category: "Technology",
    question: "Which language is used to style web pages?",
    options: ["HTML", "CSS", "SQL", "Python"],
    answer: 1
  },
  {
    id: 71,
    category: "Technology",
    question: "Which of these is a programming language, not a markup language?",
    options: ["CSS", "HTML", "XML", "JavaScript"],
    answer: 3
  },
  {
    id: 72,
    category: "Technology",
    question: "How many bits are there in one byte?",
    options: ["4", "16", "8", "32"],
    answer: 2
  },
  {
    id: 73,
    category: "Technology",
    question: "What does USB stand for?",
    options: ["Unified Serial Board", "Universal System Bus", "User Serial Bridge", "Universal Serial Bus"],
    answer: 3
  },
  {
    id: 74,
    category: "Technology",
    question: "Who co-founded Apple with Steve Jobs?",
    options: ["Steve Wozniak", "Bill Gates", "Paul Allen", "Jack Dorsey"],
    answer: 0
  },
  {
    id: 75,
    category: "Technology",
    question: "Which protocol adds encryption to web traffic?",
    options: ["FTP", "HTTPS", "HTTP", "SMTP"],
    answer: 1
  },
  {
    id: 76,
    category: "Technology",
    question: "In binary, what decimal value does 1010 represent?",
    options: ["8", "12", "10", "5"],
    answer: 2
  },
  {
    id: 77,
    category: "Technology",
    question: "What does RAM stand for?",
    options: ["Rapid Access Module", "Read Access Memory", "Runtime Active Memory", "Random Access Memory"],
    answer: 3
  },
  {
    id: 78,
    category: "Technology",
    question: "Which company leads development of the Android operating system?",
    options: ["Google", "Samsung", "Nokia", "Sony"],
    answer: 0
  },
  {
    id: 79,
    category: "Technology",
    question: "In which year was the first iPhone released?",
    options: ["2005", "2007", "2009", "2011"],
    answer: 1
  },
  {
    id: 80,
    category: "Technology",
    question: "What does DNS stand for in networking?",
    options: ["Data Network Service", "Digital Node System", "Domain Name System", "Direct Name Server"],
    answer: 2
  },

  /* ---------------- General Knowledge (81 - 100) ---------------- */
  {
    id: 81,
    category: "General Knowledge",
    question: "How many players from one team are on a football (soccer) pitch?",
    options: ["11", "10", "9", "12"],
    answer: 0
  },
  {
    id: 82,
    category: "General Knowledge",
    question: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Vincent van Gogh"],
    answer: 1
  },
  {
    id: 83,
    category: "General Knowledge",
    question: "How many strings does a standard guitar have?",
    options: ["4", "8", "6", "12"],
    answer: 2
  },
  {
    id: 84,
    category: "General Knowledge",
    question: "Which sport is played at the Wimbledon championships?",
    options: ["Cricket", "Badminton", "Squash", "Tennis"],
    answer: 3
  },
  {
    id: 85,
    category: "General Knowledge",
    question: "Who wrote the play Romeo and Juliet?",
    options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "John Keats"],
    answer: 0
  },
  {
    id: 86,
    category: "General Knowledge",
    question: "How many colours are traditionally said to be in a rainbow?",
    options: ["5", "7", "6", "9"],
    answer: 1
  },
  {
    id: 87,
    category: "General Knowledge",
    question: "Which is the largest mammal on Earth?",
    options: ["African elephant", "Giraffe", "Blue whale", "Hippopotamus"],
    answer: 2
  },
  {
    id: 88,
    category: "General Knowledge",
    question: "How many days are there in a leap year?",
    options: ["364", "365", "367", "366"],
    answer: 3
  },
  {
    id: 89,
    category: "General Knowledge",
    question: "What is the currency of Japan?",
    options: ["Yen", "Won", "Yuan", "Ringgit"],
    answer: 0
  },
  {
    id: 90,
    category: "General Knowledge",
    question: "Which sport is played with a shuttlecock?",
    options: ["Table tennis", "Badminton", "Lawn tennis", "Squash"],
    answer: 1
  },
  {
    id: 91,
    category: "General Knowledge",
    question: "Who composed the set of violin concertos known as The Four Seasons?",
    options: ["Mozart", "Bach", "Vivaldi", "Beethoven"],
    answer: 2
  },
  {
    id: 92,
    category: "General Knowledge",
    question: "How many sides does a hexagon have?",
    options: ["Five", "Seven", "Eight", "Six"],
    answer: 3
  },
  {
    id: 93,
    category: "General Knowledge",
    question: "The pommel horse is an apparatus in which sport?",
    options: ["Gymnastics", "Equestrian", "Athletics", "Wrestling"],
    answer: 0
  },
  {
    id: 94,
    category: "General Knowledge",
    question: "Which instrument has 88 keys in its standard form?",
    options: ["Organ", "Piano", "Accordion", "Harpsichord"],
    answer: 1
  },
  {
    id: 95,
    category: "General Knowledge",
    question: "Which sport is regarded as Japan's traditional national sport?",
    options: ["Judo", "Karate", "Sumo wrestling", "Kendo"],
    answer: 2
  },
  {
    id: 96,
    category: "General Knowledge",
    question: "How many continents are there on Earth?",
    options: ["5", "6", "8", "7"],
    answer: 3
  },
  {
    id: 97,
    category: "General Knowledge",
    question: "Which painter famously cut off part of his own ear?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dali"],
    answer: 0
  },
  {
    id: 98,
    category: "General Knowledge",
    question: "In chess, which piece moves only diagonally?",
    options: ["Rook", "Bishop", "Knight", "King"],
    answer: 1
  },
  {
    id: 99,
    category: "General Knowledge",
    question: "How many rings are there on the Olympic flag?",
    options: ["4", "6", "5", "7"],
    answer: 2
  },
  {
    id: 100,
    category: "General Knowledge",
    question: "What is the smallest prime number?",
    options: ["0", "1", "3", "2"],
    answer: 3
  }
];
