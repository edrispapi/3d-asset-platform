import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
export function Settings() {
  const settings = useAppStore((state) => state.settings);
  const fetchSettings = useAppStore((state) => state.fetchSettings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const [localSettings, setLocalSettings] = useState(settings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      await fetchSettings();
      setIsLoading(false);
    };
    loadSettings();
  }, [fetchSettings]);
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings);
  const handleSettingChange = (key: keyof typeof localSettings, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      toast.success('Settings updated successfully.');
    } catch (error) {
      toast.error('Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-zinc-100">Settings</h1>
          <p className="text-zinc-400 mt-1">Manage your platform's global configuration.</p>
        </div>
        <Tabs defaultValue="viewer" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-zinc-900 border-zinc-800">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="viewer">Viewer Defaults</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Platform-wide general settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">General settings coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="viewer">
            <Card className="bg-zinc-900/50 border-zinc-800 max-w-2xl">
              <CardHeader>
                <CardTitle>Default Viewer Settings</CardTitle>
                <CardDescription>Set the default configuration for new 3D models.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ar-default" className="flex flex-col gap-1">
                    <span>Enable AR by Default</span>
                    <span className="text-xs text-zinc-500">Activates AR mode for new models.</span>
                  </Label>
                  <Switch id="ar-default" checked={localSettings.arDefault} onCheckedChange={(v) => handleSettingChange('arDefault', v)} />
                </div>
                <div className="space-y-3">
                  <Label>Default Upload Limit ({localSettings.uploadLimit} MB)</Label>
                  <Slider value={[localSettings.uploadLimit]} onValueChange={([v]) => handleSettingChange('uploadLimit', v)} min={10} max={200} step={10} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security configurations.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">Security settings coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {hasChanges && (
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-blue-600 hover:bg-blue-500">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}