
/* ── Artisan Network Data ─────────────────────────────────────── */
export const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

export const NETWORK_CATEGORIES = [
  "Traditional & Cultural Specialists",
  "Accessories & Leather Goods",
  "Garment Construction & Sewing",
  "Embellishment & Surface Decoration",
  "Textile & Fabric Creation",
  "Sustainability & Ethical Production Roles",
  "Specialty & Niche Crafts",
  "Equipment & Structural Artisans",
];

export const EXPERIENCE_LEVELS = [
  { id: "beginner",     label: "Beginner (0-2 years)"  },
  { id: "intermediate", label: "Intermediate (3-5 years)" },
  { id: "advance",      label: "Advance (6-10 years)"  },
  { id: "expert",       label: "Expert(10 years +)"    },
];

export const COLLAB_TYPES = [
  { id: "project",     label: "Project- based"        },
  { id: "longterm",    label: "Long Term Partnership" },
  { id: "contract",    label: "Contract Work"         },
  { id: "onetime",     label: "One-time gig"          },
];

export const artisans = [
  {
    id: "art_001",
    name: "Maria Adeife",
    role: "Aso-oke Weaver",
    location: "Lagos, Nigeria",
    rating: 4.9,
    experience: 10,
    experienceLevel: "expert",
    category: "Textile & Fabric Creation",
    collabTypes: ["project", "longterm"],
    skills: ["Hand-weave Aso-Oke fabric", "Produce intricate patterns and colors"],
    bio: "specialize in creating high-quality, hand woven ceremonial fabrics with strong cultural meaning and detailed craftsmanship.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&q=80",
    portfolio: [
      { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80", caption: "Handwoven Aso-Oke ceremonial fabric" },
      { img: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=300&fit=crop&q=80", caption: "Traditional wedding fabric set" },
      { img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop&q=80", caption: "Intricate pattern weaving" },
    ],
    reviews: [
      { name: "Kemi Ola", rating: 5, text: "Maria's fabric work is exceptional. Every thread is perfectly placed with cultural authenticity." },
      { name: "Bisi Adewale", rating: 5, text: "Outstanding quality and on time delivery. Will definitely work with her again." },
    ],
  },
  {
    id: "art_002",
    name: "Chima Ndukwe",
    role: "Shoemaker",
    location: "Aba Abia, Nigeria",
    rating: 4.6,
    experience: 12,
    experienceLevel: "expert",
    category: "Accessories & Leather Goods",
    collabTypes: ["project", "longterm"],
    skills: ["Making and repairing Shoes", "Custom & Specialized Work with leather"],
    bio: "specialize artisans who create and repair shoes to ensure they fit well, look good, and last long.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
    portfolio: [
      { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&q=80", caption: "Handmade brown leather personalized shoes" },
      { img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop&q=80", caption: "Men's Leather business, briefcase, laptop bag" },
      { img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop&q=80", caption: "Beautiful handmade well crafted bag" },
    ],
    reviews: [
      { name: "Osas Victor",   rating: 5, text: "Chima's handmade shoes are perfect. He brought my vision to life with credible attention to details" },
      { name: "Chioma Ahanna", rating: 4, text: "Chima's handmade bag are perfect. He brought my vision to life with credible attention to details" },
    ],
  },
  {
    id: "art_003",
    name: "Shirley Duru",
    role: "Couture Seamstress",
    location: "Abuja, Nigeria",
    rating: 4.9,
    experience: 6,
    experienceLevel: "advance",
    category: "Garment Construction & Sewing",
    collabTypes: ["project", "contract"],
    skills: ["Custom bridal and evening wear", "Beading, embroidery, and embellishments"],
    bio: "specializes on luxury, custom-made clothing.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&q=80",
    portfolio: [
      { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&q=80", caption: "Custom bridal gown with hand beading" },
      { img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=300&fit=crop&q=80", caption: "Evening wear with embellishments" },
      { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80", caption: "Luxury couture piece" },
    ],
    reviews: [
      { name: "Ada Obi", rating: 5, text: "Shirley's attention to detail is unmatched. My wedding dress was absolutely stunning." },
    ],
  },
  {
    id: "art_004",
    name: "Alice Andrew",
    role: "Corsetry Specialist",
    location: "Lagos, Nigeria",
    rating: 4.5,
    experience: 8,
    experienceLevel: "advance",
    category: "Equipment & Structural Artisans",
    collabTypes: ["project", "onetime"],
    skills: ["Waist training and body contouring pieces", "Boning and structural support techniques"],
    bio: "A corsetry specialist focuses on structured garments that shape and support the body.",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&q=80",
    portfolio: [
      { img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop&q=80", caption: "Custom structured corset" },
      { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&q=80", caption: "Body contouring waist piece" },
      { img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=300&fit=crop&q=80", caption: "Evening corset gown" },
    ],
    reviews: [
      { name: "Temi Lagos", rating: 5, text: "Alice created the perfect corset for my performance. Extremely comfortable yet stunning." },
      { name: "Ngozi E.", rating: 4, text: "Great craftsmanship and quick turnaround. Would recommend." },
    ],
  },
];
