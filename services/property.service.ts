import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { IProperty, PropertyStatus } from "@/types/property.types";
import { generateUniqueSlug } from "@/lib/utils/slug";
import { getPaginationMeta } from "@/lib/utils/pagination";

export interface CreatePropertyData {
  ownerId: string;
  name: string;
  description: string;
  propertyType: IProperty["propertyType"];
  location: IProperty["location"];
  contact: IProperty["contact"];
  amenities?: string[];
  currency?: IProperty["currency"];
}

export interface UpdatePropertyData {
  name?: string;
  description?: string;
  propertyType?: IProperty["propertyType"];
  location?: IProperty["location"];
  contact?: IProperty["contact"];
  amenities?: string[];
  currency?: IProperty["currency"];
  status?: IProperty["status"];
}

export interface GetPropertiesFilters {
  city?: string;
  country?: string;
  propertyType?: IProperty["propertyType"];
  status?: PropertyStatus;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

function buildLocation(location: CreatePropertyData["location"]) {
  if (!location) return undefined;

  return {
    ...location,
    coordinates:
      location.latitude != null && location.longitude != null
        ? {
            type: "Point" as const,
            coordinates: [location.longitude, location.latitude],
          }
        : undefined,
  };
}

export async function createProperty(data: CreatePropertyData) {
  await connectDB();

  const slug = await generateUniqueSlug(data.name, Property);

  const property = await Property.create({
    ...data,
    location: buildLocation(data.location),
    slug,
    status: PropertyStatus.DRAFT,
    rating: 0,
    totalReviews: 0,
    startingPrice: 0,
    isFeatured: false,
  });

  return property.toObject();
}

export async function updateProperty(
  propertyId: string,
  ownerId: string,
  data: UpdatePropertyData,
  isAdmin = false
) {
  await connectDB();

  const filter = isAdmin
    ? { _id: propertyId, isDeleted: false }
    : { _id: propertyId, ownerId, isDeleted: false };

  // Rebuild location with GeoJSON coordinates if location data exists
  const updateData = {
    ...data,
    ...(data.location && { location: buildLocation(data.location) }),
  };

  const property = await Property.findOneAndUpdate(
    filter,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  return property ?? null;
}

export async function deleteProperty(
  propertyId: string,
  ownerId: string,
  isAdmin = false
) {
  await connectDB();

  const filter = isAdmin
    ? { _id: propertyId, isDeleted: false }
    : { _id: propertyId, ownerId, isDeleted: false };

  const property = await Property.findOneAndUpdate(
    filter,
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        status: PropertyStatus.INACTIVE,
      },
    },
    { new: true }
  ).lean();

  return property ?? null;
}

export async function getPropertyById(propertyId: string) {
  await connectDB();

  const property = await Property.findOne({
    _id: propertyId,
    isDeleted: false,
  }).lean();

  return property ?? null;
}

export async function getPropertyBySlug(slug: string) {
  await connectDB();

  const property = await Property.findOne({
    slug,
    isDeleted: false,
    status: PropertyStatus.APPROVED,
  }).lean();

  return property ?? null;
}

export async function getProperties(filters: GetPropertiesFilters = {}) {
  await connectDB();

  const {
    city,
    country,
    propertyType,
    status = PropertyStatus.APPROVED,
    isFeatured,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
  } = filters;

  const query: {
    isDeleted: boolean;
    status: PropertyStatus;
    "location.city"?: RegExp;
    "location.country"?: RegExp;
    propertyType?: IProperty["propertyType"];
    isFeatured?: boolean;
    startingPrice?: { $gte?: number; $lte?: number };
    } = {
        isDeleted: false,
        status,
    };

  if (city) query["location.city"] = new RegExp(city, "i");
  if (country) query["location.country"] = new RegExp(country, "i");
  if (propertyType) query.propertyType = propertyType;
  if (isFeatured !== undefined) query.isFeatured = isFeatured;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.startingPrice = {};
    if (minPrice !== undefined) query.startingPrice.$gte = minPrice;
    if (maxPrice !== undefined) query.startingPrice.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    Property.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(query),
  ]);

  return {
    properties,
    ...getPaginationMeta(total, page, limit),
  };
}

export async function getOwnerProperties(ownerId: string) {
  await connectDB();

  return Property.find({
    ownerId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function searchProperties(
  searchText: string,
  page = 1,
  limit = 12
) {
  await connectDB();

  const skip = (page - 1) * limit;

  const searchFilter = {
    $text: { $search: searchText },
    isDeleted: false,
    status: PropertyStatus.APPROVED,
  };

  const [properties, total] = await Promise.all([
    Property.find(searchFilter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(searchFilter),
  ]);

  return {
    properties,
    ...getPaginationMeta(total, page, limit),
  };
}

// Admin only functions

export async function approveProperty(propertyId: string) {
  await connectDB();

  const property = await Property.findOneAndUpdate(
    { _id: propertyId, isDeleted: false },
    { $set: { status: PropertyStatus.APPROVED } },
    { new: true }
  ).lean();

  return property ?? null;
}

export async function rejectProperty(propertyId: string) {
  await connectDB();

  const property = await Property.findOneAndUpdate(
    { _id: propertyId, isDeleted: false },
    { $set: { status: PropertyStatus.REJECTED } },
    { new: true }
  ).lean();

  return property ?? null;
}

export async function toggleFeatured(propertyId: string) {
  await connectDB();

  const property = await Property.findOne({
    _id: propertyId,
    isDeleted: false,
  });

  if (!property) return null;

  const updated = await Property.findByIdAndUpdate(
    propertyId,
    { $set: { isFeatured: !property.isFeatured } },
    { new: true }
  ).lean();

  return updated ?? null;
}

export async function submitForReview(propertyId: string, ownerId: string) {
  await connectDB();

  const property = await Property.findOneAndUpdate(
    {
      _id: propertyId,
      ownerId,
      isDeleted: false,
      status: PropertyStatus.DRAFT, // only draft can be submitted
    },
    { $set: { status: PropertyStatus.PENDING } },
    { new: true }
  ).lean();

  return property ?? null;
}