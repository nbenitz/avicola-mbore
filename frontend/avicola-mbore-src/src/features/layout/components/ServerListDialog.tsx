import React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ServerRow = { id: number; name: string; created_at: string };

export default function ServerListDialog({
  open, onOpenChange, items, onLoad
}: {
  open: boolean;
  onOpenChange: (v:boolean)=>void;
  items: ServerRow[];
  onLoad: (id:number)=>void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Layouts en servidor</DialogTitle>
          <DialogDescription>Seleccioná un layout guardado para cargarlo.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] pr-2">
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
                <Button size="sm" onClick={()=>onLoad(item.id)}>Cargar</Button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground">No hay layouts guardados.</div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="secondary" onClick={()=>onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
