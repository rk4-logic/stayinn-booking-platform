"use server";

import { revalidatePath } from "next/cache";
import {
  createPropertySchema,
  updatePropertySchema,
} from "@/lib/validations/property.validation";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyById,
  getPropertyBySlug,
  getProperties,
  getOwnerProperties,
  approveProperty,
  rejectProperty,
  toggleFeatured,
  searchProperties,
  type GetPropertiesFilters,
  submitForReview,
} from "@/services/property.service";
import { UserRole } from "@/types/user.types";
import { type ActionResult } from "@/types/common.types";
import { getAuthenticatedUser, requireRole } from "./user.actions";
import type { PropertyStatus } from "@/types/property.types";
import { serializeData } from "@/lib/utils/serialize";

export async function createPropertyAction(
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await requireRole(UserRole.OWNER, UserRole.ADMIN);

    const parsed = createPropertySchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const property = await createProperty({
      ownerId: user._id.toString(),
      ...parsed.data,
    });

    revalidatePath("/owner/properties");
    return { success: true, data: property };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create property",
    };
  }
}

export async function updatePropertyAction(
  propertyId: string,
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();

    const parsed = updatePropertySchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const property = await updateProperty(
      propertyId,
      user._id.toString(),
      parsed.data
    );

    if (!property) return { success: false, error: "Property not found" };

    revalidatePath("/owner/properties");
    revalidatePath(`/properties/${propertyId}`);
    return { success: true, data: property };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update property",
    };
  }
}

export async function deletePropertyAction(
  propertyId: string
): Promise<ActionResult> {
  try {
    const user = await getAuthenticatedUser();

    const property = await deleteProperty(propertyId, user._id.toString());
    if (!property) return { success: false, error: "Property not found" };

    revalidatePath("/owner/properties");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete property",
    };
  }
}

export async function getPropertyAction(propertyId: string) {
  const property = await getPropertyById(propertyId);
  return serializeData(property);
}

export async function getPropertyBySlugAction(slug: string) {
  const property = await getPropertyBySlug(slug);
  return serializeData(property);
}

export async function getPropertiesAction(filters: GetPropertiesFilters = {}) {
  const result = await getProperties(filters);
  return serializeData(result);
}

export async function getOwnerPropertiesAction() {
  try {
    const user = await getAuthenticatedUser();

    if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
      return [];
    }

    const properties = await getOwnerProperties(user._id.toString());
    return serializeData(properties);
  } catch {
    return [];
  }
}

export async function searchPropertiesAction(
  searchText: string,
  page = 1,
  limit = 12
) {
  return searchProperties(searchText, page, limit);
}

export async function approvePropertyAction(
  propertyId: string
): Promise<ActionResult<object>> {
  try {
    await requireRole(UserRole.ADMIN);
    const property = await approveProperty(propertyId);
    revalidatePath("/admin/properties");
    return { success: true, data: property ?? {} };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}

export async function rejectPropertyAction(
  propertyId: string
): Promise<ActionResult<object>> {
  try {
    await requireRole(UserRole.ADMIN);
    const property = await rejectProperty(propertyId);
    revalidatePath("/admin/properties");
    return { success: true, data: property ?? {} };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}

export async function toggleFeaturedAction(
  propertyId: string
): Promise<ActionResult<object>> {
  try {
    await requireRole(UserRole.ADMIN);
    const property = await toggleFeatured(propertyId);
    revalidatePath("/admin/properties");
    return { success: true, data: property ?? {} };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}

export async function updatePropertyStatusAction(
  propertyId: string,
  data: { status: PropertyStatus }
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();

    const property = await updateProperty(
      propertyId,
      user._id.toString(),
      { status: data.status }
    );

    if (!property) return { success: false, error: "Property not found" };

    revalidatePath("/owner/properties");
    return { success: true, data: property };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}

export async function submitPropertyForReviewAction(
  propertyId: string
): Promise<ActionResult<void>> {
  try {
    const user = await getAuthenticatedUser();

    const property = await submitForReview(
      propertyId,
      user._id.toString()
    );

    if (!property) {
      return {
        success: false,
        error: "Property not found or already submitted",
      };
    }

    revalidatePath("/owner/properties");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}

export async function adminDeletePropertyAction(
  propertyId: string
): Promise<ActionResult<void>> {
  try {
    const admin = await requireRole(UserRole.ADMIN);
    const property = await deleteProperty(
      propertyId,
      admin._id.toString(),
      true // isAdmin bypass
    );
    if (!property) return { success: false, error: "Property not found" };
    revalidatePath("/admin/properties");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete property",
    };
  }
}