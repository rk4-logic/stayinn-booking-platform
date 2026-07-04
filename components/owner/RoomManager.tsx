"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { createRoomAction, deleteRoomAction } from "@/actions/room.actions";
import { RoomType, BedType, type RoomManagerProps } from "@/types/room.types";
import { formatCurrency } from "@/lib/utils/formatCurrency";


export default function RoomManager({
  propertyId,
  rooms: initialRooms,
  currency,
}: RoomManagerProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms);
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
    if (!pricePerNight) return toast.error("Price is required");

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
      toast.success("Room created successfully");
      resetForm();
      router.refresh();
    } else {
      toast.error("Failed to create room");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoading(true);

    const result = await deleteRoomAction(deletingId, propertyId);

    if (result.success) {
      toast.success("Room deleted");
      setRooms(rooms.filter((r) => String(r._id) !== deletingId));
      router.refresh();
    } else {
      toast.error("Failed to delete room");
    }

    setLoading(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Add Room Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Room"}
        </Button>
      </div>

      {/* Add Room Form */}
      {showForm && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-2">
            New Room
          </h3>

          <div className="space-y-1.5">
            <Label>Room Name *</Label>
            <Input
              placeholder="e.g. Deluxe Suite 101"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Room Type *</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RoomType).map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
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
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Beds</Label>
              <Input
                type="number"
                min="1"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Guests</Label>
              <Input
                type="number"
                min="1"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price/Night ({currency})</Label>
              <Input
                type="number"
                min="0"
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

      {/* Room List */}
      {rooms.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-400">
          No rooms yet. Add your first room above.
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={String(room._id)}
              className="bg-white border rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">
                    {room.roomName}
                  </h4>
                  <Badge
                    variant="secondary"
                    className="capitalize text-xs"
                  >
                    {room.roomType}
                  </Badge>
                  {!room.isAvailable && (
                    <Badge variant="destructive" className="text-xs">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {room.beds} {room.bedType} bed{room.beds > 1 ? "s" : ""} •
                  Max {room.maxGuests} guests •{" "}
                  {formatCurrency(room.pricePerNight, currency)}/night
                </p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeletingId(String(room._id))}
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
        description="Are you sure you want to delete this room? This cannot be undone."
        confirmLabel="Delete"
        loading={loading}
      />
    </div>
  );
}