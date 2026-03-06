import {
  BriefcaseBusinessIcon,
  Facebook,
  Github,
  Globe,
  Home,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Music,
  PenIcon,
  Radio,
  Rocket,
  Sparkles,
  Twitter,
  UserIcon,
  Utensils,
  Youtube,
} from "lucide-react";
import type { TCategory, TSubcategoryFilter } from "@/types";

export const footerLinks = [
  { name: "Home", href: "/home", external: false },
  { name: "About Us", href: "/", external: false },
  { name: "Help Center", href: "/", external: false },
  { name: "Blogs", href: "/", external: false },
  { name: "Contact Us", href: "/", external: false },
  { name: "Terms of Use", href: "/", external: false },
  { name: "Privacy Policy", href: "/", external: false },
];

export const user = [
  {
    name: "My profile",
    href: "/workspace/profile",
    icon: UserIcon,
  },
];

export const homeFilters: TCategory[] = [
  { label: "Restaurants", value: "restaurant", icon: Utensils },
  { label: "Housing", value: "house", icon: Home },
  { label: "Tourism", value: "tourism", icon: MapPin },
  { label: "Events", value: "entertainment", icon: Sparkles },
  { label: "Opportunities", value: "jobs", icon: BriefcaseBusinessIcon },
];

export const subcategoryFilters: Partial<Record<string, TSubcategoryFilter[]>> =
  {
    restaurant: [
      { label: "Bakery", value: "bakery" },
      { label: "Fast Food", value: "fast-food" },
      { label: "Dessert", value: "dessert" },
      { label: "Snacks", value: "snacks" },
      { label: "Drinks", value: "drinks" },
      { label: "Healthy", value: "healthy" },
      { label: "Meat & Grill", value: "meat-grill" },
    ],
    house: [
      { label: "Apartments", value: "apartments" },
      { label: "Studios", value: "studios" },
      { label: "Villas", value: "villas" },
      { label: "Office Space", value: "office-space" },
      { label: "Short Stay", value: "short-stay" },
    ],
    tourism: [
      { label: "Hotels", value: "hotels" },
      { label: "Safari", value: "safari" },
      { label: "Adventure", value: "adventure" },
      { label: "Culture", value: "culture" },
      { label: "Tours", value: "tours" },
      { label: "Camping", value: "camping" },
    ],
    entertainment: [
      { label: "Concerts", value: "concerts" },
      { label: "Festivals", value: "festivals" },
      { label: "Conferences", value: "conferences" },
      { label: "Exhibitions", value: "exhibitions" },
      { label: "Networking", value: "networking" },
    ],
    jobs: [
      { label: "Full-time", value: "full-time" },
      { label: "Part-time", value: "part-time" },
      { label: "Freelance", value: "freelance" },
      { label: "Internship", value: "internship" },
      { label: "Volunteer", value: "volunteer" },
      { label: "Training", value: "training" },
    ],
  };

export const myPostFilters = [
  {
    label: "Draft",
    value: "draft",
    icon: PenIcon,
  },
  {
    label: "Published",
    value: "published",
    icon: Rocket,
  },
];

export const SOCIAL_MEDIA_PLATFORMS = [
  { value: "twitter", label: "Twitter / X", icon: Twitter },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "github", label: "GitHub", icon: Github },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "tiktok", label: "TikTok", icon: Music },
  { value: "twitch", label: "Twitch", icon: Radio },
  { value: "discord", label: "Discord", icon: MessageCircle },
  { value: "website", label: "Website", icon: Globe },
];
