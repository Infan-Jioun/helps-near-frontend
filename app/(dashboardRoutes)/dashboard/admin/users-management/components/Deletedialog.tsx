import { Loader2, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "./types";

interface DeleteDialogProps {
    user: User | null;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteDialog({ user, loading, onConfirm, onCancel }: DeleteDialogProps) {
    return (
        <AlertDialog open={!!user}>
            <AlertDialogContent className="rounded-2xl max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900">Delete User?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500">
                        This will permanently remove{" "}
                        <span className="font-semibold text-gray-800">{user?.name}</span>{" "}
                        from the system. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel onClick={onCancel} disabled={loading} className="rounded-xl">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        Yes, Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}