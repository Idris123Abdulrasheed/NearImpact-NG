// Single source of truth for everything the SDG pages show. Pure data plus
// two tiny helpers, no DOM. DEVELOPERS NOTE at the bottom explains the
// shape and where each piece of content came from.

// ① HELPERS:
// Tuples keep this file readable: fact = [text, source], action = [title, text].
const goal = (id, name, color, tagline, official, intro, about, facts, actions, ink = "#ffffff") => ({
  id,
  name,
  color,
  ink,
  tagline,
  official,
  intro,
  about,
  facts: facts.map(([text, source]) => ({ text, source })),
  actions: actions.map(([title, text]) => ({ title, text })),
});

export const goalUrl = (id) => `/sdg.html?n=${id}`;

// ② THE 17 GOALS:
export const SDGS = [
  goal(1, "No Poverty", "#E5243B",
    "End poverty in all its forms, everywhere",
    "End poverty in all its forms everywhere",
    "The world halved extreme poverty between 2000 and 2015, which proves the target is reachable. The job now is to finish it, so that nobody is left living on too little to meet basic needs.",
    ["No one lives in extreme poverty", "Cut the number of people living in poverty by half", "Equal rights to economic resources and basic services for everyone", "Build the resilience of vulnerable communities to climate, economic and social shocks"],
    [["The extreme-poverty line is now $3.00 a day, updated by the World Bank in 2025 (it was $1.25 when the Goals were first explained to young people).", "World Bank, 2025"],
     ["The world met its 2000 promise to halve extreme poverty by 2015, so ending it altogether is the next step.", "UNDP booklet"],
     ["Poverty is closely tied to unemployment and to missing education and skills among the most vulnerable.", "Youth4GG Guide, 2017"]],
    [["Join an entrepreneurship training", "More entrepreneurs means more jobs and income. Find a programme or invite local founders to your class."],
     ["Build job skills", "Organise a meet-up with professionals, even your parents, at your school or community space."],
     ["Learn money basics", "Make a personal budget and ask for a class on savings, credit, debt and microloans."],
     ["Spread word on social protection", "Many people never claim support they are entitled to. Learn what exists and tell your neighbours."],
     ["Support emergency drives", "Donate clothes and food to relief campaigns after floods or other disasters."]]),

  goal(2, "Zero Hunger", "#DDA63A",
    "End hunger, achieve food security and promote sustainable farming",
    "End hunger, achieve food security and improved nutrition and promote sustainable agriculture",
    "Hunger has fallen sharply in recent decades, and many places that once faced famine can now feed their most vulnerable people. Ending hunger and malnutrition for good means supporting small farmers and farming that lasts.",
    ["No one goes to bed hungry", "Everyone has enough nutritious food to stay healthy", "Higher farm productivity and better access to resources for local producers", "More investment in rural infrastructure and agricultural research"],
    [["About 1.3 billion tonnes of food is lost or wasted every year.", "Youth4GG Guide, 2017"],
     ["Around 1 in 8 people were estimated to suffer from chronic hunger when the Guide was written.", "Youth4GG Guide, 2017"],
     ["Hunger dropped by almost half in the 20 years before the Goals were agreed.", "UNDP booklet"]],
    [["Donate to food banks", "Give leftovers from birthdays, graduations and school events to the nearest food bank."],
     ["Feed people in local shelters", "Volunteer with friends, or make it a regular class activity."],
     ["Learn to cook and eat well", "Understand nutrition, read labels, and cook healthier meals."],
     ["Buy from local farmers", "Shopping at local markets supports farmers and their businesses."],
     ["Research farming innovation", "Write a paper on new agricultural practices and share it with your class."]]),

  goal(3, "Good Health and Well-being", "#4C9F38",
    "Healthy lives and well-being for all, at every age",
    "Ensure healthy lives and promote well-being for all at all ages",
    "Good health shapes how much we enjoy life and what work we can do. The Goal aims for health coverage and safe, effective medicines and vaccines for everyone.",
    ["Every child reaches their 5th birthday", "Fewer people suffering from mental illness", "End epidemics such as AIDS, tuberculosis and malaria", "Strengthen prevention and treatment of drug and alcohol abuse", "Fewer deaths from traffic accidents", "Universal access to sexual and reproductive health services", "Fair access to medicine for all"],
    [["Immunisation prevents an estimated 2 to 3 million deaths every year, and 1.5 million more could be avoided with better coverage.", "WHO, via Youth4GG Guide"],
     ["Preventable child deaths more than halved in the 25 years before the Goals, yet millions of children still die before turning five.", "UNDP booklet"],
     ["AIDS was the leading cause of death among adolescents in sub-Saharan Africa when the booklet was written.", "UNDP booklet"]],
    [["Get vaccinated", "Ask your doctor or school which vaccines you need, and check the WHO website."],
     ["Volunteer at a hospital", "Extra hands help hospitals save lives. Ask what roles exist locally."],
     ["Open honest conversations", "Host a circle about health and mental health, so people are not isolated."],
     ["Donate blood", "Find your local blood bank and start a drive at school or work."],
     ["Drive responsibly", "Follow traffic rules, skip the phone, never drive impaired."],
     ["Help rural areas get medicine", "Run a medicine donation campaign and share hygiene basics."]]),

  goal(4, "Quality Education", "#C5192D",
    "Inclusive, quality education and lifelong learning for all",
    "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all",
    "Poverty and conflict keep many children out of school, yet primary enrolment in developing regions has reached 91%. The Goal pushes further: primary, secondary, vocational and higher education for everyone.",
    ["Every child completes 12 years of education", "Equal access to education for all", "Affordable, quality technical and university education", "Every young person can read and write", "Learners understand sustainable lifestyles", "Safe, non-violent, inclusive learning environments"],
    [["Children from the poorest households are four times more likely to be out of school than those from the richest.", "UNDP booklet"],
     ["Primary enrolment in developing regions reached 91%.", "UNDP booklet"],
     ["Conflict and disasters have disrupted the education of 75 million children, and 168 million children aged 5 to 17 are in child labour.", "Youth4GG Guide, 2017"]],
    [["Donate your books", "Run a class book fair and pass used study books to kids who cannot afford them."],
     ["Tutor someone", "Give 1 to 2 hours a week to a younger student."],
     ["Fundraise for a local school", "A small charity event can fund a scholarship."],
     ["Teach a skill", "Run a workshop in your area of knowledge, or mentor a younger student."],
     ["Teach English", "English fluency opens doors to work. Volunteer with an NGO to teach it."],
     ["Stop bullying", "Call it out and make room for open conversation."],
     ["Push for accessible schools", "Petition for ramps and facilities so students with disabilities are included."]]),

  goal(5, "Gender Equality", "#FF3A21",
    "Equality and empowerment for all women and girls",
    "Achieve gender equality and empower all women and girls",
    "Women and girls have gained ground, with more girls in school and more women paid for their work, but they still lag behind in almost every way. The Goal aims to end discrimination against them everywhere.",
    ["No discrimination based on gender", "End violence against women", "Equal access to leadership and resources", "End child marriage and female genital mutilation", "Better access to technology for women", "Access to reproductive health"],
    [["Women held 27.2% of seats in national parliaments on 1 January 2025, up 4.9 percentage points since 2015.", "UN SDG Report 2025"],
     ["More than 150 countries had at least one law that discriminates against women.", "World Bank, via Youth4GG Guide"],
     ["Across industries, women held on average about 9% of CEO positions.", "Youth4GG Guide, 2017"]],
    [["Talk careers with girls", "Invite inspiring women entrepreneurs to speak about their paths."],
     ["Raise your voice", "Write a blog, join a campaign, or organise an event on equality."],
     ["Start a family conversation", "Talk about gender roles in housework and careers."],
     ["Speak up for women in danger", "Call out gender-insensitive behaviour and report harm to the right authorities."],
     ["Teach girls technology", "Learn coding yourself, then volunteer to train girls in IT."],
     ["Share reproductive-health knowledge", "Start the conversation and support NGOs educating girls, especially in rural areas."]]),

  goal(6, "Clean Water and Sanitation", "#26BDE2",
    "Clean water and sanitation, managed sustainably, for everyone",
    "Ensure availability and sustainable management of water and sanitation for all",
    "Safe, affordable drinking water is the goal for 2030. Water scarcity already affects more than 40% of people, and climate change is pushing that higher.",
    ["Water becomes a basic good with improved quality", "Everyone has a toilet and basic hygiene", "Not a drop of water wasted", "Protect and restore rivers, lakes, wetlands, forests and aquifers"],
    [["More than 750 million people lacked adequate access to clean drinking water.", "Youth4GG Guide, 2017"],
     ["Water scarcity affects more than 40% of people, and by 2050 at least one in four may face recurring shortages.", "UNDP booklet"],
     ["Children, especially girls, often leave school because of long daily water walks.", "Youth4GG Guide, 2017"]],
    [["Run a hygiene campaign", "Raise awareness at school, online or in your street."],
     ["Use less water", "Close the tap while washing dishes and keep showers short."],
     ["Measure waste", "Test how much water your class can save and present the results."],
     ["Help deliver clean water", "Volunteer weekly to bring drinking water to vulnerable communities."],
     ["Clean a river", "Organise a clean-up with classmates or family."],
     ["Protect watersheds", "Plant trees along stream banks to filter sediment and pollutants."]]),

  goal(7, "Affordable and Clean Energy", "#FCC30B",
    "Affordable, reliable, sustainable, modern energy for all",
    "Ensure access to affordable, reliable, sustainable and modern energy for all",
    "Between 1990 and 2010, 1.7 billion more people gained electricity. As demand grows, the challenge is to be more efficient and to shift to clean sources such as solar and wind.",
    ["Everyone has access to energy", "Double the rate of energy efficiency", "Modern infrastructure and technology to supply energy to all", "More renewable energy in the global mix"],
    [["Around 3 billion people relied on wood, coal, charcoal or animal waste for cooking and heating.", "Youth4GG Guide, 2017"],
     ["Only about 6% of the world's energy came from renewable sources when the Guide was written.", "Youth4GG Guide, 2017"],
     ["Between 1990 and 2010, 1.7 billion more people gained access to electricity.", "UNDP booklet"]],
    [["Switch off what you do not use", "Lights, heating, air conditioning and idle devices."],
     ["Track household energy", "Check the bills with your parents and watch the numbers fall."],
     ["Research solar", "Present options like solar water heating and lighting to your family."],
     ["Recycle batteries", "Find a drop-off point and run a battery collection at school."],
     ["Run an energy competition", "A project fair on renewables can even count towards a course grade."],
     ["Support communities without power", "Fundraise or volunteer where people still cook with wood or charcoal."]],
    "#12241c"),

  goal(8, "Decent Work and Economic Growth", "#A21942",
    "Decent work and inclusive economic growth for all",
    "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all",
    "People need jobs that pay enough to support a family. The middle class has grown, but job growth is not keeping pace with the growing workforce, which is why skills, enterprise and fair labour matter.",
    ["Full employment and fair pay", "At least 7% annual growth in the least developed countries", "End forced labour and slavery", "Protect labour rights and safe workplaces", "Build skills for youth employment", "Promote sustainable tourism"],
    [["Around 13.6% of young people were unemployed globally, and over 50% in some countries.", "Youth4GG Guide, 2017"],
     ["The middle class almost tripled in size in developing countries over 25 years, to more than a third of the population.", "UNDP booklet"],
     ["Job growth has not kept pace with the growth of the labour force.", "UNDP booklet"]],
    [["Run after-school workshops", "Invite people with a skill to teach it at your school."],
     ["Start a mentoring group", "Connect students with people experienced in their field."],
     ["Know your labour rights", "Read the youth-labour section of the law in your country."],
     ["Avoid brands that use child labour", "Look up before you buy."],
     ["Buy local", "Supporting local producers keeps money in the community."],
     ["Train rural youth", "Bring skills workshops to young people who have no after-school options."]]),

  goal(9, "Industry, Innovation and Infrastructure", "#FD6925",
    "Resilient infrastructure, inclusive industry and innovation",
    "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation",
    "Technology helps create jobs and use energy better, and the internet connects us to ideas from everywhere. Yet billions are still offline, so bridging the digital divide is central to this Goal.",
    ["Double the number of industry jobs in the least developed countries", "Universal access to the internet", "Stronger scientific research"],
    [["Internet use grew from 40% of people in 2015 to 68% in 2024.", "UN SDG Report 2025"],
     ["Four billion people had no way of getting online when the Guide was written, mostly in developing countries.", "Youth4GG Guide, 2017"],
     ["Some countries still lack quality roads or public transport, even as the world talks about a 4th industrial revolution.", "Youth4GG Guide, 2017"]],
    [["Invite industry people to school", "Hearing from engineers and makers shows what careers exist."],
     ["Hold a think-tank contest", "Let companies or startups mentor the winners."],
     ["Ask for IT and coding classes", "Push your school to teach digital skills."],
     ["Map free WiFi hotspots", "Share the map on social media and flyers."],
     ["Organise a science fair", "Stimulate interest in innovation among classmates."]]),

  goal(10, "Reduced Inequalities", "#DD1367",
    "Reduce inequality within and among countries",
    "Reduce inequality within and among countries",
    "Income inequality is a global problem and needs global answers: better regulation of financial markets, aid where it is most needed, and safe routes for migrants. Opportunity should not depend on who you are or where you come from.",
    ["Narrow the income gap between rich and poor", "Safe mobility for refugees and migrants", "Include everyone socially, economically and politically, whatever their age, sex, disability, race, ethnicity, origin or religion"],
    [["About 50% of the world's refugees were under 18 when the Guide was written.", "Youth4GG Guide, 2017"],
     ["Who you are, what you have or who you love still affects how people are treated.", "Youth4GG Guide, 2017"]],
    [["Run a voter-registration drive", "Help underrepresented groups be heard in government."],
     ["Hold rights-awareness events", "Many minorities do not know their basic labour or property rights."],
     ["Support migrants and refugees", "Donate, volunteer, or run a language or skills workshop."],
     ["Host a cultural night", "Learn about other religions and heritages to tackle prejudice."],
     ["Favour inclusive companies", "Check which employers and brands are inclusive and spread the word."],
     ["Give up your seat", "A small, constant habit of empathy."]]),

  goal(11, "Sustainable Cities and Communities", "#FD9D24",
    "Cities and communities that are inclusive, safe and sustainable",
    "Make cities and human settlements inclusive, safe, resilient and sustainable",
    "More than half of humanity lives in cities, and it will be about two thirds by 2050. Cities can be sustainable for everyone with affordable housing, better slums, public transport, green spaces and wider participation in planning.",
    ["Decent housing for every person", "Sustainable cities and rural settlements", "Protect vulnerable communities from disasters", "Safe, affordable transport for all", "Protect cultural and natural heritage", "Universal access to public spaces"],
    [["828 million people lived in slums, and the number kept rising.", "Youth4GG Guide, 2017"],
     ["There were 28 mega-cities in 2014 (10 million+ people each), up from 10 in 1990, with 453 million residents.", "UNDP booklet"],
     ["More than half of the world's people live in cities, rising to about two thirds by 2050.", "UNDP booklet"]],
    [["Inspect your building", "Check safety and accessibility, then report problems."],
     ["Write a good-neighbour guide", "Share simple ways to make shared spaces safer and greener."],
     ["Commute sustainably", "Carpool, cycle, walk or use public transport."],
     ["Care for public spaces", "Plant trees, clean up, renovate playgrounds."],
     ["Create a youth advisory board", "Give your municipality youth ideas on urban planning."],
     ["Support local museums and culture", "Visit, volunteer, or run cultural nights."]]),

  goal(12, "Responsible Consumption and Production", "#BF8B2E",
    "Use and make things in ways that respect the planet",
    "Ensure sustainable consumption and production patterns",
    "Some people use a great deal and others too little to meet basic needs. This Goal is about everyone getting what they need while we manage resources wisely, cut waste and recycle.",
    ["Zero waste of natural resources", "Halve global food losses", "Reduce waste through recycling", "Hold businesses accountable for sustainable practices", "People understand lifestyles in harmony with nature"],
    [["Each person generates on average about 1.2 kg of waste a day, roughly 438 kg a year.", "Youth4GG Guide, 2017"],
     ["The target is to halve per-capita food waste globally.", "UNDP booklet"],
     ["About 1.3 billion tonnes of food is lost or wasted each year.", "Youth4GG Guide, 2017"]],
    [["Use less paper", "Go digital, or print on both sides."],
     ["Reuse and recycle", "Fix, repurpose, or buy recycled goods."],
     ["Plan your food", "Shopping lists and sensible portions mean less waste."],
     ["Carry reusables", "A bottle, cup and shopping bag cut plastic."],
     ["Donate what you do not need", "Clothes and electronics can serve someone else."],
     ["Set up sorting bins", "Start at school or home, ideally with a waste NGO."],
     ["Call out polluters", "Back companies that are sustainable and campaign against those that are not."]]),

  goal(13, "Climate Action", "#3F7E44",
    "Act now against climate change and its impacts",
    "Take urgent action to combat climate change and its impacts",
    "Every country feels the effects of climate change, some more than others. It is still possible to limit warming to 2 degrees Celsius above pre-industrial levels, with political will and the right technology.",
    ["Build capacity to face natural disasters", "Educate and raise awareness about climate change"],
    [["97% of climate scientists agree that warming over the past century is very likely due to human activity.", "Youth4GG Guide, 2017"],
     ["Annual losses from earthquakes, tsunamis, cyclones and floods run into the hundreds of billions of dollars.", "UNDP booklet"],
     ["Limiting warming to 2 degrees Celsius is still possible, with political will and technology.", "UNDP booklet"]],
    [["Track your carbon footprint", "Use an online tracker and set a reduction goal."],
     ["Take public transport or cycle", "Fewer emissions, quieter streets."],
     ["Eat less meat", "Try one meat-free day a week."],
     ["Teach disaster readiness", "Work with the relevant agencies to run a preparedness workshop."],
     ["Recycle properly", "Sort paper, glass, plastic, metal and old electronics."],
     ["Teach climate action", "Deliver a short session for others once you have learned."]]),

  goal(14, "Life Below Water", "#0A97D9",
    "Protect the oceans, seas and marine resources",
    "Conserve and sustainably use the oceans, seas and marine resources for sustainable development",
    "The oceans shape our climate, chemistry and food. Nearly a third of fish stocks are overexploited, and pollution and acidification are rising, but the Goals set clear targets for protecting marine life.",
    ["Reduce marine pollution", "End overfishing and illegal fishing", "Equal opportunities for small-scale fishers", "Protect oceans and marine ecosystems"],
    [["Over 3 billion people depend on marine and coastal biodiversity for their livelihoods.", "UNDP booklet"],
     ["Oceans absorb about 30% of human CO2 emissions, and are 26% more acidic since the industrial revolution.", "UNDP booklet"],
     ["About 13,000 pieces of plastic litter float on every square kilometre of ocean.", "UNDP booklet"]],
    [["Run a plastic campaign", "Explain how wrongly discarded plastic reaches rivers and seas."],
     ["Stop using plastic bags", "Persuade your household to switch."],
     ["Clean up a river or beach", "Make it a public event to draw more people."],
     ["Do not litter, and call out others", "Special care with glass, plastic and batteries."],
     ["Buy local, legal fish", "Support small-scale fishers who hold proper permits."],
     ["Teach about the ocean", "Share talks or videos on how oceans affect everyday life."]]),

  goal(15, "Life on Land", "#56C02B",
    "Protect forests, land and the life that depends on them",
    "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss",
    "Plants make up 80% of the human diet, and forests keep air, water and climate in balance. Yet land and wildlife are under threat, and these Goals aim to conserve and restore ecosystems by 2030.",
    ["Preserve forests and mountains", "Prevent the extinction of threatened species", "Keep soil and land fertile", "Protect wildlife and stop poaching"],
    [["Forests are home to more than 80% of all land animals, plants and insects.", "Youth4GG Guide, 2017"],
     ["Forests cover 30% of the Earth's surface.", "UNDP booklet"],
     ["Farmland is disappearing 30 to 35 times faster than it historically has.", "UNDP booklet"]],
    [["Plant a tree", "Make it a yearly habit with friends and challenge others."],
     ["Clean a park or forest", "Even one bag of litter helps."],
     ["Recycle paper", "Less paper means fewer trees cut."],
     ["Avoid pesticides", "Choose natural fertiliser to protect soil."],
     ["Do not buy illegal plants or wildlife", "Check sources and endangered-species lists."],
     ["Volunteer with animal shelters", "Help street animals and endangered species."],
     ["Join a policy group", "Advocate for land protection with petitions and events."]]),

  goal(16, "Peace, Justice and Strong Institutions", "#00689D",
    "Peace, justice and strong, accountable institutions",
    "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels",
    "Nobody can learn, work or raise a family in peace without justice, human rights and the rule of law. This Goal seeks to reduce all forms of violence and find lasting solutions to conflict.",
    ["Reduce violence everywhere", "End violence and torture of children", "Equal access to legal services", "Reduce corruption and bribery", "Public access to information and protection of fundamental rights", "Inclusive, representative decision-making at all levels"],
    [["Only about 2% of parliamentarians worldwide were under 30.", "Youth4GG Guide, 2017"],
     ["Almost half the world's population is under 30, yet young people are rarely at the centre of political decisions.", "UN, via Youth4GG Guide"],
     ["Conflict forces children out of primary school and drives poverty and damaged infrastructure.", "Youth4GG Guide, 2017"]],
    [["Know your rights", "Learn them and share them with your peers."],
     ["Run a conflict-resolution workshop", "Use a trained facilitator."],
     ["Vote", "Decisions are made by those who show up."],
     ["Attend meetings with officials", "Bring your generation's voice to decisions."],
     ["Stay informed", "Follow the news and share it with friends."],
     ["Refuse bribes", "Call out corruption, including from friends and family."]]),

  goal(17, "Partnerships for the Goals", "#19486A",
    "Work together to deliver every other Goal",
    "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development",
    "The to-do list is huge, but 193 countries agreed to it and the world is more connected than ever. This final Goal sets out how governments, businesses, schools and citizens work together to deliver all the others.",
    ["Mobilise financial resources for developing countries", "Build technology and innovation capacity in developing countries", "Build skills to implement the Goals", "Increase exports from developing countries", "Monitor data and hold each other accountable"],
    [["Official development assistance fell 7.1% in 2024 after five years of growth, with further cuts expected.", "UN SDG Report 2025"],
     ["Only 35% of SDG targets with data are on track or making moderate progress, and 18% have gone backwards.", "UN SDG Report 2025"],
     ["193 countries agreed to the Goals in 2015.", "UNDP booklet"]],
    [["Volunteer with SDG-focused NGOs", "In your own country or abroad, on skills and education."],
     ["Fundraise for SDG projects", "Support a project directly or start a crowdfunding campaign."],
     ["Buy Fair Trade", "Demand for developing-country products creates export income."],
     ["Hold governments accountable", "Learn your government's SDG plan and use your vote and voice."],
     ["Use your customer power", "Pressure businesses to adopt sustainable practices."]]),
];

// ③ GOAL 18: WHAT CAN I DO / THE WAY FORWARD:
export const WAY_FORWARD = {
  id: 18,
  name: "The Global Goals",
  color: "var(--canopy)",
  ink: "#ffffff",
  tagline: "What can I do? The way forward",
  intro:
    "In 2015, leaders from 193 countries agreed on a plan to end poverty and hunger and protect the planet. It is an ambitious plan, but the world already halved extreme poverty once. Now it needs everyone, including you.",
  threeThings: [
    { title: "End extreme poverty", text: "Make sure nobody is left without the means to live with dignity." },
    { title: "Fight inequality and injustice", text: "Build societies where opportunity does not depend on who you are." },
    { title: "Tackle climate change", text: "Protect the planet that every other Goal depends on." },
  ],
  levels: [
    { title: "Level 1: Do it yourself", text: "Start with small daily habits that are easy to repeat, then build up." },
    { title: "Level 2: Engage family and friends", text: "Share the Goals and the actions you take. Awareness is something you can do every day." },
    { title: "Level 3: Mobilise your community", text: "Organise group actions and projects that involve neighbours, schools and eventually the whole city." },
  ],
  waysToHelp: [
    { title: "Spread the word", text: "Share what you learn about the Goals on social media and with people around you." },
    { title: "Donate", text: "Money is the most direct way to reduce and eradicate poverty." },
    { title: "Start a fundraiser", text: "It raises money, builds awareness and inspires others." },
    { title: "Show your goals", text: "Wear or display the Goals you care about most." },
  ],
  organisations: [
    { title: "Business", text: "Build corporate volunteering and CSR plans around real actions young people already lead." },
    { title: "NGOs and community groups", text: "Run internal challenges, share the actions with your network, and fold them into your projects." },
    { title: "Schools and universities", text: "Teach the Goals and support student-led initiatives with space, time and curriculum credit." },
  ],
};

// ④ LOOKUP:
export const ALL_GOALS = [...SDGS, WAY_FORWARD];

export function getSdgById(id) {
  return ALL_GOALS.find((g) => g.id === Number(id)) || null;
}

export const SDG_SOURCES = [
  { label: "United Nations: Sustainable Development Goals", url: "https://sdgs.un.org/goals" },
  { label: "UNDP: What's your Goal? booklet", url: "https://www.undp.org/sustainable-development-goals" },
  { label: "Youth4GG: Young Person's Guide to Saving the World", url: "https://www.youth4globalgoals.org" },
  { label: "UN SDG Report 2025", url: "https://unstats.un.org/sdgs/report/2025" },
];





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Static content for the SDG pages. Replaces the inline titles in
  sdgs.js and the separate sdg-titles.js (one list, not three). Pure
  data: the homepage grid, the full SDG page and each detail page all
  read from here, so editing a fact is a one-line change.

  Each goal: id, name, color (the official UN colour, a deliberate
  exception to "tokens only" because it is brand data), ink (text
  colour on that fill), tagline (short banner line), official (UN goal
  wording), intro, about (what the goal covers), facts [{text, source}],
  actions [{title, text}].

  Facts carry a source label. Several come from the 2017 Youth4GG guide
  and the UNDP booklet, so they are dated; the UN SDG Report 2025 and
  World Bank items are current. Refresh the dated ones over time.

  Goal 18 is not a UN goal. WAY_FORWARD holds the "what can I do" page.

  BLOCKS DEFINITIONS:
  ① HELPERS      — goal() builder and goalUrl().
  ② THE 17 GOALS — SDGS array.
  ③ GOAL 18      — WAY_FORWARD content.
  ④ LOOKUP       — ALL_GOALS, getSdgById(), SDG_SOURCES.
*/
