import { notFound } from "next/navigation";
import { getPropertyAction } from "@/actions/property.actions";
import { getRoomsByPropertyAction } from "@/actions/room.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import RoomManager from "@/components/owner/RoomManager";
import { serializeData } from "@/lib/utils/serialize";

interface PageProps {
    params: Promise<{ id: string }>;
}

interface Room {
  _id: string;
  roomName: string;
  roomType: string;
  bedType: string;
  beds: number;
  maxGuests: number;
  pricePerNight: number;
  isAvailable: boolean;
}

export default async function OwnerRoomsPage({ params }: PageProps) {
    const { id } = await params;

    const property = await getPropertyAction(id);
    if (!property) notFound();

    const roomsResult = await getRoomsByPropertyAction(id);
    const serializedRooms = serializeData(roomsResult.rooms ?? []) as unknown as Room[];

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <Container>
                <PageHeader
                    title={`Rooms — ${property.name}`}
                    description="Add and manage your property rooms and rates"
                />
                <RoomManager
                    propertyId={id}
                    rooms={serializedRooms}
                    currency={property.currency || "USD"}
                />
            </Container>
        </div>
    );
}