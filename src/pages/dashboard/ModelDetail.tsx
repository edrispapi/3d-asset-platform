import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { ModelViewerWrapper } from '@/components/ui/model-viewer-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Code2, Copy, Check } from 'lucide-react';
import { Model3D, ViewerConfig } from '@/lib/types';
import { api } from '@/lib/api-client';
export function ModelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateModelInStore = useAppStore((state) => state.updateModel);
  const [model, setModel] = useState<Model3D | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ViewerConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!id) {
      setError('No model ID provided.');
      setIsLoading(false);
      return;
    }
    const fetchModel = async () => {
      try {
        setIsLoading(true);
        const data = await api<Model3D>(`/api/models/${id}`);
        setModel(data);
        setConfig(data.config);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model data.');
        toast.error('Failed to load model.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchModel();
  }, [id]);
  const handleConfigChange = (key: keyof ViewerConfig, value: any) => {
    if (!config) return;
    setConfig((prev) => (prev ? { ...prev, [key]: value } : null));
    setHasChanges(true);
  };
  const handleSaveChanges = async () => {
    if (!id || !config) return;
    setIsSaving(true);
    try {
      await updateModelInStore(id, { config });
      setHasChanges(false);
      toast.success('Viewer settings saved successfully.');
    } catch (err) {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };
  const embedCode = useMemo(() => {
    if (!id) return '';
    return `<iframe src="${window.location.origin}/embed/${id}" width="100%" height="600" frameborder="0" allow="ar; camera; fullscreen"></iframe>`;
  }, [id]);
  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Embed code copied!');
    setTimeout(() => setCopied(false), 2000);
  };
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (error || !model || !config) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-400">Error</h2>
        <p className="text-zinc-400 mt-2">{error || 'Could not find the specified model.'}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/dashboard/models">Go Back</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div>
          <Button variant="ghost" size="sm" className="mb-4 text-zinc-400 hover:text-zinc-100" onClick={() => navigate('/dashboard/models')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assets
          </Button>
          <h1 className="text-3xl font-display font-bold text-zinc-100">{model.title}</h1>
          <p className="text-zinc-400 mt-1">Configure and embed your 3D asset.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-0 aspect-video">
                <ModelViewerWrapper src={model.url} poster={model.posterUrl} config={config} autoPlay />
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border-zinc-800">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
            </TabsList>
            <TabsContent value="settings">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle>Viewer Settings</CardTitle>
                  <CardDescription>Customize the look and feel of the embedded viewer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-rotate">Auto Rotate</Label>
                    <Switch id="auto-rotate" checked={config.autoRotate} onCheckedChange={(v) => handleConfigChange('autoRotate', v)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="camera-controls">Camera Controls</Label>
                    <Switch id="camera-controls" checked={config.cameraControls} onCheckedChange={(v) => handleConfigChange('cameraControls', v)} />
                  </div>
                  <div className="space-y-3">
                    <Label>Exposure ({config.exposure.toFixed(1)})</Label>
                    <Slider value={[config.exposure]} onValueChange={([v]) => handleConfigChange('exposure', v)} min={0} max={2} step={0.1} />
                  </div>
                  <div className="space-y-3">
                    <Label>Shadow Intensity ({config.shadowIntensity.toFixed(1)})</Label>
                    <Slider value={[config.shadowIntensity]} onValueChange={([v]) => handleConfigChange('shadowIntensity', v)} min={0} max={2} step={0.1} />
                  </div>
                  {hasChanges && (
                    <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-500">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="embed">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle>Embed Code</CardTitle>
                  <CardDescription>Copy and paste this code into your website's HTML.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-zinc-950 p-4 rounded-md text-sm text-zinc-300 overflow-x-auto">
                      <code>{embedCode}</code>
                    </pre>
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8 text-zinc-400 hover:text-white" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}