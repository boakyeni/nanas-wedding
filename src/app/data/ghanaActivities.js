// Simple data-only JS you can extend anytime.

export const ghanaActivities = [

    {
        slug: "cute-brunch-spots",
        title: "Cute Brunch Spots",
        subtitle: "Cozy cafés & brunchables",
        image: "/brunch-hero.webp",
        tags: ["Food", "Brunch"],
        area: "Accra",
        // 👇 NEW: if an activity has a `locations` array, we treat it as a collection
        locations: [
            {
                id: "breakfast-to-breakfast",
                name: "Breakfast to Breakfast",
                area: "Osu, Accra",
                image: "/b2b.jpg",
                blurb: "All-day breakfast with a lively vibe. Pancakes, shakshuka, strong coffee.",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Breakfast to Breakfast Osu", appleUrl: "https://maps.apple.com/place?address=Dr.%20Esther%20Ocloo%20Street,%20Accra,%20Ghana&coordinate=5.561964,-0.182483&name=Breakfast%20to%20Breakfast&place-id=I17C0B171D0B5B826&map=h", googleUrl: "https://maps.app.goo.gl/XvrcAdzNFme5yNTM8?g_st=ipc" },
                tags: ["Casual", "English Breakfast"],
                costs: [{ label: "Avg. meal", amount: "$$" }],
                bestTime: "Weekends 10–12 am (go early).",
                links: [
                    { label: "Instagram", url: "https://www.instagram.com/breakfasttobreakfast_ghana?igsh=NTc4MTIwNjQ2YQ==" }
                ]
            },
            {
                id: "jamestown-coffee",
                name: "Jamestown Coffee Company",
                area: "Osu, Accra",
                image: "/jc.jpeg",
                blurb: "High ceilings, large, beautiful art on the walls, and bags of locally sourced Ghanaian coffee on display in the back",
                coordinates: { lat: 5.637, lng: -0.1733, label: "Village Market Café", appleUrl: "https://maps.apple.com/place?address=Osu%20Close,%20Accra,%20Ghana&coordinate=5.560744,-0.171644&name=Jamestown%20Coffee%20Company&place-id=IDD60362268AFDA7C&map=h", googleUrl: "https://maps.app.goo.gl/A4PZvnsaX76VghwD6" },
                tags: ["Coffee", "English Breakfast"],
                costs: [{ label: "Avg. meal", amount: "$$" }],
                bestTime: "Anyday 11am",
                links: [{ label: "Instagram", url: "https://www.instagram.com/jamestowncoffeegh?igsh=NTc4MTIwNjQ2YQ==" }]
            },
            {
                id: "rose-garden",
                name: "Rosé Garden",
                area: "Labone, Accra",
                image: "/rg.jpg",
                blurb: "Minimalist bistro, Ghanian-fusion brunch plates, calm ambience.",
                coordinates: { lat: 5.617, lng: -0.184, label: "Rosé Garden", googleUrl: "https://maps.app.goo.gl/w2CuPsHCThvspeo4A" },
                tags: ["Calm", "Fusion", "English Breakfast"],
                costs: [{ label: "Avg. meal", amount: "$$" }],
                bestTime: "Sundays after 11 am.",
                links: [{ label: "Instagram", url: "https://www.instagram.com/rosegardengh/?hl=en" }]
            },
            {
                id: "kempinski",
                name: "Kempinski",
                area: "Gold Coast City, Accra",
                image: "/kp.jpg",
                phone: "+233 54 431 2725",
                blurb: "Luxury Sunday Brunch. Call before arriving. Dress Code enforced.",
                coordinates: { lat: 5.617, lng: -0.184, label: "Kempinski", googleUrl: "https://maps.app.goo.gl/XhuywoXJe29xzfCU9" },
                tags: ["Calm", "English Breakfast", "Luxury"],
                costs: [{ label: "Avg. meal", amount: "$$$$" }],
                bestTime: "Sundays",
                links: [{ label: "Website", url: "https://www.kempinski.com/en/hotel-gold-coast-city/restaurants-bars/culinary-highlights" }]
            }
        ]
    },
    {
        slug: "dinner",
        title: "Dinner in Town",
        subtitle: "Western, Fusion, and Ghanaian Food",
        image: "/dinner-hero.webp",
        tags: ["Food", "Dinner"],
        area: "Accra",
        // 👇 NEW: if an activity has a `locations` array, we treat it as a collection
        locations: [
            {
                id: "skybar",
                name: "Sky Bar 25 Restaurant and Bar",
                area: "Spintex, Accra",
                image: "/skybar-accra-two.jpg",
                blurb: "Dining on the highest rooftop in Accra",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Skybar", googleUrl: "https://maps.app.goo.gl/4iFo1kJocbCnmjx9A" },
                tags: ["Luxury", "Bar", "Western"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                bestTime: "Call in advance",
                links: [
                ]
            },
            {
                id: "starbitesx",
                name: "Starbites X",
                area: "Cantoments",
                image: "/starbitesx.jpeg",
                blurb: "",
                tags: ["Western", "Ghanaian", "Bar"],
                costs: [{ label: "Avg. meal", amount: "$$" }],
                bestTime: "Anytime",
                phone: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/starbitesx/?hl=en" }]
            },

            {
                id: "honeysuckle",
                name: "The Honeysuckle Pub & Restaurant",
                area: "Multiple Locations",
                image: "/hs.png",
                blurb: "Popular Bar and Restaurant chain with multiple locations across Accra. Great for modern local or western food",

                tags: ["Western", "Ghanaian", "Bar"],
                costs: [{ label: "Avg. meal", amount: "$$" }],
                bestTime: "Anytime",
                phone: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/the.honeysuckle/?hl=en" }]
            },
            {
                id: "treehouse",
                name: "Treehouse Restaurant",
                area: "Osu, Accra",
                image: "/tr.webp",
                blurb: "Al fresco Dining",
                coordinates: { lat: 5.617, lng: -0.184, label: "Treehouse", googleUrl: "https://maps.app.goo.gl/8GshVqbMyouuxoe46" },
                tags: ["Fusion", "Western", "Bar"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                phone: "",
                bestTime: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/treehousegh/?hl=en" }]
            },
            {
                id: "afrikiko",
                name: "Afrikiko",
                area: "Cantoments, Accra",
                image: "/afrikiko.webp",
                phone: "+233542554286",
                blurb: "",
                coordinates: { lat: 5.617, lng: -0.184, label: "afrikiko", googleUrl: "https://maps.app.goo.gl/aq2nUaUWmEBDfGcSA" },
                tags: ["Western", "Fusion"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                bestTime: "",
                links: []
            },
            {
                id: "nsuomnam",
                name: "Nsuomnam",
                area: "Cantoments, Accra",
                image: "/nsuo.jpg",
                phone: "+233257006040",
                blurb: "Reservations required call ahead",
                coordinates: { lat: 5.617, lng: -0.184, label: "nsuomnam", googleUrl: "https://maps.app.goo.gl/aH9agkwvQ4jiXbef6" },
                tags: ["Seafood"],
                costs: [{ label: "Avg. meal", amount: "$$$$" }],
                bestTime: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/nsuomnam.gh/?hl=en" }]
            },
            {
                id: "pokihouse",
                name: "Poki House Lounge and Restaurant",
                area: "Cantoments, Accra",
                image: "/poki.webp",
                phone: "+233303941530",
                blurb: "Japanese",
                coordinates: { lat: 5.617, lng: -0.184, label: "nsuomnam", googleUrl: "https://maps.app.goo.gl/Hrqw1o2Y4GKMPgPn7" },
                tags: ["Asian"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                bestTime: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/pokihouseofficial/?hl=en" }]
            }, {
                id: "ayewamu",
                name: "Ayewamu",
                area: "Achimota, Accra",
                image: "/ayewamu.jpg",
                phone: "+233593033898",
                blurb: "",
                coordinates: { lat: 5.617, lng: -0.184, label: "ayewamu", googleUrl: "https://maps.app.goo.gl/TuxnXu7NZ37v3z2i7" },
                tags: ["Ghanaian"],
                costs: [{ label: "Avg. meal", amount: "$$" }],
                bestTime: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/ayewamu__byjane/?hl=en" }]
            },
            {
                id: "jamestown-kenke",
                name: "Jamestown Kenke",
                area: "Jamestown, Accra",
                image: "/ayewamu.jpg",
                phone: "+233593033898",
                blurb: "",
                coordinates: { lat: 5.617, lng: -0.184, label: "ayewamu", googleUrl: "https://maps.app.goo.gl/2m7zMmWGihF6cCXt6" },
                tags: ["Ghanaian"],
                costs: [{ label: "Avg. meal", amount: "$$" }],
                bestTime: "",
                links: []
            },
            {
                id: "sefofo",
                name: "Sefofo",
                area: "Dzorwulu, Accra",
                image: "/ayewamu.jpg",
                phone: "+233554177031",
                blurb: "",
                coordinates: { lat: 5.617, lng: -0.184, label: "ayewamu", googleUrl: "https://maps.app.goo.gl/Sv64cCGb6gQ9taJw5" },
                tags: ["Ghanaian"],
                costs: [{ label: "Avg. meal", amount: "$$" }],
                bestTime: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/sefofo.rlg/?hl=en" }]
            },
            {
                id: "bella-afrik",
                name: "Bella Afrik",
                area: "Cantoments, Accra",
                image: "/baf.jpg",
                phone: "+233208931481",
                blurb: "",
                coordinates: { lat: 5.617, lng: -0.184, label: "bella Afrik", googleUrl: "https://maps.app.goo.gl/HCi65a3dZAyVFe478" },
                tags: ["Western"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                bestTime: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/bellaafrik_restaurant/?hl=en" }]
            },
            {
                id: "hayven",
                name: "The Hayven",
                area: "East Legon, Accra",
                image: "/hayven.jpg",
                phone: "+233509217994",
                blurb: "Call for reservation",
                coordinates: { lat: 5.617, lng: -0.184, label: "bella Afrik", googleUrl: "https://maps.app.goo.gl/HCi65a3dZAyVFe478" },
                tags: ["Western"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                bestTime: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/thehayvingh/?hl=en" }]
            }]
    },
    {
        slug: "site-seeing",
        title: "Sightseeing",
        subtitle: "Must See spots",
        image: "/site-hero.webp",
        tags: ["History", "Tourism"],
        area: "Accra",
        // 👇 NEW: if an activity has a `locations` array, we treat it as a collection
        locations: [
            {
                id: "nkrumah",
                name: "Kwame Nkrumah Museum",
                area: "Accra",
                image: "/nkrumah.jpg",
                blurb: "Cash Only. History museum of Ghana's first president and revolutionary leader.",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Kwame Nkrumah National Park", googleUrl: "https://maps.app.goo.gl/H6R3ikF7sqesz6cx6" },
                tags: ["History", "Museum"],
                costs: [{ label: "Admission", amount: '$' }],
                bestTime: "Call in advance",
                phone: " +233 24 696 7792",
                links: [{ label: "Website", url: "https://knmp.gov.gh/" }
                ]
            },
            {
                id: "noldor",
                name: "Noldor Artist Residency",
                area: "Osu, Accra",
                image: "/noldor.jpg",
                blurb: "Independent artist residency showcasing contemporary African art",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Kwame Nkrumah National Park", googleUrl: "https://maps.app.goo.gl/s2f76YwM8vve5Jpw9" },
                tags: ["Art", "Museum"],
                costs: [{ label: "Donation Based", amount: 5 }, { label: "Art Pieces", amount: "$$$$" }],
                bestTime: "Call in advance",
                phone: "+233506732351",
                links: [{ label: "Instagram", url: "https://www.instagram.com/thenoldorresidency?igsh=NTc4MTIwNjQ2YQ==" }, { label: "Website", url: "https://noldorresidency.com/" }]
            },
            {
                id: "independence-square",
                name: "Independence Square",
                area: "Osu, Accra",
                image: "/blackstar.webp",
                blurb: "Al fresco Dining",
                coordinates: { lat: 5.617, lng: -0.184, label: "Black Star", googleUrl: "https://maps.app.goo.gl/82iWVFDC32chACUX6" },
                tags: ["Landmark"],
                costs: [],
                phone: "",
                bestTime: "",
                links: []
            },
            {
                id: "aburi",
                name: "Aburi Botanical Gardens",
                area: "Aburi",
                image: "/aburi-gardens.webp",
                phone: "+233 20 900 6449",
                blurb: "",
                coordinates: { lat: 5.617, lng: -0.184, label: "aburi", googleUrl: "https://maps.app.goo.gl/Gaj3vuiRR92EAuiz9" },
                tags: ["Natural History"],
                costs: [{ label: "Avg. meal", amount: "$" }],
                bestTime: "",
                links: [{ label: "Instagram", url: "https://www.instagram.com/aburibotanicalgarden/?hl=en" }]
            },
            {
                id: "cape-coast-castle",
                name: "Cape Coast Castle",
                subtitle: "Powerful history on Ghana’s coast",
                image: "/Nana_Prempeh_Cape_Coast.jpg",
                tags: ["History", "UNESCO"],
                area: "Cape Coast (Central Region)",
                coordinates: { lat: 5.1053, lng: -1.2466, label: "Cape Coast Castle", googleUrl: "https://maps.app.goo.gl/mZM8kxnFA5eoUa34A" },
                blurb:
                    "A moving tour through the dungeons and Door of No Return. Expect emotional context on the trans-Atlantic slave trade.",
                costs: [
                    { label: "Guided tour", amount: 80, per: "per adult (local rates vary)" },
                    { label: "Camera fee", amount: 20 },
                ],
                transport: [
                    { mode: "Hire Driver", advice: "Best for day-trip from Accra, ~3.5 hrs each way." },
                    { mode: "Bus", advice: "STC bus to Cape Coast, then taxi to the castle." },
                    { mode: "Taxi", advice: "From Cape Coast station to the castle, ₵20–₵40." },
                ],
                bestTime: "Morning tours (9–11am). Avoid peak heat 12–3pm.",
                links: [
                    { label: "Ghana Museums & Monuments", url: "https://www.ghanamuseums.org/cape-coast-castle.php" },
                    { label: "Tripadvisor", url: "https://www.tripadvisor.com/Attraction_Review-g303866-d480603-Reviews-Cape_Coast_Castle-Cape_Coast_Central_Region.html" },
                ],
            },

        ]
    },
    {
        slug: "shopping",
        title: "Places to Shop",
        subtitle: "Where to buy",
        image: "/shopping-hero.jpg",
        tags: ["Shopping"],
        area: "Accra",
        // 👇 NEW: if an activity has a `locations` array, we treat it as a collection
        locations: [
            {
                id: "woodin",
                name: "Woodin",
                area: "Mutiple Location",
                image: "/woodin.jpg",
                blurb: "",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Kwame Nkrumah National Park", googleUrl: "https://maps.app.goo.gl/VoBp4rGSWe5KddqD6" },
                tags: ["Material", "Fixed Price"],
                costs: [{ label: "Avg. Price", amount: "$$$", per: "yard" }],
                bestTime: "Call in advance",
                phone: "+233302823066",
                links: [{ label: "Website", url: "https://woodinfashion.com/" }, { label: "Instagram", url: "https://www.instagram.com/woodinfashion/" }
                ]
            },
            {
                id: "vlisco",
                name: "Vlisco",
                area: "Accra Mall",
                image: "/vlisco.jpg",
                blurb: "Vlisco is known for its unique printed fabrics",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Vlisco", googleUrl: "https://maps.app.goo.gl/WEDXbi6AYGYC1dTs5" },
                tags: ["Material", "Fixed Price"],
                costs: [{ label: "Avg. Price", amount: "$$$", per: "yard" }],
                bestTime: "Call in advance",
                phone: "+233302900437",
                links: [{ label: "Instagram", url: "https://www.instagram.com/vlisco?igsh=NTc4MTIwNjQ2YQ==" }, { label: "Website", url: "https://vlisco.com/" }]
            }
        ]
    },
    {
        slug: "local-souvenir",
        title: "Local Souvenirs",
        subtitle: "Where to buy",
        image: "/carvings.jpg",
        tags: ["Shopping"],
        area: "Accra",
        // 👇 NEW: if an activity has a `locations` array, we treat it as a collection
        locations: [
            {
                id: "art-center",
                name: "Art Center",
                area: "Makola, Accra",
                image: "/artcenter.jpg",
                blurb: "",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Art Center", googleUrl: "https://maps.app.goo.gl/DECJEHpNTgm5By8d7" },
                tags: ["Material", "Negotiable Prices"],
                costs: [{ label: "Avg. Price", amount: "$", per: "yard" }, { label: "Avg. Price", amount: "$ - $$", per: "art price" }],
                bestTime: "Midday",
                links: []
            },
            {
                id: "oxford",
                name: "Oxford Street",
                area: "Osu, Accra",
                image: "/oxfordst.webp",
                blurb: "Independent artist residency showcasing contemporary African art",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Oxford Street", googleUrl: "https://maps.app.goo.gl/urnexSiXc2N64eHN6" },
                tags: ["Material", "Negotiable Prices"],
                costs: [],
                bestTime: "Midday",
                links: []
            },

        ]
    },
    {
        slug: "nightlife",
        title: "NightLife",
        subtitle: "Where to party",
        image: "/nightlife.jpg",
        tags: ["Nightlife"],
        area: "Accra",
        // 👇 NEW: if an activity has a `locations` array, we treat it as a collection
        locations: [
            {
                id: "garage",
                name: "Garage",
                area: "East Legon, Accra",
                image: "/garage.jpg",
                blurb: "Open for Detty December only",
                phone: "+233 55 149 4573",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Art Center", googleUrl: "https://maps.app.goo.gl/dJcTp1UqP3u7yjqr6" },
                tags: ["Clubbing"],
                costs: [{ label: "Avg. Price", amount: "$$$", per: "person" }],
                bestTime: "Late Night",
                links: [{ label: "Instagram", url: "https://www.instagram.com/garage_ghana/?hl=en" }]
            },
            {
                id: "mad",
                name: "Mad Club",
                area: "East Legon, Accra",
                image: "/mad.webp",
                blurb: "Independent artist residency showcasing contemporary African art",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Oxford Street", googleUrl: "https://maps.app.goo.gl/rsjrF1hCfzUkZ1CW8" },
                tags: ["Clubbing"],
                costs: [],
                bestTime: "Late Night",
                links: [{ label: "Instagram", url: "https://www.instagram.com/madclubghana/?hl=en" }]
            },
            {
                id: "twist",
                name: "Twist",
                area: "East Legon, Accra",
                image: "/twist.webp",
                blurb: "Independent artist residency showcasing contemporary African art",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Oxford Street", googleUrl: "https://maps.app.goo.gl/3WErkgJETetMmEAf7" },
                tags: ["Clubbing"],
                costs: [],
                bestTime: "Late Night",
                links: [{ label: "Instagram", url: "https://www.instagram.com/twistgh/?hl=en" }]
            },
            {
                id: "labadi-beach",
                name: "Labadi Beach",
                subtitle: "Live music, horses & sunset",
                image: "/labadi_beach.jpeg",
                tags: ["Beach"],
                area: "La, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "Labadi Beach", googleUrl: "https://maps.app.goo.gl/U7CHHRYhUPaxJVMb6" },
                blurb:
                    "Accra’s most famous beach. Weekends bring music and dancing; weekday sunsets are calmer. Expect entry fee and vendors.",
                costs: [
                    { label: "Entry", amount: 10, per: "per person" },
                    { label: "Chair & umbrella", amount: 40 },
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Weekdays before sunset for chill; weekends for energy.",
                links: [{ label: "Google Maps", url: "https://maps.google.com/?q=Labadi%20Beach" }],
            },
            {
                id: "sandbox",
                name: "Sandbox Beach Club",
                subtitle: "",
                image: "/sandbox.webp",
                tags: ["Beach", "Lounge"],
                area: "La, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "Sandbox Beach Club", googleUrl: "https://maps.app.goo.gl/mK88vrwcVCW2wVCS7" },
                blurb:
                    "Beach lounge. Reservation required. Dress code enforced.",
                costs: [
                    { label: "Reservation", amount: 250, per: "per person" },
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Before sunset for the beach. They close access to the beach after sunset.",
                phone: "+233277818105",
                links: [{ label: "Instagram", url: "https://www.instagram.com/sandboxbc?igsh=NTc4MTIwNjQ2YQ==" }],
            },
            {
                id: "purplepub",
                name: "Purple Pub",
                image: "/purplepub.jpeg",
                tags: ["Local"],
                area: "La, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "Purple Pub", googleUrl: "https://maps.app.goo.gl/73FwkBh2uf1g2jdi7" },
                blurb:
                    "Local Bar. Get their five fingers drink",
                costs: [
                    {},
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Late Night",
                links: [{ label: "Instagram", url: "https://www.instagram.com/purple_pub_osu?igsh=NTc4MTIwNjQ2YQ==" }],
            },
            {
                id: "frontback",
                name: "Front/Back",
                image: "/frontback.webp",
                tags: ["Bar"],
                area: "La, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "Front Back", googleUrl: "https://maps.app.goo.gl/DGznjZQHarabD1Cj8" },
                blurb:
                    "",
                costs: [
                    {},
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Late Night",
                links: [{ label: "Instagram", url: "https://www.instagram.com/frontbackaccra/?hl=en=" }, { label: "Website", url: "https://www.frontbackaccra.com/" }],
            },
            {
                id: "exhale",
                name: "Exhale Lounge",
                image: "/exhale.webp",
                tags: ["Lounge"],
                area: "East Legon, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "Exhale", googleUrl: "https://maps.app.goo.gl/Dd4DnD2YkPjcmWLx9" },
                blurb:
                    "",
                costs: [
                    {},
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Late Night",
                links: [{ label: "Instagram", url: "https://www.instagram.com/exhalegh/?hl=en" }, { label: "Website", url: "https://www.exhaleloungeghana.com/" }],
            },
            {
                id: "ace",
                name: "Ace Nightclub",
                image: "/ace.webp",
                tags: ["Clubbing"],
                area: "Labone, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "Ace", googleUrl: "https://maps.app.goo.gl/DJ6HK4Q3cCtCxUv66" },
                blurb:
                    "",
                costs: [
                    {},
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Late Night",
                links: [{ label: "Instagram", url: "https://www.instagram.com/acenightclubgh/?hl=en" }],
            },
            {
                id: "republic",
                name: "Republic Bar & Grill",
                image: "/republic.jpeg",
                tags: ["Local"],
                area: "Osu, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "Ace", googleUrl: "https://maps.app.goo.gl/wVUYLe9fQURaD7vw6" },
                blurb:
                    "",
                costs: [
                    {},
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Late Night",
                links: [{ label: "Instagram", url: "https://www.instagram.com/republicbarghana/?hl=en" }],
            },
                        {
                id: "barx",
                name: "Bar X",
                image: "/barx.jpg",
                tags: ["Food & Drink"],
                area: "Cantoments, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "X", },
                blurb:
                    "Call in advance",
                costs: [
                    {},
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Late Night",
            },
            {
                id: "moodbar",
                name: "Mood Bar",
                image: "/moodbar.jpg",
                tags: ["Clubbing"],
                area: "Osu, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "X", googleUrl: "https://maps.app.goo.gl/EUrAFtMkhj73rEKB9" },
                blurb:
                    "Call in advance",
                costs: [
                    {},
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Late Night",
                phone: "+233599752007",
            },
            {
                id: "pera",
                name: "Pera Lounge",
                image: "/pera.webp",
                tags: ["Lounge"],
                area: "East Legon, Accra",
                coordinates: { lat: 5.5606, lng: -0.1358, label: "X", googleUrl: "https://maps.app.goo.gl/VRJ2k9HVVeHHzA8C9" },
                blurb:
                    "Call in advance",
                costs: [
                    {},
                ],
                transport: [
                    { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
                    { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
                    { mode: "Walking", advice: "Not recommended at night; use a ride service." },
                ],
                bestTime: "Late Night",
                phone: "+233201137130",
                links: [{ label: "Instagram", url: "https://www.instagram.com/peraloungegh?igsh=NTc4MTIwNjQ2YQ==" }],
            },
            {
                id: "skybar",
                name: "Sky Bar 25 Restaurant and Bar",
                area: "Spintex, Accra",
                image: "/skybar-accra-two.jpg",
                blurb: "Dining on the highest rooftop in Accra",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "Skybar", googleUrl: "https://maps.app.goo.gl/4iFo1kJocbCnmjx9A" },
                tags: ["Rooftop"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                bestTime: "Call in advance",
                links: [
                ]
            },
            {
                id: "induldge",
                name: "Indulge",
                area: "Cantoments, Accra",
                image: "/indulge.webp",
                blurb: "",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "indulgex", googleUrl: "https://maps.app.goo.gl/fPfdS73dfBrScFwr5" },
                tags: ["Rooftop"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                bestTime: "Call in advance",
                phone: "+233599707171",
                links: [{ label: "Instagram", url: "https://www.instagram.com/indulge_accra?igsh=NTc4MTIwNjQ2YQ==" }
                ]
            },
            {
                id: "enigma",
                name: "Enigma Sky Lounge",
                area: "Accra",
                image: "/enigma.jpg",
                blurb: "",
                coordinates: { lat: 5.5621525524955615, lng: -0.18244283233148673, label: "indulgex", googleUrl: "https://maps.app.goo.gl/pZhBAmL6SpRd4TwN6" },
                tags: ["Rooftop"],
                costs: [{ label: "Avg. meal", amount: "$$$" }],
                bestTime: "Call in advance",
                phone: "+233536806389",
                links: [{ label: "Instagram", url: "https://www.instagram.com/enigmaskylounge_gh/?hl=en" }
                ]
            },


        ]
    },

    // {
    //     slug: "labadi-beach",
    //     title: "Labadi Beach",
    //     subtitle: "Live music, horses & sunset",
    //     image: "/labadi_beach.jpeg",
    //     tags: ["Beach", "Nightlife"],
    //     area: "La, Accra",
    //     coordinates: { lat: 5.5606, lng: -0.1358, label: "Labadi Beach" },
    //     blurb:
    //         "Accra’s most famous beach. Weekends bring music and dancing; weekday sunsets are calmer. Expect entry fee and vendors.",
    //     costs: [
    //         { label: "Entry", amount: 50, per: "per person" },
    //         { label: "Chair & umbrella", amount: 40 },
    //     ],
    //     transport: [
    //         { mode: "Uber/Bolt", advice: "₵25–₵60 from Osu; confirm price before ride." },
    //         { mode: "Taxi", advice: "Agree fare upfront; carry small bills." },
    //         { mode: "Walking", advice: "Not recommended at night; use a ride service." },
    //     ],
    //     bestTime: "Weekdays before sunset for chill; weekends for energy.",
    //     links: [{ label: "Google Maps", url: "https://maps.google.com/?q=Labadi%20Beach" }],
    // }
]
