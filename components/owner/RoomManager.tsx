"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, BedDouble, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "../shared/ConfirmDialogue";
import EmptyState from "@/components/shared/EmptyState";
import { createRoomAction, deleteRoomAction } from "@/actions/room.actions";
import { RoomType, BedType } from "@/types/room.types";
import { formatCurrency } from "@/lib/utils/formatCurrency";

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

interface RoomManagerProps {
  propertyId: string;
  rooms: Room[];
  currency: string;
}

export default function RoomManager({
  propertyId,
  rooms: initialRooms,
  currency,
}: RoomManagerProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [bedType, setBedType] = useState("");
  const [beds, setBeds] = useState("1");
  const [maxGuests, setMaxGuests] = useState("2");
  const [pricePerNight, setPricePerNight] = useState("");

  const resetForm = () => {
    setRoomName("");
    setRoomType("");
    setBedType("");
    setBeds("1");
    setMaxGuests("2");
    setPricePerNight("");
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!roomName.trim()) return toast.error("Room name is required");
    if (!roomType) return toast.error("Room type is required");
    if (!bedType) return toast.error("Bed type is required");
    if (!pricePerNight || Number(pricePerNight) <= 0) {
      return toast.error("Valid price per night is required");
    }

    setLoading(true);

    const result = await createRoomAction(propertyId, {
      roomName: roomName.trim(),
      roomType: roomType as RoomType,
      bedType: bedType as BedType,
      beds: Number(beds),
      maxGuests: Number(maxGuests),
      pricePerNight: Number(pricePerNight),
    });

    if (result.success) {
      toast.success("Room created successfully!");
      resetForm();
      setRooms((prev) => [...prev, result.data as Room]);
    } else {
      toast.error(
        typeof result.error === "string"
          ? result.error
          : "Failed to create room"
      );
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoading(true);

    const result = await deleteRoomAction(deletingId, propertyId);

    if (result.success) {
      toast.success("Room deleted");
      setRooms((prev) => prev.filter((r) => r._id !== deletingId));
      router.refresh();
    } else {
      toast.error("Failed to delete room");
    }

    setLoading(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Room"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 border-b pb-2">
            New Room Configuration
          </h3>

          <div className="space-y-1.5">
            <Label>Room Name *</Label>
            <Input
              placeholder="e.g. Executive Ocean Suite"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Room Type *</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RoomType).map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Bed Type *</Label>
              <Select value={bedType} onValueChange={setBedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bed" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BedType).map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Beds</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Guests</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price/Night ({currency})</Label>
              <Input
                type="number"
                min="1"
                placeholder="0"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create Room"}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {rooms.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="No rooms created yet"
          description="Add your first room to enable guest bookings for this property."
        />
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white border rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">
                    {room.roomName}
                  </h4>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {room.roomType}
                  </Badge>
                  {!room.isAvailable && (
                    <Badge variant="destructive" className="text-xs">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" />
                    <span>
                      {room.beds} {room.bedType} bed{room.beds > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>Max {room.maxGuests} guests</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(room.pricePerNight, currency)}/night
                  </span>
                </div>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeletingId(room._id)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Room"
        description="Are you sure you want to delete this room? This action cannot be undone."
        confirmLabel="Delete Room"
        loading={loading}
      />
    </div>
  );
}