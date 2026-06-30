"use server";

import { revalidatePath } from "next/cache";
import {
  createPropertySchema,
  updatePropertySchema,
  updatePropertyStatusSchema,
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
} from "@/services/property.service";
import { UserRole } from "@/types/user.types";
import { type ActionResult } from "@/types/common.types";
import { getAuthenticatedUser, requireRole } from "./user.actions";

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
  return getPropertyById(propertyId);
}

export async function getPropertyBySlugAction(slug: string) {
  return getPropertyBySlug(slug);
}

export async function getPropertiesAction(filters: GetPropertiesFilters = {}) {
  return getProperties(filters);
}

export async function getOwnerPropertiesAction() {
  const user = await getAuthenticatedUser();
  return getOwnerProperties(user._id.toString());
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
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await requireRole(UserRole.ADMIN);

    const parsed = updatePropertyStatusSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const property = await updateProperty(
      propertyId,
      user._id.toString(),
      {}
    );

    revalidatePath("/admin/properties");
    return { success: true, data: property ?? {} };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}