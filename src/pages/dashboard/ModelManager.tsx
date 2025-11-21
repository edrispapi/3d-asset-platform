import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModelCard } from '@/components/dashboard/ModelCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Upload, Search, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
'@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'@/components/ui/select';
import { Model3D, DEFAULT_VIEWER_CONFIG } from '@/lib/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';interface BoxProps {children?: React.ReactNode;className?: string;style?: React.CSSProperties;[key: string]: unknown;}
export function ModelManager() {

  const models = useAppStore((state) => state.models);
  const addModel = useAppStore((state) => state.addModel);
  const deleteModel = useAppStore((state) => state.deleteModel);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newModelUrl, setNewModelUrl] = useState('');
  const [newModelTitle, setNewModelTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelUrl.trim() || !newModelTitle.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    const newModel: Model3D = {
      id: uuidv4(),
      title: newModelTitle,
      url: newModelUrl,
      createdAt: Date.now(),
      config: { ...DEFAULT_VIEWER_CONFIG },
      size: 'Pending'
    };
    addModel(newModel);
    toast.success('Model added successfully');
    setIsAddDialogOpen(false);
    setNewModelUrl('');
    setNewModelTitle('');
  };
  const filteredModels = models.filter((model) =>
  model.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleView = (model: Model3D) => {

    toast.info(`Opening ${model.title}...`, { description: 'Detail view coming in Phase 2' });
  };
  return (
    <div className="space-y-8 animate-fade-in">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-zinc-100">3D Assets</h1>
          <p className="text-zinc-400 mt-1">Manage and distribute your 3D product library.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border-none">
              <Plus className="w-4 h-4 mr-2" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New 3D Model</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Enter the URL of your GLB/GLTF file. In production, this will be a file upload.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddModel} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-zinc-300">Model Title</Label>
                <Input
                  id="title"
                  value={newModelTitle}
                  onChange={(e) => setNewModelTitle(e.target.value)}
                  placeholder="e.g. Vintage Chair"
                  className="bg-zinc-900 border-zinc-800 focus:border-blue-500" />

              </div>
              <div className="grid gap-2">
                <Label htmlFor="url" className="text-zinc-300">GLB File URL</Label>
                <Input
                  id="url"
                  value={newModelUrl}
                  onChange={(e) => setNewModelUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-zinc-900 border-zinc-800 focus:border-blue-500" />

              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white">Cancel</Button>
              <Button onClick={handleAddModel} className="bg-blue-600 hover:bg-blue-500 text-white">Add Asset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search models..."
            className="pl-9 bg-zinc-950 border-zinc-800 focus:border-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />

        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px] bg-zinc-950 border-zinc-800">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-200">
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {}
      {filteredModels.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {filteredModels.map((model) =>
        <ModelCard
          key={model.id}
          model={model}
          onDelete={deleteModel}
          onView={handleView} />

        )}
        </div> :

      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
            <Box className="w-6 h-6 text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-zinc-300">No models found</h3>
          <p className="text-zinc-500 mt-1">Try adjusting your search or add a new model.</p>
        </div>
      }
    </div>);

}