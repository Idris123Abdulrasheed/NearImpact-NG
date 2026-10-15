// Pure mock data in here; schema's documented below, full field
// list is in the DEVELOPERS NOTE at the bottom if you need more detail.


// ① PROJECT SCHEMA:
// Every object in PROJECTS below must match this shape 

// ② PROJECT DATA:
export const PROJECTS = [
  {
    id: "p001",
    name: "Urban Tree Planting",
    orgName: "Green Ondo Network",
    state: "Ondo",
    lga: "Akure South",
    lat: 7.2571,
    lng: 5.2058,
    types: ["volunteer"],
    sdgs: [13, 15, 11],
    volunteers: 142,
    benefits: "Certificate of participation",
    benefitTags: ["certificate"],
    image: "/projects/tree-planting.png",
    description: "Community tree-planting drives across Akure to restore green cover.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p002",
    name: "Solar Micro-Grid for Rural Schools",
    orgName: "SolarAfrica Initiative",
    state: "Ondo",
    lga: "Owo",
    lat: 7.1944,
    lng: 5.5833,
    types: ["project", "internship"],
    sdgs: [7, 4, 1],
    volunteers: 38,
    benefits: "Technical mentorship + stipend",
    benefitTags: ["mentorship", "stipend"],
    image: "/projects/solar-grid.jpeg",
    description: "Installing solar micro-grids to power rural school classrooms.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p003",
    name: "Ocean Plastic Cleanup Drive",
    orgName: "Clean Gutters Nigeria",
    state: "Ondo",
    lga: "Akure South",
    lat: 7.2500,
    lng: 5.1950,
    types: ["volunteer"],
    sdgs: [14, 12, 13],
    volunteers: 289,
    benefits: "Free branded gear",
    benefitTags: ["goods"],
    image: "/projects/ocean-cleanup.png",
    description: "Coastal and waterway cleanup exercises near FUTA South.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p004",
    name: "Youth Climate Advocacy Training",
    orgName: "African Climate Foundation",
    state: "Ondo",
    lga: "Akure South",
    lat: 7.2650,
    lng: 5.2100,
    types: ["training"],
    sdgs: [13, 4, 16],
    volunteers: 67,
    benefits: "Certification + networking",
    benefitTags: ["certificate", "mentorship"],
    image: "/projects/climate-training.png",
    description: "Advocacy and public-speaking training for young climate leaders.",
    isDefaultFeatured: false,
    requiresAuth: true
  },
  {
    id: "p005",
    name: "Community Food Garden Network",
    orgName: "Urban Food Co-op Ondo",
    state: "Ondo",
    lga: "Owo",
    lat: 7.2000,
    lng: 5.5900,
    types: ["volunteer"],
    sdgs: [2, 3, 11],
    volunteers: 204,
    benefits: "Take-home produce",
    benefitTags: ["goods"],
    image: "/projects/community-garden.jpeg",
    isDefaultFeatured: false,
    requiresAuth: true
  },
  {
    id: "p006",
    name: "Women in Clean Energy",
    orgName: "PowerHer Foundation",
    state: "Ondo",
    lga: "Akure North",
    lat: 7.3200,
    lng: 5.2300,
    types: ["fellowship"],
    sdgs: [5, 7, 8],
    volunteers: 91,
    benefits: "12-month paid fellowship",
    benefitTags: ["stipend", "employment"],
    image: "/projects/clean-energy.jpeg",
    description: "Fellowship placing women in clean-energy technical roles.",
    isDefaultFeatured: false,
    requiresAuth: true
  },
  {
    id: "p007",
    name: "Lagos Lagoon Restoration Project",
    orgName: "Blue Water Collective",
    state: "Lagos",
    lga: "Eti-Osa",
    lat: 6.4500,
    lng: 3.4700,
    types: ["volunteer", "internship"],
    sdgs: [14, 15, 6],
    volunteers: 312,
    benefits: "Transport stipend",
    benefitTags: ["stipend"],
    image: "/projects/lagos-lagoon.jpeg",
    description: "Mangrove replanting and water-quality monitoring in the lagoon.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p008",
    name: "Tech for Good Internship",
    orgName: "Impact Builders Lab",
    state: "Lagos",
    lga: "Yaba",
    lat: 6.5095,
    lng: 3.3711,
    types: ["internship"],
    sdgs: [8, 9, 17],
    volunteers: 54,
    benefits: "₦120k/month stipend",
    benefitTags: ["stipend"],
    image: "/projects/tech-intenship.jpeg",
    description: "Building digital tools for NGOs and social enterprises.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p009",
    name: "Abuja Clean Water Initiative",
    orgName: "Clean Water Collective",
    state: "FCT",
    lga: "Municipal Area Council",
    lat: 9.0765,
    lng: 7.3986,
    types: ["volunteer", "grant"],
    sdgs: [3, 6, 12],
    volunteers: 178,
    benefits: "Grant funding available",
    benefitTags: ["grant"],
    image: "/projects/abuja-water.jpeg",
    description: "Borehole installation and water-safety education in Abuja communities.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p010",
    name: "Kano Youth Solar Jobs",
    orgName: "SolarAfrica Initiative",
    state: "Kano",
    lga: "Nassarawa",
    lat: 12.0022,
    lng: 8.5920,
    types: ["job"],
    sdgs: [7, 8, 1],
    volunteers: 22,
    benefits: "Full-time employment",
    benefitTags: ["employment"],
    image: "/projects/kano-solar.jpeg",
    description: "Solar panel installation and maintenance jobs for local youth.",
    isDefaultFeatured: false,
    requiresAuth: true
  },
  {
    id: "p011",
    name: "Rivers State Mangrove Watch",
    orgName: "Green Futures Africa",
    state: "Rivers",
    lga: "Port Harcourt",
    lat: 4.8156,
    lng: 7.0498,
    types: ["volunteer"],
    sdgs: [13, 14, 15],
    volunteers: 96,
    benefits: "Field gear provided",
    benefitTags: ["goods"],
    image: "/projects/rivers-mangrove.jpeg",
    description: "Monitoring and replanting mangrove ecosystems along the Niger Delta.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p012",
    name: "Enugu Girls in STEM Fellowship",
    orgName: "Youth SDG Hub",
    state: "Enugu",
    lga: "Enugu East",
    lat: 6.4413,
    lng: 7.4986,
    types: ["fellowship"],
    sdgs: [4, 5, 9],
    volunteers: 41,
    benefits: "Laptop + mentorship",
    benefitTags: ["goods", "mentorship"],
    image: "/projects/clean-energy.jpeg",
    description: "STEM mentorship fellowship for secondary school girls.",
    isDefaultFeatured: false,
    requiresAuth: true
  },
    {
    id: "p013", 
    name: "Career Talk: Kogi Students", 
    orgName: "NearImpact Nigeria",
    state: "Kogi", 
    lga: "Okehi", 
    lat: 7.5971166, 
    lng: 6.1587054,
    types: ["training"], 
    sdgs: [4, 8, 17], 
    volunteers: 12,
    benefits: "Free to attend + career guidance", 
    benefitTags: ["mentorship"],
    image: "/projects/career-talk.png",
    description: "A career talk for students around Ihima, with group of scholars sharing real career paths and practical next steps.",
    isDefaultFeatured: true, 
    requiresAuth: true
  },
  {
    id: "p014", 
    name: "Lokoja Confluence Cleanup", 
    orgName: "Confluence Clean Rivers",
    state: "Kogi", 
    lga: "Lokoja", 
    lat: 7.7969, 
    lng: 6.7433,
    types: ["volunteer"], 
    sdgs: [6, 14, 11], 
    volunteers: 64,
    benefits: "Free branded gear", 
    benefitTags: ["goods"],
    image: "/projects/confluence-cleanup.png",
    description: "Riverbank and waterway cleanups where the Niger and Benue meet.",
    isDefaultFeatured: false, 
    requiresAuth: true
  },
  {
    id: "p015", 
    name: "Kogi Youth Tree Planting", 
    orgName: "Kogi Green Volunteers",
    state: "Kogi", 
    lga: "Okene", 
    lat: 7.5517, 
    lng: 6.2364,
    types: ["volunteer"], 
    sdgs: [13, 15], 
    volunteers: 87,
    benefits: "Certificate of participation", 
    benefitTags: ["certificate"],
    image: "/projects/kogi-tree-planting.png",
    description: "Community tree-planting drives to restore green cover around Okene.",
    isDefaultFeatured: false, 
    requiresAuth: true
  },
  {
    id: "p016", 
    name: "Rural School Digital Skills", 
    orgName: "Kogi Digital Skills Hub",
    state: "Kogi", 
    lga: "Ajaokuta", 
    lat: 7.5536, 
    lng: 6.6567,
    types: ["training"], 
    sdgs: [4, 9], 
    volunteers: 32,
    benefits: "Certification", 
    benefitTags: ["certificate"],
    image: "/projects/kogi-digital-training.png",
    description: "Basic computer and digital skills training for rural secondary school students.",
    isDefaultFeatured: false, 
    requiresAuth: true
  },
  {
    id: "p017", 
    name: "Girls Mentorship Circle", 
    orgName: "Dekina Girls Network",
    state: "Kogi", 
    lga: "Dekina", 
    lat: 7.69, 
    lng: 7.03,
    types: ["volunteer"], 
    sdgs: [5, 4], 
    volunteers: 41,
    benefits: "Mentorship", 
    benefitTags: ["mentorship"],
    image: "/projects/dekina-girls-mentorship.jpeg",
    description: "Monthly mentorship sessions connecting teenage girls with women professionals.",
    isDefaultFeatured: false, 
    requiresAuth: true
  },
  {
    id: "p018", 
    name: "Youth Agribusiness Internship", 
    orgName: "Kabba Farms Collective",
    state: "Kogi", 
    lga: "Kabba/Bunu", 
    lat: 7.8333, 
    lng: 6.0667,
    types: ["internship"], 
    sdgs: [2, 8], 
    volunteers: 19,
    benefits: "Monthly stipend", 
    benefitTags: ["stipend"],
    image: "/projects/youth-agribusiness.jpeg",
    description: "Hands-on internship in modern farming and farm business skills for young people.",
    isDefaultFeatured: false, 
    requiresAuth: true
  },
];

// ③ LGA REFERENCE:
// So the State -> LGA dropdown doesn't depend only on which LGAs
// happen to show up in the mock data above.
export const STATE_LGAS = {
  Abia: ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umu Nneochi", "Umuahia North", "Umuahia South"],
  Adamawa: ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
  "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
  Anambra: ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
  Bauchi: ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
  Bayelsa: ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
  Benue: ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
  Borno: ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
  "Cross River": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
  Delta: ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  Ebonyi: ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
  Edo: ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba-Okha", "Orhionmwon", "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
  Ekiti: ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
  Enugu: ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"],
  FCT: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"],
  Gombe: ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
  Imo: ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte Mbaise", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Oru East", "Oru West", "Orlu", "Orsu", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
  Jigawa: ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
  Kaduna: ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
  Kano: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nassarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
  Katsina: ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dan Musa", "Dandume", "Danja", "Daura", "Dutsi", "Dutsin-Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
  Kebbi: ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Danko/Wasagu", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Yauri", "Zuru"],
  Kogi: ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela-Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa-Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
  Kwara: ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
  // Yaba and Lekki are areas inside Lagos Mainland / Eti-Osa, not LGAs. Kept so
  // project p008 (lga: "Yaba") and the existing seed data keep matching.
  Lagos: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere", "Yaba", "Lekki"],
  Nasarawa: ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
  Niger: ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
  Ogun: ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"],
  Ondo: ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
  Osun: ["Aiyedaade", "Aiyedire", "Atakunmosa East", "Atakunmosa West", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
  Oyo: ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
  Plateau: ["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
  Rivers: ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emohua", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
  Sokoto: ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
  Taraba: ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
  Yobe: ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
  Zamfara: ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"],
};





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Pure mock data — our eventual real backend/database is expected to
  replace this file wholesale, so nothing here does any logic. Every
  consumer (projects-query.js, and through it map.js and
  project-list.js) only ever reads PROJECTS and STATE_LGAS; nothing
  mutates them.



  BLOCKS DEFINITIONS:
  ① PROJECT SCHEMA  — documents the shape every object in PROJECTS
                      must match. Full field list:
                        id                string   unique id, e.g. "p001"
                        name              string   project title
                        orgName           string   organisation running it
                        state             string   Nigerian state, e.g. "Ondo"
                        lga               string   Local Government Area
                        lat, lng          number   coordinates for map
                                                    placement + distance calc
                        types             array    opportunity kind(s):
                                                    "volunteer" | "internship" |
                                                    "grant" | "job" | "training" |
                                                    "fellowship"
                        sdgs              array    SDG numbers this project
                                                    maps to, e.g. [13, 15, 11]
                        volunteers        number   headcount — social proof +
                                                    "popular" sort
                        rating            number   0-5
                        benefits          string   short line on what the user
                                                    gets, DISPLAY only, free text
                        benefitTags       array    structured tags for a FUTURE
                                                    benefits module: "stipend" |
                                                    "grant" | "certificate" |
                                                    "mentorship" | "goods" |
                                                    "employment" (kept for later
                                                    use, not currently filtered
                                                    on anywhere)
                        image             string|null  path under /public for
                                                    the card photo. null is
                                                    valid — the card falls back
                                                    to a colored panel + icon.
                        description       string   1-2 sentences
                        isDefaultFeatured boolean  shown when the user hasn't
                                                    picked a state/LGA yet (the
                                                    "popular nationwide" set)
                        requiresAuth      boolean  true = clicking View/Apply
                                                    triggers the login gate
  ② PROJECT DATA    — the actual mock project records, matching the
                      schema above.
  ③ LGA REFERENCE   — the State -> LGA lookup used by location-filter.js's
                      dropdown. Kept independent from PROJECTS so the
                      dropdown always shows every LGA option for a
                      state, even ones with no mock project in them yet.


*/