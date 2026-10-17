import type { AvatarId } from "@/game/types"

export type HairStyle = "crop" | "fade" | "locks" | "afro" | "bun" | "waves" | "long" | "bob"

export type Look = {
  id: string
  name: string
  role: string
  line: string
  skin: string
  hair: string
  hairStyle: HairStyle
  shirt: string
  beard?: boolean
  feminine?: boolean
  band?: boolean
  photo?: string
}

export const PLAYERS: (Look & { id: AvatarId })[] = [
  { id: "kian", name: "Kian", role: "Keeper", line: "Teal shirt, easy smile, first one into the mango trees.", skin: "#6a4032", hair: "#1a120e", hairStyle: "crop", shirt: "#148a86", photo: "/art/look/kian.png" },
  { id: "malik", name: "Malik", role: "Keeper", line: "Curls, a green tee, and the morning round.", skin: "#4a2c22", hair: "#140e0c", hairStyle: "fade", shirt: "#1c3a34", photo: "/art/look/malik.png" },
  { id: "zion", name: "Zion", role: "Keeper", line: "Red cap, gold chain, and time for the long jobs.", skin: "#5c382c", hair: "#24160f", hairStyle: "locks", shirt: "#8a5a12", photo: "/art/look/zion.png" },
  { id: "andre", name: "André", role: "Keeper", line: "Straw hat, sun on his shoulders, easy in the orchard.", skin: "#c48a62", hair: "#3a2418", hairStyle: "waves", shirt: "#2a6f9a", photo: "/art/look/ellis.png" },
  { id: "owen", name: "Owen", role: "Keeper", line: "Cap tilted, young, and already knows the path.", skin: "#8a5a3c", hair: "#1a120e", hairStyle: "crop", shirt: "#3d6b8a", photo: "/art/look/owen.png" },
  { id: "nia", name: "Nia", role: "Keeper", line: "Braids, gold hoops, and a sharp eye for ripe mango.", skin: "#5a3428", hair: "#1a120e", hairStyle: "afro", shirt: "#c45c3a", feminine: true, photo: "/art/look/nia.png" },
  { id: "irie", name: "Irie", role: "Keeper", line: "Headwrap, warm smile, no patience for a rushed bottle.", skin: "#6b4032", hair: "#2a1a12", hairStyle: "locks", shirt: "#c47a3a", feminine: true, band: true, photo: "/art/look/irie.png" },
  { id: "sasha", name: "Sasha", role: "Keeper", line: "A flower in her hair and flour or soil either day.", skin: "#e0b08a", hair: "#4a2c22", hairStyle: "bun", shirt: "#0f6e6a", feminine: true, photo: "/art/look/june.png" },
  { id: "claire", name: "Claire", role: "Keeper", line: "Silver curls, glasses, and a notebook for the cellar.", skin: "#c4a090", hair: "#e8e0d8", hairStyle: "long", shirt: "#8a5a6a", feminine: true, photo: "/art/look/claire.png" },
  { id: "priya", name: "Priya", role: "Keeper", line: "A high bun and a gift for the sweet end of the menu.", skin: "#d09a6a", hair: "#2a1c14", hairStyle: "bob", shirt: "#a33b32", feminine: true, photo: "/art/look/keisha.png" },
  { id: "rohan", name: "Rohan", role: "Keeper", line: "Happiest when the grill is lit and the boat is in.", skin: "#c4845c", hair: "#1c140e", hairStyle: "waves", shirt: "#1c3a34", photo: "/art/look/malik.png" },
]

export const GUESTS: Look[] = [
  { id: "marva", name: "Granny Marva", role: "The press", line: "Purple headwrap, wooden spoon, and the best jam on the cove.", skin: "#6a4032", hair: "#2a1a12", hairStyle: "bun", shirt: "#6b3a8a", feminine: true, photo: "/art/look/marva.png" },
  { id: "imani", name: "Imani Holt", role: "Mail boat", line: "She runs the morning boat and still looks like the poster.", skin: "#4e2e24", hair: "#140e0c", hairStyle: "long", shirt: "#c47a3a", feminine: true, photo: "/art/look/nia.png" },
  { id: "ellis", name: "Ellis Reid", role: "Off-island baker", line: "Straw hat, bright grin, always bargaining for mangoes.", skin: "#b87a52", hair: "#2c1a12", hairStyle: "waves", shirt: "#2a6f9a", photo: "/art/look/ellis.png" },
  { id: "june", name: "June Palmer", role: "Regular", line: "A flower behind her ear and a cherry order.", skin: "#5c3428", hair: "#1a120e", hairStyle: "bob", shirt: "#7a3e8a", feminine: true, photo: "/art/look/june.png" },
  { id: "aya", name: "Aya Bennett", role: "Harbour guest", line: "Headwrap and a plate if the grill is awake.", skin: "#e0b090", hair: "#3a2418", hairStyle: "bun", shirt: "#a33b32", feminine: true, photo: "/art/look/irie.png" },
  { id: "liang", name: "Mr. Liang", role: "Wine buyer", line: "Patient, and only interested once a bottle has rested.", skin: "#8a5a3c", hair: "#1a120e", hairStyle: "fade", shirt: "#243044", photo: "/art/look/owen.png" },
  { id: "lenny", name: "Lenny Parks", role: "Beach jerk", line: "The pan on Bonnet Cay never quite cools.", skin: "#5a3428", hair: "#24160f", hairStyle: "locks", shirt: "#e2a04a", beard: true, photo: "/art/look/zion.png" },
  { id: "keisha", name: "Keisha Grant", role: "Beach order", line: "She waits under the umbrella and pays well for a proper plate.", skin: "#6a4032", hair: "#1c120e", hairStyle: "bun", shirt: "#c4473a", feminine: true, photo: "/art/look/keisha.png" },
]

export function playerLook(id: AvatarId): Look {
  return PLAYERS.find((p) => p.id === id) ?? PLAYERS[0]
}

export function guestLook(name: string): Look | undefined {
  return GUESTS.find((g) => g.name === name)
}
