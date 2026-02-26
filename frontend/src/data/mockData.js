/**
 * MOCK DATA — replace with real API calls when backend is ready.
 */

import WhiteShirt from "../assets/ordercardimages/white shirt.png";
import Fabric from "../assets/ordercardimages/fabric.png";
import Gown from "../assets/ordercardimages/gown.png";
import Green from "../assets/ordercardimages/green.png";
import Kente from "../assets/ordercardimages/kente.png";
import Suit from "../assets/ordercardimages/suit.png";
import WeddingGown from "../assets/ordercardimages/wedding gown.png";

export const currentUser = {
  id: "usr_001",
  name: "Grace Adebayo",
  role: "Designer",
  avatar: null,
};

export const dashboardStats = [
  { id: "active_orders",  label: "Active Orders",    value: 6, icon: "orders", variant: "default" },
  { id: "due_this_week",  label: "Due This Week",    value: 3, icon: "clock",  variant: "warning" },
  { id: "completed",      label: "Completed",        value: 1, icon: "check",  variant: "success" },
  { id: "urgent_delayed", label: "Urgent / Delayed", value: 1, icon: "alert",  variant: "danger"  },
];

export const upcomingOrders = [
  { id: "ORD-003", client: "Fatima Audu",    description: "Elegant evening gown in emerald",      delivery: "Feb 20", deliveryDate: "2025-02-20", status: "Delayed"     },
  { id: "ORD-002", client: "David Mensah",   description: "Two-piece suit in navy blue",           delivery: "Feb 22", deliveryDate: "2025-02-22", status: "Assigned"    },
  { id: "ORD-001", client: "Amara Okonkwo",  description: "Custom Aso-Oke Agbada",                delivery: "Feb 25", deliveryDate: "2025-02-25", status: "In Progress" },
  { id: "ORD-006", client: "Amara Okonkwo",  description: "Casual linen shirt in off-white",       delivery: "Feb 28", deliveryDate: "2025-02-28", status: "Assigned"    },
  { id: "ORD-004", client: "Chioma Eze",     description: "Contemporary Ankara jumpsuit",          delivery: "Mar 1",  deliveryDate: "2025-03-01", status: "In Progress" },
];

export const aiAlerts = {
  deadlineRisk:    { summary: "You have 3 orders due this week. ORD-003 for Fatima Audu is currently delayed due to fabric availability. Consider prioritizing this order." },
  workloadSummary: { summary: "6 active orders across 6 clients. Your current workload is moderate." },
};

export const allOrders = [
  {
    id: "ORD-001",
    clientId: "cli_001",
    client: "Amara Okonkwo",
    description: "Custom Aso-Oke Agbada with intricate embroidery for a traditional wedding ceremony",
    notes: "Client prefers gold thread embroidery",
    delivery: "Feb 25, 2026",
    deliveryDate: "2026-02-25",
    placedDate: "2026-02-10",
    status: "In Progress",
    image: Fabric,
  },
  {
    id: "ORD-002",
    clientId: "cli_002",
    client: "David Mensah",
    description: "2 piece suit in navy blue Italian wool",
    notes: "Slim fit preferred, peak lapel",
    delivery: "Feb 22, 2026",
    deliveryDate: "2026-02-22",
    placedDate: "2026-02-05",
    status: "Assigned",
    image: Suit,
  },
  {
    id: "ORD-003",
    clientId: "cli_003",
    client: "Fatimah Audu",
    description: "Elegant evening gown with Emerald silk",
    notes: "Halter neck, no sleeves, floor length",
    delivery: "Feb 20, 2026",
    deliveryDate: "2026-02-20",
    placedDate: "2026-02-01",
    status: "Delayed",
    image: Green,
  },
  {
    id: "ORD-004",
    clientId: "cli_004",
    client: "Chioma Eze",
    description: "Contemporary Ankara jumpsuit with cape details",
    notes: "Bold print, wide leg, cape attached at shoulders",
    delivery: "Mar 1, 2026",
    deliveryDate: "2026-03-01",
    placedDate: "2026-02-08",
    status: "In Progress",
    image: Gown,
  },
  {
    id: "ORD-005",
    clientId: "cli_005",
    client: "Kwame Asante",
    description: "Traditional Kente cloth with modern fit",
    notes: "Kente strip pattern, fitted through chest",
    delivery: "Feb 18, 2026",
    deliveryDate: "2026-02-18",
    placedDate: "2026-01-28",
    status: "Completed",
    image: Kente,
  },
  {
    id: "ORD-006",
    clientId: "cli_001",
    client: "Amara Okonkwo",
    description: "Casual linen shirt in off-white with mandarin collar",
    notes: "Breathable fabric, relaxed fit",
    delivery: "Feb 28, 2026",
    deliveryDate: "2026-02-28",
    placedDate: "2026-02-10",
    status: "Assigned",
    image: WhiteShirt,
  },
    {
      id: "ORD-007",
      clientId: "cli_006",
      client: "Ngozi Adichie",
      description: "Bridal train dress in ivory satin with lace overlay",
      notes: "Cathedral train, lace bodice, A-line skirt",
      delivery: "Mar 8, 2026",
      deliveryDate: "2026-03-08",
      placedDate: "2026-02-12",
      status: "In Progress",
      image: WeddingGown,
    },
  ];

export const navLinks = [
  { id: "dashboard",     label: "Dashboard",       icon: "dashboard" },
  { id: "orders",        label: "Orders",          icon: "orders"    },
  { id: "clients",       label: "Clients",         icon: "clients"   },
  { id: "network",       label: "Artisan Network", icon: "network"   },
  { id: "notifications", label: "Notifications",   icon: "bell"      },
  { id: "settings",      label: "Settings",        icon: "settings"  },
];

export const clients = [
  {
    id: "cli_001",
    clientId: "CLT-001",
    name: "Amara Okonkwo",
    email: "amara@email.com",
    phone: "+234 808 333 4567",
    orderCount: 2,
    lastOrder: "February 16, 2026",
    lastOrderShort: "Feb 16",
    measurements: { chest: 42, waist: 36, hip: 40, shoulder: 18, sleeve: 25, length: 62 },
  },
  {
    id: "cli_002",
    clientId: "CLT-002",
    name: "David Mensah",
    email: "david@email.com",
    phone: "+233 8083 3345 67",
    orderCount: 1,
    lastOrder: "February 12, 2026",
    lastOrderShort: "Feb 12",
    measurements: { chest: 40, waist: 34, hip: 40, shoulder: 17, sleeve: 26, length: 44 },
  },
  {
    id: "cli_003",
    clientId: "CLT-003",
    name: "Fatimah Audu",
    email: "fatimaa@email.com",
    phone: "+971 50 8333 4567",
    orderCount: 1,
    lastOrder: "February 5, 2026",
    lastOrderShort: "Feb 5",
    measurements: { chest: 34, waist: 26, hip: 36, shoulder: 14, sleeve: 22, length: 40 },
  },
  {
    id: "cli_004",
    clientId: "CLT-004",
    name: "Chioma Eze",
    email: "chiomaeze@email.com",
    phone: "+234 704 333 4567",
    orderCount: 1,
    lastOrder: "February 14, 2026",
    lastOrderShort: "Feb 14",
    measurements: { chest: 35, waist: 27, hip: 37, shoulder: 14, sleeve: 23, length: 41 },
  },
  {
    id: "cli_005",
    clientId: "CLT-005",
    name: "Kwame Asante",
    email: "kwame@email.com",
    phone: "+233 808 7654 567",
    orderCount: 1,
    lastOrder: "February 1, 2026",
    lastOrderShort: "Feb 1",
    measurements: { chest: 42, waist: 36, hip: 42, shoulder: 18, sleeve: 27, length: 46 },
  },
  {
    id: "cli_006",
    clientId: "CLT-006",
    name: "Ngozi Adichie",
    email: "ngozi@email.com",
    phone: "+234 784 3354 413",
    orderCount: 1,
    lastOrder: "February 8, 2026",
    lastOrderShort: "Feb 8",
    measurements: { chest: 33, waist: 25, hip: 35, shoulder: 13, sleeve: 22, length: 39 },
  },
];
