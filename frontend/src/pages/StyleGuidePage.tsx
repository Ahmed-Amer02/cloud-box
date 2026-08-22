import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-sm font-medium uppercase tracking-wide text-ink-muted">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

function StyleGuidePage() {
  const [progress] = useState(62);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 p-8">
      <header>
        <h1 className="font-display text-2xl font-medium text-ink">CloudBox style guide</h1>
        <p className="text-sm text-ink-muted">Every primitive, in one place, before real data touches any of it.</p>
      </header>

      <Section title="Buttons">
        <Button variant="primary">Upload</Button>
        <Button variant="secondary">New folder</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="primary" disabled>
          Uploading…
        </Button>
      </Section>

      <Section title="Inputs">
        <div className="flex w-64 flex-col gap-1.5">
          <Label htmlFor="demo-input">Folder name</Label>
          <Input id="demo-input" placeholder="New folder" />
        </div>
      </Section>

      <Section title="Badges">
        <Badge>invoices</Badge>
        <Badge variant="accent">design</Badge>
        <Badge variant="success">uploaded</Badge>
        <Badge variant="danger">expired</Badge>
        <Badge variant="outline">draft</Badge>
      </Section>

      <Section title="Card">
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Design assets</CardTitle>
            <CardDescription>12 items</CardDescription>
          </CardHeader>
          <CardContent className="font-mono text-xs text-ink-muted">Modified Aug 12, 2026</CardContent>
        </Card>
      </Section>

      <Section title="Skeleton (loading state)">
        <div className="flex w-72 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Section>

      <Section title="Progress (storage usage)">
        <div className="flex w-72 flex-col gap-1">
          <Progress value={progress} />
          <p className="font-mono text-xs text-ink-muted">3.1 GB of 5 GB used</p>
        </div>
      </Section>

      <Section title="Dropdown menu (row actions)">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Move to…</DropdownMenuItem>
            <DropdownMenuItem>Download</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="Dialog (create / rename)">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">New folder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New folder</DialogTitle>
              <DialogDescription>Name your folder. You can rename it later.</DialogDescription>
            </DialogHeader>
            <Input placeholder="Untitled folder" autoFocus />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button variant="primary">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Alert dialog (destructive confirm)">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete file</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete brief.pdf?</AlertDialogTitle>
              <AlertDialogDescription>
                It moves to trash and can be restored for 30 days.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>

      <Section title="Toast">
        <Button variant="secondary" onClick={() => toast.success('File uploaded')}>
          Trigger success toast
        </Button>
        <Button variant="secondary" onClick={() => toast.error("Couldn't connect. Retry")}>
          Trigger error toast
        </Button>
      </Section>
    </div>
  );
}

export default StyleGuidePage;
