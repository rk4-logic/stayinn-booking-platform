// scripts/seed.ts
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { SEED_PROPERTIES, SEED_ROOMS } from "./data/mockData";

// IMPORTANT: Replace these imports with the exact relative paths to your global models
import User from "../models/User";
import Property from "../models/Property";
import Room from "../models/Room";
import { UserRole } from "../types/user.types";
import { PropertyStatus, PropertyType } from "../types/property.types";
import { Currency } from "../types/common.types";
import type { IUser } from "../types/user.types";
import type { IProperty } from "../types/property.types";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
// Check for a real user's Clerk ID provided in the environment variable. 
// If it exists, we will link the dummy properties to your actual user so you can log in and test.
const REAL_CLERK_ID = process.env.SEED_OWNER_CLERK_ID;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is missing in your .env file.");
  process.exit(1);
}

async function seed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected!");

    // ─── Clean existing seed data ───────────────────────────────────────────────
    console.log("🧹 Cleaning existing seed properties & associated rooms...");
    const propertySlugs = SEED_PROPERTIES.map(p => p.slug);
    
    // Find matching properties first so we can remove their child rooms cleanly
    const existingProperties = await Property.find({ slug: { $in: propertySlugs } });
    const existingPropertyIds = existingProperties.map(p => p._id);
    
    await Property.deleteMany({ slug: { $in: propertySlugs } });
    await Room.deleteMany({ propertyId: { $in: existingPropertyIds } });
    console.log("✅ Stale demo data cleared.");

    // ─── Handle Owner Assignment ───────────────────────────────────────────────
    let owner: IUser | null = null;
    
    if (REAL_CLERK_ID) {
      console.log(`🔍 Searching for real owner with Clerk ID: ${REAL_CLERK_ID}...`);
      owner = await User.findOne({ clerkId: REAL_CLERK_ID });
      if (!owner) {
        console.log("⚠️ Provided Clerk ID not found in database. Falling back to default mock owner.");
      }
    }

    if (!owner) {
      owner = await User.findOne({ email: "owner@stayinn.demo" });
      if (!owner) {
        owner = await User.create({
          clerkId: "seed_owner_" + Date.now(),
          email: "owner@stayinn.demo",
          firstName: "Demo",
          lastName: "Owner",
          role: UserRole.OWNER,
        });
        console.log("✅ Created fallback demo owner:", owner.email);
      } else {
        console.log("✅ Found existing fallback owner:", owner.email);
      }
    } else {
      console.log("🎯 Linked seed data to your real account identity:", owner.email);
    }

    // ─── Create properties and child rooms ─────────────────────────────────────
    console.log("🏨 Creating properties...");

    for (const propertyData of SEED_PROPERTIES) {
      const payload: Partial<IProperty> & { ownerId: IProperty["ownerId"] } = {
        ...propertyData,
        ownerId: owner._id,
        propertyType: propertyData.propertyType as PropertyType,
        status: propertyData.status as PropertyStatus,
        currency: (propertyData.currency as string) as Currency,
      };

      const property = await Property.create(payload);

      console.log(`   ├── Property Generated: ${property.name}`);

      // Map over the matching rooms for this specific property
      const rooms = SEED_ROOMS[propertyData.slug] || [];
      for (const roomData of rooms) {
        const normalizedImages: Array<{
          url: string;
          publicId?: string;
          alt?: string;
          width?: number;
          height?: number;
          isCover: boolean;
        }> = (roomData.images ?? []).map((image: unknown, index: number) => {
          if (typeof image === "string") {
            return {
              url: image,
              alt: `${roomData.roomName} image ${index + 1}`,
              isCover: index === 0,
            };
          }

          return image as {
            url: string;
            publicId?: string;
            alt?: string;
            width?: number;
            height?: number;
            isCover: boolean;
          };
        });

        await Room.create({
          ...roomData,
          propertyId: property._id,
          roomType: roomData.roomType as import("../types/room.types").RoomType,
          bedType: roomData.bedType as import("../types/room.types").BedType,
          currency: propertyData.currency as Currency,
          images: normalizedImages,
        });
      }

      console.log(`   └── Created ${rooms.length} room layouts for ${property.name}`);
    }

    console.log("\n🎉 Seed script finished successfully!");
    console.log(`📊 Total properties built: ${SEED_PROPERTIES.length}`);
    
  } catch (error) {
    console.error("❌ An error occurred during database seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

seed();