import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { ModelCard } from '@/components/dashboard/ModelCard';
import { Input } from '@/components/ui/input';
import { Search, Box } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Model3D } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadSimulator } from '@/components/dashboard/UploadSimulator';
import { motion } from 'framer-motion';
export function ModelManager() {
  const navigate = useNavigate();
  const models = useAppStore((state) => state.models);
  const isLoading = useAppStore((state) => state.isLoading);
  const fetchModels = useAppStore((state) => state.fetchModels);
  const addModel = useAppStore((state) => state.addModel);
  const deleteModel = useAppStore((state) => state.deleteModel);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);
  const filteredModels = useMemo(() =>
    models.filter((model) =>
      model.title.toLowerCase().includes(searchQuery.toLowerCase())
    ), [models, searchQuery]);
  const handleView = (model: Model3D) => {
    navigate(`/dashboard/models/${model.id}`);
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      );
    }
    if (filteredModels.length > 0) {
      return (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {filteredModels.map((model) => (
            <motion.div
              key={model.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ModelCard model={model} onDelete={deleteModel} onView={handleView} />
            </motion.div>
          ))}
        </motion.div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <Box className="w-6 h-6 text-zinc-600" />
        </div>
        <h3 className="text-lg font-medium text-zinc-300">No models found</h3>
        <p className="text-zinc-500 mt-1">Try adjusting your search or add a new model.</p>
      </div>
    );
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-zinc-100">3D Assets</h1>
            <p className="text-zinc-400 mt-1">Manage and distribute your 3D product library.</p>
          </div>
          <UploadSimulator onUpload={addModel} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search models..."
              className="pl-9 bg-zinc-950 border-zinc-800 focus:border-zinc-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
        {renderContent()}
      </div>
    </div>
  );
}