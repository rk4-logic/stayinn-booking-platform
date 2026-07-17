
export function mapClerkUser(data: {
  id: string;
  email_addresses: {
    email_address: string;
  }[];
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
}) {
  const email = data.email_addresses[0]?.email_address;

  if (!email) {
    return null;
  }

  return {
    clerkId: data.id,
    email,
    firstName: data.first_name ?? "",
    lastName: data.last_name ?? "",
    imageUrl: data.image_url ?? "",
  };
}