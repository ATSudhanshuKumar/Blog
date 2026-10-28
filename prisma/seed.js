// Run: node prisma/seed.js  (safe to re-run: uses upsert on slug)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const USER_EMAIL = "astrowain@gmail.com";

// slugs from earlier seed versions that no longer exist
const RETIRED_SLUGS = ["learn-nextjs-app-router", "git-habits-that-save-time", "street-food-guide-india"];

const categories = ["style", "fashion", "food", "travel", "culture", "coding"].map((s) => ({
  slug: s,
  title: s,
  img: `/${s}.png`,
}));

// { slug, title, cat, lead, sections: [[heading, text]], outro }
const raw = [
  // ───────────── coding ─────────────
  {
    slug: "first-post",
    title: "Getting started with the Next.js App Router",
    cat: "coding",
    lead: "The App Router changes how we structure Next.js apps. Instead of a pages folder, every folder inside app becomes a route, and a few special files describe what should render.",
    sections: [
      ["Folders are routes", "Create app/about/page.jsx and you instantly have an /about page. A layout.jsx file wraps every page below it, so shared things like the navbar and footer live in one place and never re-render when you move between pages."],
      ["Server Components by default", "Components are rendered on the server unless you add use client at the top. That means you can fetch data right inside a component with async/await, talk to your database directly, and ship far less JavaScript to the browser."],
      ["Loading and error states", "Drop a loading.jsx next to a page and Next shows it while the data streams in. Add error.jsx and failures are caught gracefully instead of breaking the whole screen."],
    ],
    outro: "Start small: one layout, two pages and one server-side fetch. Once the mental model clicks, building features gets much faster.",
  },
  {
    slug: "prisma-with-mongodb",
    title: "Using Prisma with MongoDB Atlas",
    cat: "coding",
    lead: "Prisma gives you a type-safe, readable way to talk to MongoDB. You describe your data once in schema.prisma and get an auto-completing client for free.",
    sections: [
      ["Setting up the schema", "MongoDB stores ids in a field called _id, so each model uses an id of type String with @map(\"_id\") and a default generator such as cuid(). Relations work through unique fields like slug or email."],
      ["Pushing to Atlas", "Put your connection string in the DATABASE_URL environment variable, include the database name in it, and run npx prisma db push. Prisma creates the collections and indexes for you. There are no migrations with MongoDB, only pushes."],
      ["Querying", "Use findMany for lists, findUnique for a single record, and include to pull in relations in one call. Wrap related reads in prisma.$transaction when you need a consistent result."],
    ],
    outro: "Keep one shared Prisma client in development, otherwise hot reloads open too many connections to your cluster.",
  },
  {
    slug: "react-hooks-cheatsheet",
    title: "A practical React hooks cheatsheet",
    cat: "coding",
    lead: "Hooks let function components hold state and react to change. Here are the ones you will use every day and the mistakes to avoid with each.",
    sections: [
      ["useState and useReducer", "useState is perfect for simple values like a toggle or an input. When several pieces of state change together, useReducer keeps the logic in one predictable place."],
      ["useEffect, used carefully", "Effects are for syncing with the outside world: timers, subscriptions, browser APIs. If you are only calculating something from props or state, do it during render instead. Always list every value you use in the dependency array."],
      ["useMemo, useCallback and custom hooks", "Memoise only when you have measured a real slowdown. The bigger win is a custom hook: pull repeated logic into a function that starts with use and your components shrink immediately."],
    ],
    outro: "Most bugs come from effects that do too much. Keep them small and your app stays easy to reason about.",
  },
  {
    slug: "css-grid-vs-flexbox",
    title: "CSS Grid vs Flexbox: when to use which",
    cat: "coding",
    lead: "Both are layout systems and both are excellent. The trick is knowing which one fits the job so you write less CSS and fight it less.",
    sections: [
      ["Flexbox is one-dimensional", "Flexbox lines items up in a single row or column and shares the space between them. It is ideal for navbars, button groups, cards in a row and centring anything both ways."],
      ["Grid is two-dimensional", "Grid controls rows and columns together. Use it for page layouts, photo galleries and dashboards. With grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) you get a responsive layout in one line."],
      ["Using them together", "Real layouts mix the two. Let Grid draw the skeleton of the page and let Flexbox arrange the content inside each area."],
    ],
    outro: "If you are laying out items in a line, reach for Flexbox. If you are laying out a whole area, reach for Grid.",
  },
  {
    slug: "javascript-async-await",
    title: "Async/await in JavaScript without the confusion",
    cat: "coding",
    lead: "Async/await makes asynchronous code read like normal top-to-bottom code. Once you understand what it does underneath, it stops feeling like magic.",
    sections: [
      ["What async really does", "An async function always returns a promise. The await keyword pauses that function until the promise settles, while the rest of your program keeps running."],
      ["Handling errors", "Wrap awaited calls in try/catch. A rejected promise throws at the await line, so one catch block can handle every failure in the function."],
      ["Running things in parallel", "Awaiting inside a loop runs requests one after another. When the calls do not depend on each other, start them together with Promise.all and wait for all of them at once. It is often several times faster."],
    ],
    outro: "Remember: await pauses only the current function, never the whole page.",
  },

  // ───────────── travel ─────────────
  {
    slug: "travel-diary",
    title: "A weekend in the mountains",
    cat: "travel",
    lead: "Two days, one small backpack and no fixed plan. A weekend in the mountains is the fastest reset I know for a tired mind.",
    sections: [
      ["Day one: slow down", "We reached the village by noon, dropped our bags at a small homestay and walked without a destination. Pine trees, a cold stream and chai from a roadside stall were all the entertainment we needed."],
      ["Day two: the early climb", "Waking at five was worth every sleepy minute. The sun slid over the ridge, the valley turned gold and for an hour the trail was entirely ours."],
      ["What to pack", "Warm layers even in summer, a refillable bottle, sturdy shoes and a power bank. Leave the heavy camera lenses at home and trust your eyes."],
    ],
    outro: "Go without expectations and the mountains will give you more than any itinerary.",
  },
  {
    slug: "goa-beyond-beaches",
    title: "Goa beyond the beaches",
    cat: "travel",
    lead: "Most visitors only see the party side of Goa. The quieter side, with old Portuguese lanes, spice farms and empty shores, is the one worth returning for.",
    sections: [
      ["Walk through Fontainhas", "The Latin Quarter of Panjim is a maze of coloured houses, tiny chapels and cafes. Go in the morning, when the light is soft and the streets are quiet."],
      ["Eat like a local", "Skip the tourist menus and find a small shack for fish curry rice, prawn balchao and fresh poi bread. Finish with bebinca if you can find it."],
      ["Best time to go", "November to February has cool evenings and calm seas. Monsoon is cheap and green, and perfect if you want empty beaches."],
    ],
    outro: "Rent a scooter, follow the smaller roads and let Goa surprise you.",
  },
  {
    slug: "backpacking-on-a-budget",
    title: "Backpacking on a budget: 8 tips that actually work",
    cat: "travel",
    lead: "You do not need a big budget to see a lot of the world. You need a little planning and a few good habits.",
    sections: [
      ["Spend smart on the big things", "Book trains and buses early, travel on weekdays and stay in hostels or homestays. Transport and a bed are where most of the money goes."],
      ["Eat where locals eat", "A busy canteen is cheaper, tastier and safer than a restaurant near the monument. Ask your host for their favourite place."],
      ["Travel light", "A 35 litre backpack means no baggage fees and easy movement between cities. If you are unsure about packing something, leave it."],
    ],
    outro: "Carry offline maps and a small emergency fund. With those two, almost every travel problem becomes a small one.",
  },
  {
    slug: "jaipur-pink-city-guide",
    title: "Jaipur, the Pink City: a short guide",
    cat: "travel",
    lead: "Jaipur is loud, colourful and full of stories. Two days is enough to fall in love with it.",
    sections: [
      ["The big three", "Amber Fort, Hawa Mahal and the City Palace are the headline sights. Reach each one when it opens, before the heat and the crowds."],
      ["Markets and food", "Spend an evening at Johari Bazaar for jewellery and block-printed textiles, then eat dal baati churma and a glass of lassi for dinner."],
      ["The best view in town", "Climb to Nahargarh Fort at sunset. The whole pink city glows below you, and it costs almost nothing."],
    ],
    outro: "Winter is the best season. Summers are very hot, so carry water and wear a hat.",
  },
  {
    slug: "weekend-in-manali",
    title: "A perfect weekend in Manali",
    cat: "travel",
    lead: "Manali is the classic mountain escape: pine forests, the roaring Beas river and snow peaks that appear when the clouds lift.",
    sections: [
      ["Day one: Old Manali", "Walk across the river to Old Manali for cafes, live music and the Hadimba temple tucked inside a cedar forest. It is relaxed and photogenic."],
      ["Day two: Solang Valley", "Start early for Solang Valley, where you can try paragliding or simply walk on snow. Eat hot momos at the viewpoint and head back before dark."],
      ["Travel tips", "Leave early in the morning to beat the traffic, keep cash for small shops and carry a light jacket even in summer."],
    ],
    outro: "Two days is enough to feel refreshed. Stay longer if you can.",
  },

  // ───────────── food ─────────────
  {
    slug: "street-food",
    title: "The best street food guide for beginners",
    cat: "food",
    lead: "Indian street food is a whole country on a plate. Every city has a signature bite, and the best ones come from a small cart with a long queue.",
    sections: [
      ["Pick the right stall", "Look for a crowd and fast turnover. Busy stalls use fresh ingredients and hot oil, which is the best safety sign you can find."],
      ["What to try first", "Vada pav in Mumbai, chaat in Delhi, kachori in Jaipur and jhalmuri in Kolkata. Start mild and add chutney as you go."],
      ["Stay comfortable", "Carry a bottle of water and hand sanitiser, eat food that is cooked in front of you and take it slow on day one."],
    ],
    outro: "Go hungry, go curious and try at least one thing you cannot pronounce.",
  },
  {
    slug: "perfect-masala-chai",
    title: "How to make the perfect masala chai",
    cat: "food",
    lead: "Good chai is a small ritual. With a few whole spices and a little patience, your kitchen can smell like a roadside tea stall in minutes.",
    sections: [
      ["The spices", "Lightly crush a small piece of ginger, two cardamom pods and a few peppercorns. Add a cinnamon stick if you like it warm and sweet."],
      ["The method", "Simmer the spices in water for two minutes, add loose tea leaves, then pour in milk. Let it rise and settle twice so the flavour deepens."],
      ["Finishing touches", "Sweeten at the end, strain into a cup and drink it hot with biscuits or a crisp rusk."],
    ],
    outro: "Ratio to remember: one cup of water, one cup of milk and one teaspoon of tea per person.",
  },
  {
    slug: "homemade-pizza-basics",
    title: "Homemade pizza basics for beginners",
    cat: "food",
    lead: "You do not need a wood-fired oven to make a good pizza. You need good dough, a very hot oven and a little restraint with the toppings.",
    sections: [
      ["Start with the dough", "Flour, water, yeast and salt are all you need. Mix, knead for ten minutes and let it rest overnight in the fridge. Time develops flavour better than any ingredient."],
      ["Get the oven hot", "Heat the oven as high as it will go and put a tray or pan inside to heat as well. A very hot base is what gives you a crisp, bubbly crust."],
      ["Keep toppings simple", "Crushed tomato, torn mozzarella and fresh basil beat a heavy pile of ingredients. Too many toppings make the middle soggy."],
    ],
    outro: "Bake for 8 to 10 minutes, rest for one minute, and slice.",
  },
  {
    slug: "healthy-breakfast-ideas",
    title: "Five healthy breakfasts in ten minutes",
    cat: "food",
    lead: "A good breakfast does not need to be complicated. These five options are quick, filling and easy to prepare before you leave home.",
    sections: [
      ["Make-ahead options", "Overnight oats with fruit and seeds, or a bowl of curd with honey and nuts, can be ready the evening before and taken straight from the fridge."],
      ["Warm and quick", "Vegetable poha with peanuts, or a moong dal chilla stuffed with onion and coriander, takes about ten minutes in a pan."],
      ["On the go", "Peanut butter on whole wheat toast with a banana is the easiest breakfast to eat on the move."],
    ],
    outro: "Add protein to every meal. It keeps you full until lunch.",
  },
  {
    slug: "monsoon-snacks-and-pakoras",
    title: "Monsoon snacks: pakoras and more",
    cat: "food",
    lead: "Rain, a window seat and a plate of hot pakoras: there is no better combination. Here is how to make the snacks of the season perfectly.",
    sections: [
      ["Crispy pakoras", "Mix gram flour with a little rice flour, salt, ajwain and chilli, and add water until the batter is thick. Fry sliced onions, potatoes or spinach in medium-hot oil until golden."],
      ["Corn and bread rolls", "Roast corn over a flame and rub it with lemon and masala. For quick bread rolls, stuff boiled potato in bread, dip in batter and fry."],
      ["The chai on the side", "Hot masala chai is a must. Add a little extra ginger on rainy days."],
    ],
    outro: "Fry in small batches so the oil stays hot and the pakoras stay crisp.",
  },

  // ───────────── fashion ─────────────
  {
    slug: "capsule-wardrobe-guide",
    title: "Build a capsule wardrobe that works",
    cat: "fashion",
    lead: "A capsule wardrobe is a small group of clothes that all work together. You get more outfits from fewer pieces, and mornings get much easier.",
    sections: [
      ["Start with the basics", "A few white and plain shirts, a pair of dark jeans, chinos, a blazer and one pair of clean sneakers form the core of almost every outfit."],
      ["Stick to a palette", "Pick two or three neutral colours and one accent. When everything matches, you can mix any top with any bottom."],
      ["Fit over quantity", "Clothes that fit well look better than expensive ones that do not. A good tailor is the best investment in your wardrobe."],
    ],
    outro: "Aim for around 25 pieces and rotate them by season.",
  },
  {
    slug: "sneaker-care-tips",
    title: "Sneaker care: keep them fresh for years",
    cat: "fashion",
    lead: "A clean pair of sneakers lifts any outfit. A few minutes of care every week makes them last twice as long.",
    sections: [
      ["Cleaning step by step", "Remove the laces and brush off dust. Scrub the shoe gently with a soft brush, mild soap and water, and wipe it with a clean cloth."],
      ["Drying the right way", "Stuff the shoes with paper and let them dry in the shade. Direct sun and washing machines can warp the sole and fade the colour."],
      ["Daily habits", "Rotate between two pairs so each can air out, and use a protective spray on suede or canvas."],
    ],
    outro: "Clean small stains right away. It is much easier than scrubbing old marks.",
  },
  {
    slug: "sustainable-fashion-basics",
    title: "Sustainable fashion: where to begin",
    cat: "fashion",
    lead: "Sustainable fashion is not about buying a new eco wardrobe. It is about using what you own and buying less, but better.",
    sections: [
      ["Wear what you have", "The most sustainable garment is the one already in your closet. Repair small tears, restyle old pieces and wear things for years instead of seasons."],
      ["Buy with care", "Choose natural fabrics such as cotton, linen and wool, check the stitching and support brands that share how and where they make their clothes."],
      ["Second-hand is stylish", "Thrift stores, online resale and clothes swaps with friends are great ways to find unique pieces at a fraction of the price."],
    ],
    outro: "Ask one question before buying: will I wear this at least thirty times?",
  },
  {
    slug: "how-to-style-denim",
    title: "Five ways to style denim",
    cat: "fashion",
    lead: "Denim has been in fashion for more than a century, and it still goes with almost everything. Here are five easy ways to wear it.",
    sections: [
      ["Denim on denim", "It works when the shades are clearly different. Try a light chambray shirt with dark jeans, and keep the rest of the outfit simple."],
      ["Dressed up", "Pair dark straight jeans with a crisp shirt, a blazer and loafers for a smart-casual look that works from office to dinner."],
      ["Weekend casual", "A white tee, a denim jacket and clean sneakers is an effortless uniform. Roll the sleeves and cuffs for a relaxed finish."],
    ],
    outro: "The most important thing is fit. A well-fitting pair of jeans beats any trend.",
  },
  {
    slug: "ethnic-wear-modern-twist",
    title: "Ethnic wear with a modern twist",
    cat: "fashion",
    lead: "Traditional clothes do not have to stay in the wedding season. A few small changes make them work for everyday life.",
    sections: [
      ["Mix and match", "Wear a handloom kurta with straight trousers or even jeans. Pair a silk dupatta with a plain tee and trousers for a fresh look."],
      ["Choose breathable fabrics", "Cotton, linen and chanderi are comfortable in the heat and look great with minimal accessories."],
      ["Keep accessories simple", "A pair of silver jhumkas or a leather watch is enough. Let the fabric and the cut do the talking."],
    ],
    outro: "Wear it with confidence and it will always look modern.",
  },

  // ───────────── style ─────────────
  {
    slug: "minimal-home-decor",
    title: "Minimal home decor on a small budget",
    cat: "style",
    lead: "A calm home does not need big spending. Minimal decor is mostly about space, light and a few things you truly love.",
    sections: [
      ["Clear the clutter", "Start by removing what you do not use. Open surfaces and empty corners make a room feel larger straight away, and they cost nothing."],
      ["Limit your palette", "Choose two or three colours, such as warm white, wood and one soft accent. A calm palette ties everything together."],
      ["Add warmth", "Swap harsh white bulbs for warm lights, add a few plants and place one good piece, like a wooden table or a woven rug, as the focus of the room."],
    ],
    outro: "Buy slowly. One thing you love is better than ten you tolerate.",
  },
  {
    slug: "morning-routine-for-focus",
    title: "A simple morning routine for better focus",
    cat: "style",
    lead: "You do not need a 5 a.m. alarm and a two-hour routine. A few small habits at the start of the day are enough to set a calm tone.",
    sections: [
      ["Start without your phone", "Give yourself thirty minutes before you check messages. Drink a glass of water, open a window and let your mind wake up first."],
      ["Move a little", "Ten minutes of stretching, yoga or a short walk wakes up the body and helps you think clearly."],
      ["Plan the day", "Write down the three most important things you want to finish. It takes two minutes and saves hours of drifting."],
    ],
    outro: "Consistency matters more than length. Keep it short enough to repeat every day.",
  },
  {
    slug: "desk-setup-ideas",
    title: "Desk setup ideas for a productive workspace",
    cat: "style",
    lead: "If you work from home, your desk is your office. A few simple changes can make it more comfortable and a lot more pleasant to sit at.",
    sections: [
      ["Get the basics right", "Place your monitor at eye level, keep your keyboard close and sit with your feet flat. Natural light from the side is better than from behind or in front."],
      ["Cable and clutter control", "Use a cable tray or clips to hide wires, and keep only daily-use items on the desk. A tidy surface helps a tidy mind."],
      ["Add a personal touch", "A small plant, a warm lamp and one framed photo make the space feel like yours without distracting you."],
    ],
    outro: "Invest in a good chair first. Everything else can come later.",
  },
  {
    slug: "personal-style-finding",
    title: "Finding your personal style",
    cat: "style",
    lead: "Personal style is not about trends. It is about choosing clothes and things that feel like you, and learning to say no to the rest.",
    sections: [
      ["Look for patterns", "Save photos of outfits and rooms you love. After a few weeks, look for repeating colours, shapes and textures. That is your style showing up."],
      ["Experiment slowly", "Try one new thing at a time, such as a different colour, a new silhouette or a pattern. Keep what feels natural."],
      ["Ignore the noise", "Trends will come and go. If you love it and feel comfortable in it, it is in style."],
    ],
    outro: "The best style is the one that makes you forget what you are wearing.",
  },
  {
    slug: "small-space-living",
    title: "Smart ideas for living in a small space",
    cat: "style",
    lead: "A small flat can feel spacious and comfortable. The secret is to make every item earn its place.",
    sections: [
      ["Go vertical", "Use tall shelves, wall hooks and hanging planters to free the floor. Looking up instead of across makes the room feel taller."],
      ["Choose multi-purpose furniture", "A bed with storage, a foldable dining table and an ottoman with a lid hold things without taking extra space."],
      ["Use light and mirrors", "Light curtains, a large mirror opposite a window and light wall colours reflect light and open up the room."],
    ],
    outro: "Keep surfaces clear and the space will always feel bigger than it is.",
  },

  // ───────────── culture ─────────────
  {
    slug: "indian-festivals-explained",
    title: "Indian festivals and what they celebrate",
    cat: "culture",
    lead: "India has a festival for almost every week of the year. Behind the colour and the sweets, each one tells an old story about people and seasons.",
    sections: [
      ["Diwali and Holi", "Diwali, the festival of lights, celebrates the victory of light over darkness with lamps, rangoli and sweets. Holi welcomes spring with colour and laughter."],
      ["Eid, Christmas and Gurpurab", "India shares its celebrations across faiths. Eid marks the end of Ramadan, Christmas fills cities with lights and Gurpurab honours the Sikh Gurus with prayers and community meals."],
      ["Regional favourites", "Onam in Kerala, Pongal in Tamil Nadu, Durga Puja in Bengal and Ganesh Chaturthi in Maharashtra each have their own food, music and rituals."],
    ],
    outro: "If you are invited to one, accept. It is the best way to understand what it means to people.",
  },
  {
    slug: "why-reading-still-matters",
    title: "Why reading still matters in 2026",
    cat: "culture",
    lead: "In a world of short videos and endless scrolling, a book is a quiet act of rebellion. It trains the one skill that matters most: attention.",
    sections: [
      ["Depth over speed", "Books let ideas develop slowly. You follow an argument or a character for hours, and that builds patience and empathy."],
      ["How to build the habit", "Start with ten pages a day and read what you enjoy, not what you think you should. Keep a book next to your bed and your phone in another room."],
      ["Mix formats", "Print, e-books and audiobooks all count. Use audiobooks for commutes and print for evenings."],
    ],
    outro: "Reading is not about finishing more books. It is about spending more time inside good ideas.",
  },
  {
    slug: "classical-music-intro",
    title: "A gentle introduction to Indian classical music",
    cat: "culture",
    lead: "Indian classical music can seem difficult at first, but you only need a little curiosity and a calm evening to begin enjoying it.",
    sections: [
      ["Ragas and moods", "A raga is a set of notes with its own mood and often a time of day. Morning ragas feel fresh and hopeful, and night ragas are deep and thoughtful."],
      ["Where to begin", "Start with short pieces on the sitar, bansuri or sarod before trying long concerts. Many great artists have shorter recordings that are perfect for beginners."],
      ["How to listen", "Play it while you work or cook. Notice how the artist builds slowly, then speeds up. The patterns start to make sense without effort."],
    ],
    outro: "There is no right way to listen. Let the music do the work.",
  },
  {
    slug: "art-of-storytelling",
    title: "The art of storytelling",
    cat: "culture",
    lead: "Stories are the oldest technology we have. They help us remember, persuade and feel connected to each other.",
    sections: [
      ["The basics", "Every good story has a character who wants something and an obstacle in the way. The rest is about what they do, and what it costs."],
      ["Be specific", "The colour of a door, a smell in the kitchen or a phrase someone always said make a story real. Details beat general descriptions every time."],
      ["Practise out loud", "Tell stories to friends and watch their faces. You will quickly learn where you lose them and where they lean in."],
    ],
    outro: "Cut anything that does not move the story forward. What is left is the story.",
  },
  {
    slug: "regional-cinema-india",
    title: "Beyond Bollywood: exploring regional cinema",
    cat: "culture",
    lead: "India makes films in dozens of languages, and some of the most inventive stories are told outside Hindi cinema.",
    sections: [
      ["Malayalam and Tamil", "Malayalam cinema is known for grounded, character-driven stories, while Tamil films often mix mass entertainment with sharp social comment."],
      ["Bengali and Marathi", "From Satyajit Ray's classics to modern thrillers, Bengali film has a rich history. Marathi cinema is full of warm, human stories."],
      ["How to watch", "Most streaming apps now offer subtitles for regional films. Start with one highly rated title in a language you do not know."],
    ],
    outro: "You will find that great stories need no translation.",
  },
];

const html = (p) =>
  `<p>${p.lead}</p>` +
  p.sections.map(([h, t]) => `<h2>${h}</h2><p>${t}</p>`).join("") +
  `<p>${p.outro}</p>`;

const DAY = 24 * 60 * 60 * 1000;

const posts = raw.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  catSlug: p.cat,
  img: `https://picsum.photos/seed/${p.slug}/1200/700`,
  views: 40 + ((i * 53) % 460),
  desc: html(p),
  createdAt: new Date(Date.now() - (i * 3 + 1) * DAY),
}));

async function main() {
  await prisma.user.upsert({
    where: { email: USER_EMAIL },
    update: {},
    create: { email: USER_EMAIL, name: "Sudhanshu" },
  });

  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: { img: c.img }, create: c });
  }

  await prisma.post.deleteMany({ where: { slug: { in: RETIRED_SLUGS } } });

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        desc: p.desc,
        img: p.img,
        catSlug: p.catSlug,
        createdAt: p.createdAt,
      },
      create: { ...p, userEmail: USER_EMAIL },
    });
  }
  console.log(`Seeded ${categories.length} categories and ${posts.length} posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
